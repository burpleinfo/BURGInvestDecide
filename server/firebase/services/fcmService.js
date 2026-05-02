// services/fcmService.js

// ════════════════════════════════════════════════════
// SYSTEM DESIGN #3 — Notification Flow
// ════════════════════════════════════════════════════
// Every notification in RIDESAFE goes through this
// single service. Nothing sends FCM directly.
//
// TRIGGER MAP — who gets notified and when:
//
//  EVENT                   SENDER       RECEIVER
//  ─────────────────────────────────────────────────
//  Passenger boards        Driver       Parent/Guardian
//  Passenger dropped       Driver       Parent/Guardian
//  SOS triggered           Driver       All Admins
//  Bus delayed             Admin        All passengers on bus
//  ETA shared              Driver       Parents at that stop
//  Broadcast alert         Admin        All drivers / passengers / all
//  Trip started            Admin        Driver of that bus
//
// NOTIFICATION DELIVERY FLOW:
//
//   Controller calls fcmService.notifyXxx()
//         ↓
//   fcmService fetches FCM token from Firestore
//   (token was saved when user logged in on mobile)
//         ↓
//   fcmService calls Firebase admin.messaging().send()
//         ↓
//   Firebase pushes notification to device
//
// FAILED NOTIFICATION HANDLING:
//   If fcmToken is null    → skip silently, log warning
//   If token is invalid    → log error, remove bad token
//   If send fails          → log error, never crash request
//   Always wrap in try/catch so one bad token
//   never blocks the main operation
//
// MULTICAST (multiple devices at once):
//   Used for: broadcast, delay alerts, SOS to all admins
//   Firebase supports up to 500 tokens per multicast call
//   If more than 500 → split into batches of 500
// ════════════════════════════════════════════════════

const { fcm, firestoreDb } = require('../config/firebase')


// ── Helper: Get FCM token for a single user ────────
const getToken = async (uid) => {
    try {
        const doc = await firestoreDb.collection('users').doc(uid).get()
        if (!doc.exists) {
            console.warn(`[FCM] User ${uid} not found`)
            return null
        }
        const token = doc.data().fcmToken
        if (!token) {
            console.warn(`[FCM] No FCM token for user ${uid}`)
            return null
        }
        return token
    } catch (error) {
        console.error(`[FCM] Failed to get token for ${uid}:`, error.message)
        return null
    }
}


// ── Helper: Get FCM tokens for multiple users ──────
const getTokens = async (uids) => {
    const tokens = []
    for (const uid of uids) {
        const token = await getToken(uid)
        if (token) tokens.push(token)
    }
    return tokens
}


// ── Helper: Send to single device ─────────────────
const sendToOne = async (token, title, body, data = {}) => {
    try {
        const message = {
            notification: { title, body },
            data,
            token,
            android: { priority: 'high' },
            apns: {
                payload: {
                    aps: { sound: 'default' }
                }
            }
        }
        const response = await fcm.send(message)
        console.log(`[FCM] Sent successfully → ${response}`)
        return { success: true }
    } catch (error) {
        console.error(`[FCM] Send failed:`, error.message)
        return { success: false, error: error.message }
    }
}


// ── Helper: Send to multiple devices (multicast) ──
const sendToMany = async (tokens, title, body, data = {}) => {
    if (!tokens.length) {
        console.warn('[FCM] No tokens to send to')
        return { successCount: 0, failureCount: 0 }
    }

    // Split into batches of 500 (Firebase limit)
    const batches     = []
    const batchSize   = 500

    for (let i = 0; i < tokens.length; i += batchSize) {
        batches.push(tokens.slice(i, i + batchSize))
    }

    let successCount = 0
    let failureCount = 0

    for (const batch of batches) {
        try {
            const message = {
                notification: { title, body },
                data,
                tokens: batch,
                android: { priority: 'high' },
                apns: {
                    payload: {
                        aps: { sound: 'default' }
                    }
                }
            }
            const response = await fcm.sendEachForMulticast(message)
            successCount  += response.successCount
            failureCount  += response.failureCount
            console.log(`[FCM] Batch sent → Success: ${response.successCount} Failed: ${response.failureCount}`)
        } catch (error) {
            console.error('[FCM] Batch send failed:', error.message)
            failureCount += batch.length
        }
    }

    return { successCount, failureCount }
}


// ══════════════════════════════════════════════
// NOTIFICATION FUNCTIONS
// ══════════════════════════════════════════════


// ── 1. Passenger Boarded → Notify Parent ──────────
const notifyBoarded = async (parentUid, passengerName) => {
    const token = await getToken(parentUid)
    if (!token) return

    await sendToOne(
        token,
        'RIDESAFE 🚌 — Boarded',
        `${passengerName} has boarded the bus and is on the way!`,
        { type: 'boarded', passengerName }
    )
}


// ── 2. Passenger Dropped → Notify Parent ──────────
const notifyDropped = async (parentUid, passengerName) => {
    const token = await getToken(parentUid)
    if (!token) return

    await sendToOne(
        token,
        'RIDESAFE 🏠 — Dropped Safely',
        `${passengerName} has been safely dropped at the stop!`,
        { type: 'dropped', passengerName }
    )
}


// ── 3. SOS → Notify All Admins ────────────────────
const notifySOS = async (adminUids, busId, message) => {
    const tokens = await getTokens(adminUids)

    await sendToMany(
        tokens,
        '🚨 SOS ALERT — RIDESAFE',
        `Bus ${busId}: ${message || 'Driver triggered SOS. Immediate attention required.'}`,
        { type: 'sos', busId }
    )
}


// ── 4. Bus Delayed → Notify Passengers on Bus ─────
const notifyDelay = async (passengerUids, busId, delayMinutes, reason) => {
    const tokens = await getTokens(passengerUids)

    await sendToMany(
        tokens,
        'RIDESAFE ⏱️ — Bus Delayed',
        `Bus ${busId} is delayed by ${delayMinutes} minutes. ${reason || ''}`.trim(),
        { type: 'delay', busId, delayMinutes: String(delayMinutes) }
    )
}


// ── 5. ETA Shared → Notify Parents at a Stop ──────
const notifyETA = async (parentUids, etaMinutes, stopName) => {
    const tokens = await getTokens(parentUids)

    await sendToMany(
        tokens,
        'RIDESAFE 📍 — Bus ETA Update',
        `Bus arriving at ${stopName} in approximately ${etaMinutes} minutes.`,
        { type: 'eta', etaMinutes: String(etaMinutes), stopName }
    )
}


// ── 6. Broadcast → All Drivers / Passengers / All ─
const broadcastToUsers = async (uids, title, message) => {
    const tokens = await getTokens(uids)
    return await sendToMany(tokens, title, message, { type: 'broadcast' })
}


// ── 7. Trip Started → Notify Driver ───────────────
const notifyTripStarted = async (driverUid, busNumber, routeName) => {
    const token = await getToken(driverUid)
    if (!token) return

    await sendToOne(
        token,
        'RIDESAFE 🟢 — Trip Started',
        `Your trip for Bus ${busNumber} on ${routeName} has been started.`,
        { type: 'tripStarted', busNumber, routeName }
    )
}


module.exports = {
    notifyBoarded,
    notifyDropped,
    notifySOS,
    notifyDelay,
    notifyETA,
    broadcastToUsers,
    notifyTripStarted
}