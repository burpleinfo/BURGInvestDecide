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
// markBoarded()  → FCM to parent/guardian
// markDropped()  → FCM to parent/guardian
// triggerSOS()   → FCM to ALL admins immediately
// shareETA()     → FCM to passenger on that stop
//
// Failed notification:
//   If fcmToken is null → skip, log warning
//   If FCM send fails   → log error, don't crash
// ════════════════════════════════════════════════════

const { firestoreDb, realtimeDb } = require('../config/firebase')
const { FieldValue }              = require('firebase-admin/firestore')
const fcmService                  = require('../services/fcmService')


// ── Get My Trip ───────────────────────────────────
const getMyTrip = async (req, res) => {
    try {
        const driverUid = req.user.uid

        // Get driver profile
        const driverDoc = await firestoreDb
            .collection('drivers').doc(driverUid).get()

        if (!driverDoc.exists) {
            return res.status(404).json({ error: 'Driver profile not found' })
        }

        const busId = driverDoc.data().busId

        // Get active trip for this bus
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

        // Get all passengers on this bus
        const passengersSnap = await firestoreDb
            .collection('passengers')
            .where('busId', '==', busId)
            .get()

        const passengers = passengersSnap.docs.map(d => ({
            id: d.id,
            ...d.data()
        }))

        res.json({
            tripId:          tripDoc.id,
            busId,
            passengers,
            totalPassengers: passengers.length,
            boardedCount:    tripData.boardedPassengers?.length || 0,
            droppedCount:    tripData.droppedPassengers?.length || 0,
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
        const { studentId }  = req.params
        const { tripId }     = req.body

        // Update trip in Firestore
        await firestoreDb.collection('trips').doc(tripId).update({
            boardedPassengers: FieldValue.arrayUnion(studentId)
        })

        // Get passenger info for notification
        const passengerDoc = await firestoreDb
            .collection('passengers').doc(studentId).get()
        const passenger    = passengerDoc.data()

        // Send FCM to parent/guardian
        await fcmService.notifyBoarded(
            passenger.parentUid,
            passenger.name
        )

        res.json({ message: `${passenger.name} marked as boarded. Parent notified.` })

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}


// ── Mark Passenger Dropped (System Design #3) ─────
const markDropped = async (req, res) => {
    try {
        const { studentId } = req.params
        const { tripId }    = req.body

        await firestoreDb.collection('trips').doc(tripId).update({
            droppedPassengers: FieldValue.arrayUnion(studentId)
        })

        const passengerDoc = await firestoreDb
            .collection('passengers').doc(studentId).get()
        const passenger    = passengerDoc.data()

        await fcmService.notifyDropped(
            passenger.parentUid,
            passenger.name
        )

        res.json({ message: `${passenger.name} marked as dropped. Parent notified.` })

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}


// ── Mark All Boarded ──────────────────────────────
const markAllBoarded = async (req, res) => {
    try {
        const { tripId, busId } = req.body

        const passengersSnap = await firestoreDb
            .collection('passengers')
            .where('busId', '==', busId)
            .get()

        const allIds = passengersSnap.docs.map(d => d.id)

        await firestoreDb.collection('trips').doc(tripId).update({
            boardedPassengers: allIds
        })

        res.json({ message: `All ${allIds.length} passengers marked as boarded` })

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}


// ── Complete a Stop ───────────────────────────────
const completeStop = async (req, res) => {
    try {
        const { stopId } = req.params
        const { tripId } = req.body

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
        const { tripId }    = req.params
        const { busId }     = req.body

        // Mark trip completed in Firestore
        await firestoreDb.collection('trips').doc(tripId).update({
            status:  'completed',
            endTime: new Date().toISOString()
        })

        // Clear live location from Realtime DB (System Design #1)
        await realtimeDb.ref(`/liveLocations/${busId}`).remove()

        res.json({ message: 'Trip completed successfully' })

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}



// ── Share ETA ─────────────────────────────────────
const shareETA = async (req, res) => {
    try {
        const { busId, stopId, etaMinutes } = req.body

        // Get all passengers at this stop
        const passengersSnap = await firestoreDb
            .collection('passengers')
            .where('busId',  '==', busId)
            .where('stopId', '==', stopId)
            .get()

        const parentUids = passengersSnap.docs.map(d => d.data().parentUid)
        await fcmService.notifyETA(parentUids, etaMinutes, stopId)

        res.json({ message: `ETA of ${etaMinutes} mins shared with ${parentUids.length} parents` })

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
        const busId     = driverDoc.data().busId

        const snap = await firestoreDb
            .collection('passengers')
            .where('busId', '==', busId)
            .get()

        const passengers = snap.docs.map(d => ({ id: d.id, ...d.data() }))
        res.json({ passengers })

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
    shareETA,
    getPassengers
}