// services/scheduleService.js

// No system design needed here.
// Standard Firestore CRUD for passenger schedules.
//
// SCHEDULE STRUCTURE:
//   Each passenger has one schedule document per day (Mon–Sat)
//   Each day has:
//     pickupFromHome    → time passenger wants to be picked up
//                         (user selectable: 7:00, 7:15, 7:30 AM)
//     pickupFromCollege → time passenger returns
//                         (fixed intervals: 3:00–4:00 PM, system defined)
//
// FIXED RETURN TIMES (set by admin, not user):
//   These are stored in Firestore /config/scheduleConfig
//   and fetched when passenger opens schedule screen

const { firestoreDb } = require('../config/firebase')


// ── Available pickup times (from home) ────────────
const HOME_PICKUP_TIMES = [
    '07:00 AM',
    '07:15 AM',
    '07:30 AM'
]


// ── Available return times (from college) ─────────
// Fixed by system — passenger can only choose from these
const COLLEGE_RETURN_TIMES = [
    '03:00 PM',
    '03:15 PM',
    '03:30 PM',
    '03:45 PM',
    '04:00 PM'
]


// ── Get schedule for a passenger ──────────────────
const getSchedule = async (passengerUid) => {
    try {
        const snap = await firestoreDb
            .collection('schedules')
            .where('passengerUid', '==', passengerUid)
            .get()

        if (snap.empty) return []

        return snap.docs.map(d => ({ id: d.id, ...d.data() }))

    } catch (error) {
        throw new Error(`Get schedule failed: ${error.message}`)
    }
}


// ── Save or update schedule for a day ─────────────
const saveSchedule = async (passengerUid, day, pickupFromHome, pickupFromCollege) => {
    try {
        // Validate pickup time is in allowed list
        if (!HOME_PICKUP_TIMES.includes(pickupFromHome)) {
            throw new Error(`Invalid pickup time. Allowed: ${HOME_PICKUP_TIMES.join(', ')}`)
        }

        if (!COLLEGE_RETURN_TIMES.includes(pickupFromCollege)) {
            throw new Error(`Invalid return time. Allowed: ${COLLEGE_RETURN_TIMES.join(', ')}`)
        }

        // Check if schedule exists for this day already
        const existing = await firestoreDb
            .collection('schedules')
            .where('passengerUid', '==', passengerUid)
            .where('day',          '==', day)
            .get()

        if (!existing.empty) {
            // Update existing schedule
            await existing.docs[0].ref.update({
                pickupFromHome,
                pickupFromCollege,
                updatedAt: new Date().toISOString()
            })
            return { message: `Schedule updated for ${day}`, action: 'updated' }
        }

        // Create new schedule
        const ref = await firestoreDb.collection('schedules').add({
            passengerUid,
            day,
            pickupFromHome,
            pickupFromCollege,
            createdAt: new Date().toISOString()
        })

        return { message: `Schedule saved for ${day}`, action: 'created', id: ref.id }

    } catch (error) {
        throw new Error(`Save schedule failed: ${error.message}`)
    }
}


// ── Get all schedules for a bus (driver view) ──────
// Driver can see who is scheduled for pickup today
const getScheduleForBus = async (busId, day) => {
    try {
        // Get all passengers on this bus
        const passengersSnap = await firestoreDb
            .collection('passengers')
            .where('busId', '==', busId)
            .get()

        const passengerIds = passengersSnap.docs.map(d => d.id)

        if (!passengerIds.length) return []

        // Get schedules for today for these passengers
        const schedulesSnap = await firestoreDb
            .collection('schedules')
            .where('day', '==', day)
            .get()

        const schedules = schedulesSnap.docs
            .filter(d => passengerIds.includes(d.data().passengerUid))
            .map(d => ({ id: d.id, ...d.data() }))

        return schedules

    } catch (error) {
        throw new Error(`Get bus schedule failed: ${error.message}`)
    }
}


// ── Delete schedule for a specific day ────────────
const deleteSchedule = async (passengerUid, day) => {
    try {
        const snap = await firestoreDb
            .collection('schedules')
            .where('passengerUid', '==', passengerUid)
            .where('day',          '==', day)
            .get()

        if (snap.empty) {
            throw new Error(`No schedule found for ${day}`)
        }

        await snap.docs[0].ref.delete()
        return { message: `Schedule deleted for ${day}` }

    } catch (error) {
        throw new Error(`Delete schedule failed: ${error.message}`)
    }
}


// ── Get available time options ─────────────────────
const getTimeOptions = () => {
    return {
        homePickupTimes:     HOME_PICKUP_TIMES,
        collegeReturnTimes:  COLLEGE_RETURN_TIMES
    }
}


module.exports = {
    getSchedule,
    saveSchedule,
    getScheduleForBus,
    deleteSchedule,
    getTimeOptions
}