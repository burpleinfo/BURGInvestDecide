// controllers/adminController.js

const { firebaseAuth, firestoreDb, realtimeDb } = require('../config/firebase')
const { FieldValue }                             = require('firebase-admin/firestore')
const fcmService                                 = require('../services/fcmService')

const getAdminScope = async (req) => {
    const adminUid = req.user?.uid
    const adminDoc = await firestoreDb.collection('admins').doc(adminUid).get()
    const adminData = adminDoc.exists ? adminDoc.data() : null

    let userData = null
    if (!adminData?.institutionId) {
        const userDoc = await firestoreDb.collection('users').doc(adminUid).get()
        userData = userDoc.exists ? userDoc.data() : null
    }

    return {
        adminUid,
        institutionId: adminData?.institutionId || userData?.institutionId || null,
        institutionName: adminData?.institutionName || userData?.institutionName || null
    }
}

const ensureInstitutionScope = (res, scope) => {
    if (!scope.institutionId) {
        res.status(403).json({ error: 'Admin is missing an institution assignment.' })
        return false
    }
    return true
}

const getScopedQuery = (collectionName, scope) => {
    const collection = firestoreDb.collection(collectionName)
    if (scope.institutionId) {
        return collection.where('institutionId', '==', scope.institutionId)
    }
    return collection.where('createdBy', '==', scope.adminUid)
}

const assertRouteInScope = async (scope, routeId, res) => {
    if (!routeId) return null
    const routeDoc = await firestoreDb.collection('routes').doc(routeId).get()

    if (!routeDoc.exists) {
        res.status(404).json({ error: 'Route not found' })
        return null
    }

    const routeData = routeDoc.data() || {}
    if (scope.institutionId && routeData.institutionId && routeData.institutionId !== scope.institutionId) {
        res.status(403).json({ error: 'Route does not belong to this institution.' })
        return null
    }

    if (scope.institutionId && !routeData.institutionId) {
        await routeDoc.ref.set({ institutionId: scope.institutionId }, { merge: true })
        routeData.institutionId = scope.institutionId
    }

    return { id: routeDoc.id, ...routeData }
}

const assertBusInScope = async (scope, busId, res) => {
    if (!busId) return null
    const busDoc = await firestoreDb.collection('buses').doc(busId).get()

    if (!busDoc.exists) {
        res.status(404).json({ error: 'Bus not found' })
        return null
    }

    const busData = busDoc.data() || {}
    if (scope.institutionId && busData.institutionId && busData.institutionId !== scope.institutionId) {
        res.status(403).json({ error: 'Bus does not belong to this institution.' })
        return null
    }

    if (scope.institutionId && !busData.institutionId) {
        await busDoc.ref.set({ institutionId: scope.institutionId }, { merge: true })
        busData.institutionId = scope.institutionId
    }

    return { id: busDoc.id, ...busData }
}

const getScopedBusIds = async (scope) => {
    const snap = await getScopedQuery('buses', scope).get()
    return new Set(snap.docs.map((doc) => doc.id))
}

const resolveEffectiveScope = (scope, institutionId, institutionName) => ({
    ...scope,
    institutionId: institutionId || scope.institutionId || null,
    institutionName: institutionName || scope.institutionName || null
})

const getRouteForBus = async (scope, bus) => {
    if (!bus?.routeId) {
        return {
            routeId: null,
            routeName: null,
            routeStops: []
        }
    }

    const routeDoc = await firestoreDb.collection('routes').doc(bus.routeId).get()
    if (!routeDoc.exists) {
        return {
            routeId: bus.routeId,
            routeName: null,
            routeStops: []
        }
    }

    const routeData = routeDoc.data() || {}
    if (scope.institutionId && routeData.institutionId && routeData.institutionId !== scope.institutionId) {
        return null
    }

    if (scope.institutionId && !routeData.institutionId) {
        await routeDoc.ref.set({ institutionId: scope.institutionId }, { merge: true })
        routeData.institutionId = scope.institutionId
    }

    return {
        routeId: routeDoc.id,
        routeName: routeData.name || null,
        routeStops: Array.isArray(routeData.stops) ? routeData.stops : []
    }
}


// ── Create Driver ─────────────────────────────────
const createDriver = async (req, res) => {
    try {
        const { email, password, name, phone, licenseNo, busId, institutionId, institutionName } = req.body
        const scope = await getAdminScope(req)
        const effectiveScope = resolveEffectiveScope(scope, institutionId, institutionName)

        const bus = await assertBusInScope(effectiveScope, busId, res)
        if (!bus) return

        const route = await getRouteForBus(effectiveScope, bus)
        if (route === null) {
            return res.status(403).json({ error: 'Bus route does not belong to this institution.' })
        }

        const assignedLocationId = route?.routeId || bus.routeId || null
        const assignedLocationName = route?.routeName || null

        const user = await firebaseAuth.createUser({ email, password, displayName: name })
        await firebaseAuth.setCustomUserClaims(user.uid, { role: 'driver' })

        await firestoreDb.collection('users').doc(user.uid).set({
            uid: user.uid, name, email, phone,
            role: 'driver', fcmToken: null,
            institutionId: effectiveScope.institutionId,
            institutionName: effectiveScope.institutionName || null,
            assignedBusId: bus.id,
            assignedBusNumber: bus.busNumber || null,
            assignedRouteId: route?.routeId || bus.routeId || null,
            assignedRouteName: route?.routeName || null,
            assignedLocationId,
            assignedLocationName,
            createdBy: scope.adminUid,
            createdAt: new Date().toISOString()
        })

        await firestoreDb.collection('drivers').doc(user.uid).set({
            uid: user.uid, name, phone, licenseNo,
            busId,
            institutionId: effectiveScope.institutionId,
            institutionName: effectiveScope.institutionName || null,
            assignedBusId: bus.id,
            assignedBusNumber: bus.busNumber || null,
            assignedRouteId: route?.routeId || bus.routeId || null,
            assignedRouteName: route?.routeName || null,
            assignedLocationId,
            assignedLocationName,
            createdBy: scope.adminUid,
            createdAt: new Date().toISOString()
        })

        // Save to institution subcollection
        await firestoreDb
            .collection('institutions')
            .doc(effectiveScope.institutionId)
            .collection('drivers')
            .doc(user.uid)
            .set({
                uid: user.uid, name, phone, licenseNo,
                busId,
                institutionId: effectiveScope.institutionId,
                institutionName: effectiveScope.institutionName || null,
                assignedBusId: bus.id,
                assignedBusNumber: bus.busNumber || null,
                assignedRouteId: route?.routeId || bus.routeId || null,
                assignedRouteName: route?.routeName || null,
                assignedLocationId,
                assignedLocationName,
                createdBy: scope.adminUid,
                createdAt: new Date().toISOString(),
                status: 'active'
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
        const { email, password, name, phone, busId, stopId, parentPhone, institutionId, institutionName } = req.body
        const scope = await getAdminScope(req)
        const effectiveScope = resolveEffectiveScope(scope, institutionId, institutionName)

        const bus = await assertBusInScope(effectiveScope, busId, res)
        if (!bus) return

        const route = await getRouteForBus(effectiveScope, bus)
        if (route === null) {
            return res.status(403).json({ error: 'Bus route does not belong to this institution.' })
        }

        const selectedStop = route?.routeStops?.find((stop) => stop.id === stopId || stop.name === stopId) || null
        const assignedLocationId = selectedStop?.id || stopId || null
        const assignedLocationName = selectedStop?.name || stopId || null

        const user = await firebaseAuth.createUser({ email, password, displayName: name })
        await firebaseAuth.setCustomUserClaims(user.uid, { role: 'passenger' })

        // Generate BURG ID
        const burgId = `BURG-${Math.floor(1000 + Math.random() * 9000)}`

        await firestoreDb.collection('users').doc(user.uid).set({
            uid: user.uid, name, email, phone,
            role: 'passenger', fcmToken: null,
            institutionId: effectiveScope.institutionId,
            institutionName: effectiveScope.institutionName || null,
            parentPhone: parentPhone || null,
            assignedBusId: bus.id,
            assignedBusNumber: bus.busNumber || null,
            assignedRouteId: route?.routeId || bus.routeId || null,
            assignedRouteName: route?.routeName || null,
            assignedLocationId,
            assignedLocationName,
            createdBy: scope.adminUid,
            createdAt: new Date().toISOString()
        })

        await firestoreDb.collection('passengers').doc(user.uid).set({
            uid: user.uid, name, phone,
            busId, stopId, parentPhone, burgId,
            institutionId: effectiveScope.institutionId,
            institutionName: effectiveScope.institutionName || null,
            assignedBusId: bus.id,
            assignedBusNumber: bus.busNumber || null,
            assignedRouteId: route?.routeId || bus.routeId || null,
            assignedRouteName: route?.routeName || null,
            assignedLocationId,
            assignedLocationName,
            createdBy: scope.adminUid,
            createdAt: new Date().toISOString()
        })

        // Save to institution subcollection
        await firestoreDb
            .collection('institutions')
            .doc(effectiveScope.institutionId)
            .collection('passengers')
            .doc(user.uid)
            .set({
                uid: user.uid, name, phone,
                busId, stopId, parentPhone, burgId,
                institutionId: effectiveScope.institutionId,
                institutionName: effectiveScope.institutionName || null,
                assignedBusId: bus.id,
                assignedBusNumber: bus.busNumber || null,
                assignedRouteId: route?.routeId || bus.routeId || null,
                assignedRouteName: route?.routeName || null,
                assignedLocationId,
                assignedLocationName,
                createdBy: scope.adminUid,
                createdAt: new Date().toISOString(),
                status: 'active'
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

        const scope = await getAdminScope(req)
        if (!ensureInstitutionScope(res, scope)) return

        const userDoc = await firestoreDb.collection('users').doc(uid).get()
        if (!userDoc.exists) {
            return res.status(404).json({ error: 'User not found' })
        }

        const userData = userDoc.data() || {}
        const role     = userData.role

        if (!userData.institutionId || userData.institutionId !== scope.institutionId) {
            return res.status(403).json({ error: 'User does not belong to this institution.' })
        }

        await firebaseAuth.deleteUser(uid)
        await firestoreDb.collection('users').doc(uid).delete()

        if (role === 'driver') {
            await firestoreDb.collection('drivers').doc(uid).delete()
            // Also delete from institution subcollection
            await firestoreDb
                .collection('institutions')
                .doc(scope.institutionId)
                .collection('drivers')
                .doc(uid)
                .delete()
        }
        if (role === 'passenger') {
            await firestoreDb.collection('passengers').doc(uid).delete()
            // Also delete from institution subcollection
            await firestoreDb
                .collection('institutions')
                .doc(scope.institutionId)
                .collection('passengers')
                .doc(uid)
                .delete()
        }

        res.json({ message: `User ${uid} deleted` })

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}


// ── Get All Drivers ───────────────────────────────
const getAllDrivers = async (req, res) => {
    try {
        const scope   = await getAdminScope(req)
        const snap    = await getScopedQuery('drivers', scope).get()
        const drivers = snap.docs.map(d => ({ id: d.id, ...d.data() }))
        res.json({ drivers })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}


// ── Get All Passengers ────────────────────────────
const getAllPassengers = async (req, res) => {
    try {
        const scope      = await getAdminScope(req)
        const snap       = await getScopedQuery('passengers', scope).get()
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
        const scope = await getAdminScope(req)
        if (!ensureInstitutionScope(res, scope)) return

        await assertRouteInScope(scope, routeId, res)

        const ref = await firestoreDb.collection('buses').add({
            busNumber, capacity, routeId,
            fare:      fare || 15.00,
            driverId:  null,
            institutionId: scope.institutionId,
            institutionName: scope.institutionName || null,
            createdBy: scope.adminUid,
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
        const scope = await getAdminScope(req)
        if (!ensureInstitutionScope(res, scope)) return

        const busRef = firestoreDb.collection('buses').doc(busId)
        const busDoc = await busRef.get()

        if (!busDoc.exists) {
            return res.status(404).json({ error: 'Bus not found' })
        }

        const busData = busDoc.data() || {}
        if (busData.institutionId && busData.institutionId !== scope.institutionId) {
            return res.status(403).json({ error: 'Bus does not belong to this institution.' })
        }

        if (req.body?.routeId) {
            const route = await assertRouteInScope(scope, req.body.routeId, res)
            if (!route) return
        }

        const updatePayload = { ...req.body }
        if (busData.institutionId) {
            updatePayload.institutionId = busData.institutionId
        } else {
            updatePayload.institutionId = scope.institutionId
        }

        await busRef.update(updatePayload)
        res.json({ message: `Bus ${busId} updated` })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}


// ── Delete Bus ────────────────────────────────────
const deleteBus = async (req, res) => {
    try {
        const { busId } = req.params
        const scope = await getAdminScope(req)
        // Note: institutionId is optional for backward compatibility

        const busRef = firestoreDb.collection('buses').doc(busId)
        const busDoc = await busRef.get()

        if (!busDoc.exists) {
            return res.status(404).json({ error: 'Bus not found' })
        }

        const busData = busDoc.data() || {}
        if (busData.institutionId && busData.institutionId !== scope.institutionId) {
            return res.status(403).json({ error: 'Bus does not belong to this institution.' })
        }

        await busRef.delete()
        res.json({ message: `Bus ${busId} deleted` })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}


// ── Get All Buses ─────────────────────────────────
const getAllBuses = async (req, res) => {
    try {
        const scope = await getAdminScope(req)
        const snap  = await getScopedQuery('buses', scope).get()
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
        const scope = await getAdminScope(req)
        if (!ensureInstitutionScope(res, scope)) return

        const ref = await firestoreDb.collection('routes').add({
            name, stops,
            institutionId: scope.institutionId,
            institutionName: scope.institutionName || null,
            createdBy: scope.adminUid,
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
        const scope = await getAdminScope(req)
        // Note: institutionId is optional for backward compatibility

        const routeRef = firestoreDb.collection('routes').doc(routeId)
        const routeDoc = await routeRef.get()

        if (!routeDoc.exists) {
            return res.status(404).json({ error: 'Route not found' })
        }

        const routeData = routeDoc.data() || {}
        if (routeData.institutionId && routeData.institutionId !== scope.institutionId) {
            return res.status(403).json({ error: 'Route does not belong to this institution.' })
        }

        const updatePayload = { ...req.body }
        if (routeData.institutionId) {
            updatePayload.institutionId = routeData.institutionId
        } else {
            updatePayload.institutionId = scope.institutionId
        }

        await routeRef.update(updatePayload)
        res.json({ message: `Route ${routeId} updated` })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}


// ── Get All Routes ────────────────────────────────
const getAllRoutes = async (req, res) => {
    try {
        const scope  = await getAdminScope(req)
        const snap   = await getScopedQuery('routes', scope).get()
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
        const scope = await getAdminScope(req)
        if (!ensureInstitutionScope(res, scope)) return

        const bus = await assertBusInScope(scope, busId, res)
        if (!bus) return

        if (driverId) {
            const driverDoc = await firestoreDb.collection('drivers').doc(driverId).get()
            if (!driverDoc.exists) {
                return res.status(404).json({ error: 'Driver not found' })
            }
            const driverData = driverDoc.data() || {}
            if (driverData.institutionId && driverData.institutionId !== scope.institutionId) {
                return res.status(403).json({ error: 'Driver does not belong to this institution.' })
            }
            if (!driverData.institutionId) {
                await driverDoc.ref.set({ institutionId: scope.institutionId }, { merge: true })
            }
        }

        const ref = await firestoreDb.collection('trips').add({
            busId, driverId,
            status:            'active',
            startTime:         new Date().toISOString(),
            boardedPassengers: [],
            droppedPassengers: [],
            completedStops:    [],
            institutionId: scope.institutionId,
            institutionName: scope.institutionName || null,
            createdBy: scope.adminUid
        })

        res.status(201).json({ message: 'Trip started', tripId: ref.id })

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}


// ── Get Active Trips ──────────────────────────────
const getActiveTrips = async (req, res) => {
    try {
        const scope = await getAdminScope(req)
        const snap  = await getScopedQuery('trips', scope)
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
        const scope = await getAdminScope(req)
        // Note: institutionId is optional for backward compatibility

        const tripDoc = await firestoreDb.collection('trips').doc(tripId).get()

        if (!tripDoc.exists) {
            return res.status(404).json({ error: 'Trip not found' })
        }

        const tripData = tripDoc.data() || {}

        if (tripData.institutionId && tripData.institutionId !== scope.institutionId) {
            return res.status(403).json({ error: 'Trip does not belong to this institution.' })
        }

        res.json({ trip: { id: tripDoc.id, ...tripData } })

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}


// ── Get All Live Locations (System Design #1) ─────
const getAllLiveLocations = async (req, res) => {
    try {
        const scope = await getAdminScope(req)
        const busIds = await getScopedBusIds(scope)
        const snapshot  = await realtimeDb.ref('/liveLocations').once('value')
        const locations = snapshot.val()
        const filtered = {}

        if (locations) {
            for (const [busId, location] of Object.entries(locations)) {
                if (busIds.has(busId)) {
                    filtered[busId] = location
                }
            }
        }

        res.json({ locations: filtered })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}


// ── Attendance Report ─────────────────────────────
const getAttendanceReport = async (req, res) => {
    try {
        const { tripId } = req.params
        const scope = await getAdminScope(req)
        // Note: institutionId is optional for backward compatibility

        const tripDoc    = await firestoreDb.collection('trips').doc(tripId).get()
        const trip       = tripDoc.data()

        if (trip?.institutionId && trip.institutionId !== scope.institutionId) {
            return res.status(403).json({ error: 'Trip does not belong to this institution.' })
        }

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
        const scope = await getAdminScope(req)
        // Note: institutionId is optional for backward compatibility

        const snap     = await firestoreDb
            .collection('users')
            .where('institutionId', '==', scope.institutionId)
            .get()

        const uids     = snap.docs
            .map(d => ({ id: d.id, ...d.data() }))
            .filter(user => targetRole === 'all' || user.role === targetRole)
            .map(user => user.id)
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
        const scope = await getAdminScope(req)
        // Note: institutionId is optional for backward compatibility

        const bus = await assertBusInScope(scope, busId, res)
        if (!bus) return

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
        const scope = await getAdminScope(req)
        let alerts = []

        try {
            const snap = await firestoreDb
                .collection('sosAlerts')
                .where('status', '==', 'active')
                .where('institutionId', '==', scope.institutionId)
                .orderBy('createdAt', 'desc')
                .get()

            alerts = snap.docs.map(d => ({ id: d.id, ...d.data() }))
        } catch (error) {
            if (error?.code !== 9 && error?.code !== 'failed-precondition') {
                throw error
            }

            const fallbackSnap = await firestoreDb
                .collection('sosAlerts')
                .where('institutionId', '==', scope.institutionId)
                .get()
            alerts = fallbackSnap.docs
                .map(d => ({ id: d.id, ...d.data() }))
                .filter((item) => item.status === 'active')
                .sort((a, b) => {
                    const aTime = new Date(a.createdAt || 0).getTime()
                    const bTime = new Date(b.createdAt || 0).getTime()
                    return bTime - aTime
                })
        }

        res.json({ alerts })

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}


// ── Revenue Report ────────────────────────────────
const getRevenueReport = async (req, res) => {
    try {
        const scope  = await getAdminScope(req)
        const busIds = await getScopedBusIds(scope)
        const snap   = await firestoreDb.collection('payments').get()
        const scopedPayments = snap.docs
            .map(d => ({ id: d.id, ...d.data() }))
            .filter((payment) => {
                if (scope.institutionId) {
                    return payment.institutionId === scope.institutionId
                }
                return busIds.has(payment.busId)
            })

        const total = scopedPayments.reduce((sum, payment) => sum + (payment.amount || 0), 0)

        res.json({ totalRevenue: total.toFixed(2), totalPayments: scopedPayments.length })

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

