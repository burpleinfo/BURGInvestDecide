// controllers/driverController.js

// ════════════════════════════════════════════════════
// SYSTEM DESIGN #1 — Live Location
// ════════════════════════════════════════════════════
// updateLocation() is called every 5 seconds
// by the driver's phone while the trip is active.
//
// Write path:
//   Driver phone → POST /driver/update-location
//   → writes { lat, lng, speed, timestamp } to:
//     Realtime DB → /liveLocations/{busId}
//
// Read path:
//   Passenger app → GET /passenger/live-location/{busId}
//   Admin dashboard → GET /admin/all-locations
//   Both read from Realtime DB directly
//
// Stale detection:
//   Every write includes timestamp (Date.now())
//   Frontend checks: if now - timestamp > 30000ms
//   → show "Location unavailable" on map
//
// Cleanup:
//   When endTrip() is called
//   → Realtime DB location is deleted
//   → No stale bus marker stays on map
// ════════════════════════════════════════════════════

// ════════════════════════════════════════════════════
// SYSTEM DESIGN #3 — Notification Flow
// ════════════════════════════════════════════════════
// markBoarded()  → FCM to passenger with bus + stop info
// markDropped()  → FCM to parent with stop info
// triggerSOS()   → FCM to ALL admins immediately
// shareETA()     → FCM to parents at that stop
// endTrip()      → clears live location from Realtime DB
// ════════════════════════════════════════════════════

const { firestoreDb, realtimeDb } = require('../config/firebase')
const { FieldValue }              = require('firebase-admin/firestore')
const fcmService                  = require('../services/fcmService')


// ── Get My Trip ───────────────────────────────────
const getMyTrip = async (req, res) => {
    try {
        const driverUid = req.user.uid

        const driverDoc = await firestoreDb
            .collection('drivers').doc(driverUid).get()

        if (!driverDoc.exists) {
            return res.status(404).json({ error: 'Driver profile not found' })
        }

        const busId = driverDoc.data().busId

        const tripsSnap = await firestoreDb
            .collection('trips')
            .where('busId',  '==', busId)
            .where('status', '==', 'active')
            .get()

        if (tripsSnap.empty) {
            return res.json({ message: 'No active trip found' })
        }

        const tripDoc  = tripsSnap.docs[0]
        const tripData = tripDoc.data()

        const passengersSnap = await firestoreDb
            .collection('passengers')
            .where('busId', '==', busId)
            .get()

        const passengers = passengersSnap.docs.map(d => ({
            id: d.id,
            ...d.data()
        }))

        res.json({
            tripId:            tripDoc.id,
            busId,
            passengers,
            totalPassengers:   passengers.length,
            boardedCount:      tripData.boardedPassengers?.length || 0,
            droppedCount:      tripData.droppedPassengers?.length || 0,
            boardedPassengers: tripData.boardedPassengers || [],
            droppedPassengers: tripData.droppedPassengers || []
        })

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}


// ── Update Live Location (System Design #1) ───────
const updateLocation = async (req, res) => {
    try {
        const { busId, lat, lng, speed = 0 } = req.body

        if (!busId || !lat || !lng) {
            return res.status(400).json({ error: 'busId, lat and lng are required' })
        }

        await realtimeDb.ref(`/liveLocations/${busId}`).set({
            lat,
            lng,
            speed,
            timestamp: Date.now()
        })

        res.json({ message: 'Location updated' })

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}


// ── Mark Passenger Boarded (System Design #3) ─────
const markBoarded = async (req, res) => {
    try {
        const { studentId }        = req.params
        const { tripId, stopName } = req.body

        if (!tripId) {
            return res.status(400).json({ error: 'tripId is required' })
        }

        // Get passenger details by doc id first, then fallback to uid lookup
        let passengerDoc = await firestoreDb
            .collection('passengers').doc(studentId).get()

        if (!passengerDoc.exists) {
            const passengerByUidSnap = await firestoreDb
                .collection('passengers')
                .where('uid', '==', studentId)
                .limit(1)
                .get()
            if (!passengerByUidSnap.empty) {
                passengerDoc = passengerByUidSnap.docs[0]
            }
        }

        if (!passengerDoc.exists) {
            return res.status(404).json({ error: 'Passenger not found' })
        }

        const passenger = passengerDoc.data()
        const passengerUid = passenger?.uid || studentId

        // Store canonical auth UID in trip so passenger trip-status works reliably
        await firestoreDb.collection('trips').doc(tripId).update({
            boardedPassengers: FieldValue.arrayUnion(passengerUid)
        })

        // Get bus number for notification
        const driverDoc = await firestoreDb
            .collection('drivers').doc(req.user.uid).get()
        const busId     = driverDoc.data().busId

        const busDoc    = await firestoreDb
            .collection('buses').doc(busId).get()
        const busNumber = busDoc.exists ? busDoc.data().busNumber : ''

        // Notify passenger with bus + stop details
        const notifyResult = await fcmService.notifyBoarded(
            passengerUid,
            passenger.name,
            busNumber,
            stopName || 'the stop'
        )

        res.json({
            message: `${passenger.name} marked as boarded. Passenger notified.`,
            studentName: passenger.name,
            passengerUid,
            busNumber,
            stopName: stopName || 'the stop',
            notificationSent: !!notifyResult?.success,
            notificationReason: notifyResult?.success ? null : (notifyResult?.reason || notifyResult?.error || 'send-failed')
        })

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}


// ── Mark Passenger Dropped (System Design #3) ─────
const markDropped = async (req, res) => {
    try {
        const { studentId }        = req.params
        const { tripId, stopName } = req.body

        if (!tripId) {
            return res.status(400).json({ error: 'tripId is required' })
        }

        // Update trip in Firestore
        await firestoreDb.collection('trips').doc(tripId).update({
            droppedPassengers: FieldValue.arrayUnion(studentId)
        })

        // Get passenger details
        const passengerDoc = await firestoreDb
            .collection('passengers').doc(studentId).get()

        if (!passengerDoc.exists) {
            return res.status(404).json({ error: 'Passenger not found' })
        }

        const passenger = passengerDoc.data()

        // Notify parent with stop details
        await fcmService.notifyDropped(
            passenger.parentUid,
            passenger.name,
            stopName || 'their stop'
        )

        res.json({
            message:     `${passenger.name} marked as dropped. Parent notified.`,
            studentName: passenger.name,
            stopName:    stopName || 'their stop'
        })

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}


// ── Mark All Boarded ──────────────────────────────
const markAllBoarded = async (req, res) => {
    try {
        const { tripId, busId, stopName } = req.body

        if (!tripId || !busId) {
            return res.status(400).json({ error: 'tripId and busId are required' })
        }

        const passengersSnap = await firestoreDb
            .collection('passengers')
            .where('busId', '==', busId)
            .get()

        const allIds = passengersSnap.docs.map((d) => {
            const data = d.data() || {}
            return data.uid || d.id
        })

        // Update trip
        await firestoreDb.collection('trips').doc(tripId).update({
            boardedPassengers: allIds
        })

        // Get bus number
        const busDoc    = await firestoreDb.collection('buses').doc(busId).get()
        const busNumber = busDoc.exists ? busDoc.data().busNumber : ''

        // Notify all passengers
        const notifyPromises = passengersSnap.docs.map(d => {
            const passenger = d.data()
            return fcmService.notifyBoarded(
                passenger?.uid || d.id,
                passenger.name,
                busNumber,
                stopName || 'the stop'
            )
        })

        const notifyResults = await Promise.all(notifyPromises)
        const notifiedCount = notifyResults.filter(r => r?.success).length

        res.json({
            message: `All ${allIds.length} passengers marked as boarded. Passengers notified.`,
            count:   allIds.length,
            notificationSentCount: notifiedCount,
            notificationFailedCount: allIds.length - notifiedCount
        })

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}


// ── Complete a Stop ───────────────────────────────
const completeStop = async (req, res) => {
    try {
        const { stopId } = req.params
        const { tripId } = req.body

        if (!tripId) {
            return res.status(400).json({ error: 'tripId is required' })
        }

        await firestoreDb.collection('trips').doc(tripId).update({
            completedStops: FieldValue.arrayUnion(stopId)
        })

        res.json({ message: `Stop ${stopId} marked as complete` })

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}


// ── End Trip ──────────────────────────────────────
const endTrip = async (req, res) => {
    try {
        const { tripId } = req.params
        const { busId }  = req.body

        if (!busId) {
            return res.status(400).json({ error: 'busId is required' })
        }

        // Mark trip completed in Firestore
        await firestoreDb.collection('trips').doc(tripId).update({
            status:  'completed',
            endTime: new Date().toISOString()
        })

        // Clear live location from Realtime DB (System Design #1)
        // This removes the bus marker from all maps immediately
        await realtimeDb.ref(`/liveLocations/${busId}`).remove()

        res.json({ message: 'Trip completed successfully' })

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}


// ── SOS Alert (System Design #3) ──────────────────
const triggerSOS = async (req, res) => {
    try {
        const { busId, message, lat, lng } = req.body
        const driverUid                    = req.user.uid

        if (!busId) {
            return res.status(400).json({ error: 'busId is required' })
        }

        // Save SOS alert to Firestore
        const alertRef = await firestoreDb.collection('sosAlerts').add({
            busId,
            driverUid,
            message:   message || 'SOS Alert triggered',
            lat:       lat || null,
            lng:       lng || null,
            status:    'active',
            createdAt: new Date().toISOString()
        })

        // Get all admin UIDs and notify immediately
        const adminsSnap = await firestoreDb
            .collection('users')
            .where('role', '==', 'admin')
            .get()

        const adminUids = adminsSnap.docs.map(d => d.id)
        await fcmService.notifySOS(adminUids, busId, message)

        res.json({
            message: 'SOS alert sent to all admins',
            alertId: alertRef.id,
            notifiedAdmins: adminUids.length
        })

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}


// ── Share ETA (System Design #3) ──────────────────
const shareETA = async (req, res) => {
    try {
        const { busId, stopId, stopName, etaMinutes } = req.body

        if (!busId || !stopId || !etaMinutes) {
            return res.status(400).json({ error: 'busId, stopId and etaMinutes are required' })
        }

        // Get all passengers at this stop
        const passengersSnap = await firestoreDb
            .collection('passengers')
            .where('busId',  '==', busId)
            .where('stopId', '==', stopId)
            .get()

        if (passengersSnap.empty) {
            return res.json({ message: 'No passengers at this stop' })
        }

        const parentUids = passengersSnap.docs.map(d => d.data().parentUid)

        await fcmService.notifyETA(
            parentUids,
            etaMinutes,
            stopName || stopId
        )

        res.json({
            message:          `ETA of ${etaMinutes} mins shared`,
            notifiedParents:  parentUids.length,
            stopName:         stopName || stopId
        })

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}


// ── Get Passengers List ───────────────────────────
const getPassengers = async (req, res) => {
    try {
        const driverUid = req.user.uid

        const driverDoc = await firestoreDb
            .collection('drivers').doc(driverUid).get()

        if (!driverDoc.exists) {
            return res.status(404).json({ error: 'Driver profile not found' })
        }

        const busId = driverDoc.data().busId

        const snap       = await firestoreDb
            .collection('passengers')
            .where('busId', '==', busId)
            .get()

        const passengers = snap.docs.map(d => ({ id: d.id, ...d.data() }))

        res.json({
            passengers,
            total: passengers.length
        })

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}


module.exports = {
    getMyTrip,
    updateLocation,
    markBoarded,
    markDropped,
    markAllBoarded,
    completeStop,
    endTrip,
    triggerSOS,
    shareETA,
    getPassengers
}