// controllers/adminController.js

const { firebaseAuth, firestoreDb, realtimeDb } = require('../config/firebase')
const { FieldValue }                             = require('firebase-admin/firestore')
const fcmService                                 = require('../services/fcmService')


// ── Create Driver ─────────────────────────────────
const createDriver = async (req, res) => {
    try {
        const { email, password, name, phone, licenseNo, busId } = req.body

        const user = await firebaseAuth.createUser({ email, password, displayName: name })
        await firebaseAuth.setCustomUserClaims(user.uid, { role: 'driver' })

        await firestoreDb.collection('users').doc(user.uid).set({
            uid: user.uid, name, email, phone,
            role: 'driver', fcmToken: null,
            createdAt: new Date().toISOString()
        })

        await firestoreDb.collection('drivers').doc(user.uid).set({
            uid: user.uid, name, phone, licenseNo,
            busId, createdAt: new Date().toISOString()
        })

        await firestoreDb.collection('buses').doc(busId).update({
            driverId: user.uid
        })

        res.status(201).json({ message: `Driver ${name} created`, uid: user.uid })

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}


// ── Create Passenger ──────────────────────────────
const createPassenger = async (req, res) => {
    try {
        const { email, password, name, phone, busId, stopId, parentPhone } = req.body

        const user = await firebaseAuth.createUser({ email, password, displayName: name })
        await firebaseAuth.setCustomUserClaims(user.uid, { role: 'passenger' })

        // Generate BURG ID
        const burgId = `BURG-${Math.floor(1000 + Math.random() * 9000)}`

        await firestoreDb.collection('users').doc(user.uid).set({
            uid: user.uid, name, email, phone,
            role: 'passenger', fcmToken: null,
            createdAt: new Date().toISOString()
        })

        await firestoreDb.collection('passengers').doc(user.uid).set({
            uid: user.uid, name, phone,
            busId, stopId, parentPhone, burgId,
            createdAt: new Date().toISOString()
        })

        res.status(201).json({ message: `Passenger ${name} created`, uid: user.uid, burgId })

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}


// ── Delete User ───────────────────────────────────
const deleteUser = async (req, res) => {
    try {
        const { uid } = req.params

        const userDoc = await firestoreDb.collection('users').doc(uid).get()
        const role    = userDoc.data()?.role

        await firebaseAuth.deleteUser(uid)
        await firestoreDb.collection('users').doc(uid).delete()

        if (role === 'driver')    await firestoreDb.collection('drivers').doc(uid).delete()
        if (role === 'passenger') await firestoreDb.collection('passengers').doc(uid).delete()

        res.json({ message: `User ${uid} deleted` })

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}


// ── Get All Drivers ───────────────────────────────
const getAllDrivers = async (req, res) => {
    try {
        const snap    = await firestoreDb.collection('drivers').get()
        const drivers = snap.docs.map(d => ({ id: d.id, ...d.data() }))
        res.json({ drivers })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}


// ── Get All Passengers ────────────────────────────
const getAllPassengers = async (req, res) => {
    try {
        const snap       = await firestoreDb.collection('passengers').get()
        const passengers = snap.docs.map(d => ({ id: d.id, ...d.data() }))
        res.json({ passengers })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}


// ── Add Bus ───────────────────────────────────────
const addBus = async (req, res) => {
    try {
        const { busNumber, capacity, routeId, fare } = req.body

        const ref = await firestoreDb.collection('buses').add({
            busNumber, capacity, routeId,
            fare:      fare || 15.00,
            driverId:  null,
            createdAt: new Date().toISOString()
        })

        res.status(201).json({ message: `Bus ${busNumber} added`, busId: ref.id })

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}


// ── Update Bus ────────────────────────────────────
const updateBus = async (req, res) => {
    try {
        const { busId } = req.params
        await firestoreDb.collection('buses').doc(busId).update(req.body)
        res.json({ message: `Bus ${busId} updated` })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}


// ── Delete Bus ────────────────────────────────────
const deleteBus = async (req, res) => {
    try {
        const { busId } = req.params
        await firestoreDb.collection('buses').doc(busId).delete()
        res.json({ message: `Bus ${busId} deleted` })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}


// ── Get All Buses ─────────────────────────────────
const getAllBuses = async (req, res) => {
    try {
        const snap  = await firestoreDb.collection('buses').get()
        const buses = snap.docs.map(d => ({ id: d.id, ...d.data() }))
        res.json({ buses })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}


// ── Add Route ─────────────────────────────────────
const addRoute = async (req, res) => {
    try {
        const { name, stops } = req.body

        const ref = await firestoreDb.collection('routes').add({
            name, stops,
            createdAt: new Date().toISOString()
        })

        res.status(201).json({ message: `Route ${name} created`, routeId: ref.id })

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}


// ── Update Route ──────────────────────────────────
const updateRoute = async (req, res) => {
    try {
        const { routeId } = req.params
        await firestoreDb.collection('routes').doc(routeId).update(req.body)
        res.json({ message: `Route ${routeId} updated` })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}


// ── Get All Routes ────────────────────────────────
const getAllRoutes = async (req, res) => {
    try {
        const snap   = await firestoreDb.collection('routes').get()
        const routes = snap.docs.map(d => ({ id: d.id, ...d.data() }))
        res.json({ routes })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}


// ── Start Trip ────────────────────────────────────
const startTrip = async (req, res) => {
    try {
        const { busId, driverId } = req.body

        const ref = await firestoreDb.collection('trips').add({
            busId, driverId,
            status:            'active',
            startTime:         new Date().toISOString(),
            boardedPassengers: [],
            droppedPassengers: [],
            completedStops:    []
        })

        res.status(201).json({ message: 'Trip started', tripId: ref.id })

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}


// ── Get Active Trips ──────────────────────────────
const getActiveTrips = async (req, res) => {
    try {
        const snap  = await firestoreDb
            .collection('trips')
            .where('status', '==', 'active')
            .get()

        const trips = snap.docs.map(d => ({ id: d.id, ...d.data() }))
        res.json({ trips })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}


// ── Get Trip Report ───────────────────────────────
const getTripReport = async (req, res) => {
    try {
        const { tripId } = req.params

        const tripDoc = await firestoreDb.collection('trips').doc(tripId).get()

        if (!tripDoc.exists) {
            return res.status(404).json({ error: 'Trip not found' })
        }

        res.json({ trip: { id: tripDoc.id, ...tripDoc.data() } })

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}


// ── Get All Live Locations (System Design #1) ─────
const getAllLiveLocations = async (req, res) => {
    try {
        const snapshot  = await realtimeDb.ref('/liveLocations').once('value')
        const locations = snapshot.val()
        res.json({ locations: locations || {} })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}


// ── Attendance Report ─────────────────────────────
const getAttendanceReport = async (req, res) => {
    try {
        const { tripId } = req.params
        const tripDoc    = await firestoreDb.collection('trips').doc(tripId).get()
        const trip       = tripDoc.data()

        res.json({
            tripId,
            boardedCount:      trip.boardedPassengers?.length || 0,
            droppedCount:      trip.droppedPassengers?.length || 0,
            boardedPassengers: trip.boardedPassengers || [],
            droppedPassengers: trip.droppedPassengers || []
        })

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}


// ── Broadcast Alert (System Design #3) ───────────
const broadcastAlert = async (req, res) => {
    try {
        const { title, message, targetRole } = req.body

        // targetRole: 'driver' | 'passenger' | 'all'
        let query = firestoreDb.collection('users')
        if (targetRole !== 'all') {
            query = query.where('role', '==', targetRole)
        }

        const snap     = await query.get()
        const uids     = snap.docs.map(d => d.id)
        const result   = await fcmService.broadcastToUsers(uids, title, message)

        res.json({ message: 'Broadcast sent', ...result })

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}


// ── Notify Delay (System Design #3) ──────────────
const notifyDelay = async (req, res) => {
    try {
        const { busId, delayMinutes, reason } = req.body

        // Get all passengers on this bus
        const snap     = await firestoreDb
            .collection('passengers')
            .where('busId', '==', busId)
            .get()

        const uids   = snap.docs.map(d => d.id)
        const result = await fcmService.notifyDelay(uids, busId, delayMinutes, reason)

        res.json({ message: `Delay notification sent to ${uids.length} passengers`, ...result })

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}


// ── Get SOS Alerts ────────────────────────────────
const getSOSAlerts = async (req, res) => {
    try {
        const snap   = await firestoreDb
            .collection('sosAlerts')
            .where('status', '==', 'active')
            .orderBy('createdAt', 'desc')
            .get()

        const alerts = snap.docs.map(d => ({ id: d.id, ...d.data() }))
        res.json({ alerts })

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}


// ── Revenue Report ────────────────────────────────
const getRevenueReport = async (req, res) => {
    try {
        const snap  = await firestoreDb.collection('payments').get()
        const total = snap.docs.reduce((sum, d) => sum + d.data().amount, 0)

        res.json({ totalRevenue: total.toFixed(2), totalPayments: snap.size })

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}


module.exports = {
    createDriver, createPassenger, deleteUser,
    getAllDrivers, getAllPassengers,
    addBus, updateBus, deleteBus, getAllBuses,
    addRoute, updateRoute, getAllRoutes,
    startTrip, getActiveTrips, getTripReport,
    getAllLiveLocations, getAttendanceReport,
    broadcastAlert, notifyDelay, getSOSAlerts,
    getRevenueReport
}