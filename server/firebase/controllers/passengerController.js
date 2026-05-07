// controllers/passengerController.js

const { firestoreDb, realtimeDb } = require('../config/firebase')
const QRCode                      = require('qrcode')
const axios                       = require('axios')


// ── Get My Profile ────────────────────────────────
const getMyProfile = async (req, res) => {
    try {
        const uid     = req.user.uid
        const userDoc = await firestoreDb.collection('users').doc(uid).get()

        if (!userDoc.exists) {
            return res.status(404).json({ error: 'Passenger not found' })
        }

        const userData = userDoc.data() || {}

        const passengerDoc = await firestoreDb
            .collection('passengers').doc(uid).get()

        const passengerData = passengerDoc.exists ? passengerDoc.data() : null

        if (passengerData?.institutionId && userData.institutionId && passengerData.institutionId !== userData.institutionId) {
            return res.status(403).json({ error: 'Passenger record does not belong to this institution.' })
        }

        res.json({
            user:      userData,
            passenger: passengerData
        })

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}


// ── Get BURG ID ───────────────────────────────────
const getBurgId = async (req, res) => {
    try {
        const uid          = req.user.uid
        const passengerDoc = await firestoreDb
            .collection('passengers').doc(uid).get()

        const passengerData = passengerDoc.data() || {}

        if (!passengerDoc.exists) {
            return res.status(404).json({ error: 'Passenger not found' })
        }

        res.json({ burgId: passengerData.burgId })

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}


// ── Generate QR Code for Boarding ─────────────────
const generateQR = async (req, res) => {
    try {
        const uid          = req.user.uid
        const passengerDoc = await firestoreDb
            .collection('passengers').doc(uid).get()

        if (!passengerDoc.exists) {
            return res.status(404).json({ error: 'Passenger not found' })
        }

        const passengerData = passengerDoc.data() || {}
        if (passengerData.institutionId && req.user?.institutionId && passengerData.institutionId !== req.user.institutionId) {
            return res.status(403).json({ error: 'Passenger record does not belong to this institution.' })
        }

        const burgId = passengerData.burgId

        // Generate QR code as base64 image
        const qrDataURL = await QRCode.toDataURL(
            JSON.stringify({ uid, burgId, timestamp: Date.now() })
        )

        res.json({ qrCode: qrDataURL, burgId })

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}


// ── Scan QR to Board ──────────────────────────────
const scanQR = async (req, res) => {
    try {
        const { qrData, busId, tripId } = req.body
        const parsed                    = JSON.parse(qrData)
        const passengerUid              = parsed.uid

        // Verify passenger exists and belongs to this bus
        const passengerDoc = await firestoreDb
            .collection('passengers').doc(passengerUid).get()

        if (!passengerDoc.exists) {
            return res.status(404).json({ error: 'Passenger not found' })
        }

        const passengerData = passengerDoc.data() || {}

        if (passengerData.busId !== busId) {
            return res.status(400).json({ error: 'Passenger not assigned to this bus' })
        }

        const busDoc = await firestoreDb.collection('buses').doc(busId).get()
        if (!busDoc.exists) {
            return res.status(404).json({ error: 'Bus not found' })
        }

        const busData = busDoc.data() || {}
        if (passengerData.institutionId && busData.institutionId && passengerData.institutionId !== busData.institutionId) {
            return res.status(403).json({ error: 'Bus does not belong to this institution.' })
        }

        // Mark as boarded in trip
        const { FieldValue } = require('firebase-admin/firestore')
        await firestoreDb.collection('trips').doc(tripId).update({
            boardedPassengers: FieldValue.arrayUnion(passengerUid)
        })

        res.json({ message: 'Passenger boarded via QR scan', passengerUid })

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}



// ── Get Live Bus Location (System Design #1) ──────
const getLiveLocation = async (req, res) => {
    try {
        const { busId } = req.params

        const snapshot = await realtimeDb
            .ref(`/liveLocations/${busId}`)
            .once('value')

        const location = snapshot.val()

        if (!location) {
            return res.status(404).json({ error: 'Bus location not available' })
        }

        // Check if location is stale (older than 30 seconds)
        const isStale = Date.now() - location.timestamp > 30000

        res.json({ busId, location, isStale })

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}


// ── Get ETA ───────────────────────────────────────
const getETA = async (req, res) => {
    try {
        const { busId }          = req.params
        const { dropLat, dropLng } = req.query

        // Get bus current location
        const snapshot = await realtimeDb
            .ref(`/liveLocations/${busId}`)
            .once('value')

        const location = snapshot.val()

        if (!location) {
            return res.status(404).json({ error: 'Bus location not available' })
        }

        // Call Google Maps Distance Matrix API
        const response = await axios.get(
            'https://maps.googleapis.com/maps/api/distancematrix/json',
            {
                params: {
                    origins:      `${location.lat},${location.lng}`,
                    destinations: `${dropLat},${dropLng}`,
                    mode:         'driving',
                    key:          process.env.GOOGLE_MAPS_API_KEY
                }
            }
        )

        const element = response.data.rows[0].elements[0]

        if (element.status !== 'OK') {
            return res.status(400).json({ error: 'Could not calculate ETA' })
        }

        res.json({
            etaMinutes:   Math.floor(element.duration.value / 60),
            distanceKm:   (element.distance.value / 1000).toFixed(2),
            etaText:      element.duration.text,
            distanceText: element.distance.text
        })

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}


// ── Get Trip Status ───────────────────────────────
const getTripStatus = async (req, res) => {
    try {
        const uid = req.user.uid

        const passengerDoc = await firestoreDb
            .collection('passengers').doc(uid).get()
        const passengerData = passengerDoc.data() || {}
        const busId        = passengerData.busId

        const tripsSnap = await firestoreDb
            .collection('trips')
            .where('busId',  '==', busId)
            .where('status', '==', 'active')
            .get()

        if (tripsSnap.empty) {
            return res.json({ status: 'No active trip' })
        }

        const trip    = tripsSnap.docs[0].data()
        const boarded = trip.boardedPassengers?.includes(uid) || false
        const dropped = trip.droppedPassengers?.includes(uid) || false

        res.json({
            boarded,
            dropped,
            status: dropped ? 'dropped' : boarded ? 'boarded' : 'not yet boarded'
        })

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}


// ── Get Nearest Alternative Stop (Missed Bus) ─────
const getNearestAlternativeStop = async (req, res) => {
    try {
        const { lat, lng, routeId } = req.query

        // Get all stops on this route
        const routeDoc = await firestoreDb
            .collection('routes').doc(routeId).get()

        if (!routeDoc.exists) {
            return res.status(404).json({ error: 'Route not found' })
        }

        const stops = routeDoc.data().stops

        // Find nearest stop using simple distance formula
        const nearest = stops.reduce((prev, curr) => {
            const prevDist = Math.hypot(prev.lat - lat, prev.lng - lng)
            const currDist = Math.hypot(curr.lat - lat, curr.lng - lng)
            return currDist < prevDist ? curr : prev
        })

        res.json({ nearestStop: nearest })

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}


// ── Get Driver Info ───────────────────────────────
const getDriverInfo = async (req, res) => {
    try {
        const { busId } = req.params

        const busDoc = await firestoreDb.collection('buses').doc(busId).get()

        if (!busDoc.exists) {
            return res.status(404).json({ error: 'Bus not found' })
        }

        const driverDoc = await firestoreDb
            .collection('drivers').doc(busDoc.data().driverId).get()

        res.json({
            busNumber: busDoc.data().busNumber,
            driver: {
                name:  driverDoc.data().name,
                phone: driverDoc.data().phone
            }
        })

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

module.exports = {
    getMyProfile,
    getBurgId,
    generateQR,
    scanQR,
    getLiveLocation,
    getETA,
    getTripStatus,
    getNearestAlternativeStop,
    getDriverInfo
}