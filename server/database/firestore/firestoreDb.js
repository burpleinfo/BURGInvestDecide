// database/firestore/firestoreDb.js

// ════════════════════════════════════════════════════
// FIRESTORE COLLECTIONS — RIDESAFE
// ════════════════════════════════════════════════════
//
// COLLECTION STRUCTURE:
//
//  /users/{uid}
//      uid, name, email, phone, role, fcmToken, createdAt
//
//  /drivers/{uid}
//      uid, name, phone, licenseNo, busId, createdAt
//
//  /passengers/{uid}
//      uid, name, phone, busId, stopId, burgId,
//      parentPhone, createdAt
//
//  /buses/{busId}
//      busNumber, capacity, routeId, driverId, fare
//
//  /routes/{routeId}
//      name, stops: [{ id, name, lat, lng, order }]
//
//  /trips/{tripId}
//      busId, driverId, status, startTime, endTime,
//      boardedPassengers[], droppedPassengers[],
//      completedStops[]
//
//  /payments/{paymentId}
//      passengerUid, busId, amount, method,
//      details, status, createdAt
// ════════════════════════════════════════════════════

const { firestoreDb } = require('../../firebase/config/firebase')
const { FieldValue }  = require('firebase-admin/firestore')


// ══════════════════════════════════════════════════
//  USERS
// ══════════════════════════════════════════════════

const getUser = async (uid) => {
    const doc = await firestoreDb.collection('users').doc(uid).get()
    if (!doc.exists) return null
    return { id: doc.id, ...doc.data() }
}

const updateUser = async (uid, data) => {
    await firestoreDb.collection('users').doc(uid).update(data)
    return { message: 'User updated' }
}

const getAllByRole = async (role) => {
    const snap = await firestoreDb
        .collection('users')
        .where('role', '==', role)
        .get()
    return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}


// ══════════════════════════════════════════════════
//  DRIVERS
// ══════════════════════════════════════════════════

const createDriver = async (uid, name, phone, licenseNo, busId) => {
    await firestoreDb.collection('drivers').doc(uid).set({
        uid, name, phone, licenseNo, busId,
        createdAt: new Date().toISOString()
    })
    return { message: 'Driver created', driverId: uid }
}

const getDriver = async (uid) => {
    const doc = await firestoreDb.collection('drivers').doc(uid).get()
    if (!doc.exists) return null
    return { id: doc.id, ...doc.data() }
}

const getAllDrivers = async () => {
    const snap = await firestoreDb.collection('drivers').get()
    return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

const deleteDriver = async (uid) => {
    await firestoreDb.collection('drivers').doc(uid).delete()
    return { message: 'Driver deleted' }
}


// ══════════════════════════════════════════════════
//  PASSENGERS
// ══════════════════════════════════════════════════

const createPassenger = async (uid, name, phone, busId, stopId, parentPhone, burgId) => {
    await firestoreDb.collection('passengers').doc(uid).set({
        uid, name, phone, busId, stopId,
        parentPhone, burgId,
        createdAt: new Date().toISOString()
    })
    return { message: 'Passenger created', passengerId: uid }
}

const getPassenger = async (uid) => {
    const doc = await firestoreDb.collection('passengers').doc(uid).get()
    if (!doc.exists) return null
    return { id: doc.id, ...doc.data() }
}

const getPassengersByBus = async (busId) => {
    const snap = await firestoreDb
        .collection('passengers')
        .where('busId', '==', busId)
        .get()
    return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

const getAllPassengers = async () => {
    const snap = await firestoreDb.collection('passengers').get()
    return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

const deletePassenger = async (uid) => {
    await firestoreDb.collection('passengers').doc(uid).delete()
    return { message: 'Passenger deleted' }
}


// ══════════════════════════════════════════════════
//  BUSES
// ══════════════════════════════════════════════════

const createBus = async (busNumber, capacity, routeId, fare = 15.00) => {
    const ref = await firestoreDb.collection('buses').add({
        busNumber, capacity, routeId,
        fare, driverId: null,
        createdAt: new Date().toISOString()
    })
    return { message: 'Bus created', busId: ref.id }
}

const getBus = async (busId) => {
    const doc = await firestoreDb.collection('buses').doc(busId).get()
    if (!doc.exists) return null
    return { id: doc.id, ...doc.data() }
}

const getAllBuses = async () => {
    const snap = await firestoreDb.collection('buses').get()
    return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

const updateBus = async (busId, data) => {
    await firestoreDb.collection('buses').doc(busId).update(data)
    return { message: 'Bus updated' }
}

const deleteBus = async (busId) => {
    await firestoreDb.collection('buses').doc(busId).delete()
    return { message: 'Bus deleted' }
}

const assignDriverToBus = async (busId, driverId) => {
    await firestoreDb.collection('buses').doc(busId).update({ driverId })
    return { message: `Driver assigned to bus ${busId}` }
}


// ══════════════════════════════════════════════════
//  ROUTES
// ══════════════════════════════════════════════════

const createRoute = async (name, stops) => {
    // stops = [{ id, name, lat, lng, order }]
    const ref = await firestoreDb.collection('routes').add({
        name, stops,
        createdAt: new Date().toISOString()
    })
    return { message: 'Route created', routeId: ref.id }
}

const getRoute = async (routeId) => {
    const doc = await firestoreDb.collection('routes').doc(routeId).get()
    if (!doc.exists) return null
    return { id: doc.id, ...doc.data() }
}

const getAllRoutes = async () => {
    const snap = await firestoreDb.collection('routes').get()
    return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

const updateRoute = async (routeId, data) => {
    await firestoreDb.collection('routes').doc(routeId).update(data)
    return { message: 'Route updated' }
}


// ══════════════════════════════════════════════════
//  TRIPS
// ══════════════════════════════════════════════════

const createTrip = async (busId, driverId) => {
    const ref = await firestoreDb.collection('trips').add({
        busId,
        driverId,
        status:            'active',
        startTime:         new Date().toISOString(),
        endTime:           null,
        boardedPassengers: [],
        droppedPassengers: [],
        completedStops:    []
    })
    return { message: 'Trip started', tripId: ref.id }
}

const getActiveTrip = async (busId) => {
    const snap = await firestoreDb
        .collection('trips')
        .where('busId',  '==', busId)
        .where('status', '==', 'active')
        .get()
    if (snap.empty) return null
    return { id: snap.docs[0].id, ...snap.docs[0].data() }
}

const getAllActiveTrips = async () => {
    const snap = await firestoreDb
        .collection('trips')
        .where('status', '==', 'active')
        .get()
    return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

const getTrip = async (tripId) => {
    const doc = await firestoreDb.collection('trips').doc(tripId).get()
    if (!doc.exists) return null
    return { id: doc.id, ...doc.data() }
}

const boardPassenger = async (tripId, passengerId) => {
    await firestoreDb.collection('trips').doc(tripId).update({
        boardedPassengers: FieldValue.arrayUnion(passengerId)
    })
}

const dropPassenger = async (tripId, passengerId) => {
    await firestoreDb.collection('trips').doc(tripId).update({
        droppedPassengers: FieldValue.arrayUnion(passengerId)
    })
}

const completeStop = async (tripId, stopId) => {
    await firestoreDb.collection('trips').doc(tripId).update({
        completedStops: FieldValue.arrayUnion(stopId)
    })
}

const endTrip = async (tripId) => {
    await firestoreDb.collection('trips').doc(tripId).update({
        status:  'completed',
        endTime: new Date().toISOString()
    })
}


// ══════════════════════════════════════════════════
//  PAYMENTS
// ══════════════════════════════════════════════════

const createPayment = async (passengerUid, busId, amount, method, details) => {
    const ref = await firestoreDb.collection('payments').add({
        passengerUid, busId, amount,
        method, details,
        status:    'success',
        createdAt: new Date().toISOString()
    })
    return { message: 'Payment recorded', paymentId: ref.id }
}

const getPaymentsByPassenger = async (passengerUid) => {
    const snap = await firestoreDb
        .collection('payments')
        .where('passengerUid', '==', passengerUid)
        .orderBy('createdAt', 'desc')
        .get()
    return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

const getAllPayments = async () => {
    const snap = await firestoreDb
        .collection('payments')
        .orderBy('createdAt', 'desc')
        .get()
    return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

const getPayment = async (paymentId) => {
    const doc = await firestoreDb.collection('payments').doc(paymentId).get()
    if (!doc.exists) return null
    return { id: doc.id, ...doc.data() }
}


module.exports = {
    // Users
    getUser, updateUser, getAllByRole,

    // Drivers
    createDriver, getDriver, getAllDrivers, deleteDriver,

    // Passengers
    createPassenger, getPassenger, getPassengersByBus,
    getAllPassengers, deletePassenger,

    // Buses
    createBus, getBus, getAllBuses, updateBus,
    deleteBus, assignDriverToBus,

    // Routes
    createRoute, getRoute, getAllRoutes, updateRoute,

    // Trips
    createTrip, getActiveTrip, getAllActiveTrips,
    getTrip, boardPassenger, dropPassenger,
    completeStop, endTrip,

    // Payments
    createPayment, getPaymentsByPassenger,
    getAllPayments, getPayment
}