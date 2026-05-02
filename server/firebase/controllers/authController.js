// controllers/authController.js

const { firebaseAuth, firestoreDb } = require('../config/firebase')


// ── Create User (called by Admin) ─────────────────
const createUser = async (req, res) => {
    try {
        const { email, password, name, role, phone } = req.body

        // Step 1 — Create Firebase Auth account
        const user = await firebaseAuth.createUser({
            email,
            password,
            displayName: name
        })

        // Step 2 — Set role as custom claim
        // This embeds role into the JWT token
        // so middleware can read it without a DB call
        await firebaseAuth.setCustomUserClaims(user.uid, { role })

        // Step 3 — Save profile to Firestore
        await firestoreDb.collection('users').doc(user.uid).set({
            uid:      user.uid,
            name,
            email,
            phone,
            role,
            fcmToken: null,
            createdAt: new Date().toISOString()
        })

        res.status(201).json({
            message: `${role} account created successfully`,
            uid: user.uid
        })

    } catch (error) {
        if (error.code === 'auth/email-already-exists') {
            return res.status(400).json({ error: 'Email already in use' })
        }
        res.status(500).json({ error: error.message })
    }
}


// ── Driver Login info ─────────────────────────────
// Note: Actual login (email+password → token)
// happens on frontend using Firebase client SDK.
// Backend only verifies tokens, never issues them.
const driverLogin = async (req, res) => {
    try {
        const { uid } = req.body

        const userDoc = await firestoreDb.collection('users').doc(uid).get()

        if (!userDoc.exists) {
            return res.status(404).json({ error: 'Driver not found' })
        }

        const userData = userDoc.data()

        if (userData.role !== 'driver') {
            return res.status(403).json({ error: 'Not a driver account' })
        }

        // Get driver's assigned bus
        const driverDoc = await firestoreDb
            .collection('drivers').doc(uid).get()

        res.json({
            user:   userData,
            driver: driverDoc.exists ? driverDoc.data() : null
        })

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}


// ── Passenger Login info ──────────────────────────
const passengerLogin = async (req, res) => {
    try {
        const { uid } = req.body

        const userDoc = await firestoreDb.collection('users').doc(uid).get()

        if (!userDoc.exists) {
            return res.status(404).json({ error: 'Passenger not found' })
        }

        const userData = userDoc.data()

        if (userData.role !== 'passenger') {
            return res.status(403).json({ error: 'Not a passenger account' })
        }

        res.json({ user: userData })

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}


// ── Save FCM Token ────────────────────────────────
// Called right after login on mobile app
// Saves device token so notifications can be sent
const saveFcmToken = async (req, res) => {
    try {
        const { fcmToken } = req.body
        const uid          = req.user.uid

        await firestoreDb.collection('users').doc(uid).update({ fcmToken })

        res.json({ message: 'FCM token saved' })

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}


// ── Get Current User ──────────────────────────────
const getMe = async (req, res) => {
    try {
        const uid     = req.user.uid
        const userDoc = await firestoreDb.collection('users').doc(uid).get()

        if (!userDoc.exists) {
            return res.status(404).json({ error: 'User not found' })
        }

        res.json({ user: userDoc.data() })

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}


// ── Assign Role ───────────────────────────────────
const assignRole = async (req, res) => {
    try {
        const { uid, role } = req.body

        await firebaseAuth.setCustomUserClaims(uid, { role })
        await firestoreDb.collection('users').doc(uid).update({ role })

        res.json({ message: `Role '${role}' assigned to ${uid}` })

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}


module.exports = {
    createUser,
    driverLogin,
    passengerLogin,
    saveFcmToken,
    getMe,
    assignRole
}