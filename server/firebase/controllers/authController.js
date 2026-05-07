// controllers/authController.js

const { firebaseAuth, firestoreDb } = require('../config/firebase')
const {
    SESSION_COOKIE_NAME,
    SESSION_EXPIRES_IN_MS,
    buildSessionCookieOptions,
    buildSessionCookieClearOptions
} = require('../config/auth')


const getIdTokenFromHeader = (req) => {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return ''
    }

    return authHeader.split('Bearer ')[1]
}


const isValidAdminInvite = (req) => {
    const required = process.env.ADMIN_SIGNUP_SECRET

    if (!required) {
        return { valid: true, warning: 'ADMIN_SIGNUP_SECRET not set' }
    }

    const provided = req.body?.inviteCode || req.body?.adminCode || ''

    if (!provided || provided !== required) {
        return { valid: false, error: 'Invalid admin invite code.' }
    }

    return { valid: true }
}


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


// ── Admin Signup (invite code required) ───────────
const adminSignup = async (req, res) => {
    try {
        const { email, password, name, phone, institutionId, institutionName } = req.body
        const inviteCheck = isValidAdminInvite(req)

        if (!inviteCheck.valid) {
            return res.status(403).json({ error: inviteCheck.error })
        }

        const user = await firebaseAuth.createUser({
            email,
            password,
            displayName: name
        })

        await firebaseAuth.setCustomUserClaims(user.uid, { role: 'pendingAdmin' })

        // Save basic user profile and attach provided institution info (if any)
        const resolvedInstitutionId = institutionId || null
        const resolvedInstitutionName = institutionName || null

        await firestoreDb.collection('users').doc(user.uid).set({
            uid: user.uid,
            name,
            email,
            phone,
            role: 'pendingAdmin',
            fcmToken: null,
            institutionId: resolvedInstitutionId,
            institutionName: resolvedInstitutionName,
            createdAt: new Date().toISOString()
        })

        // Create an admin request record for director approval
        await firestoreDb.collection('adminRequests').doc(user.uid).set({
            uid: user.uid,
            name,
            email,
            phone,
            institutionId: resolvedInstitutionId,
            institutionName: resolvedInstitutionName,
            status: 'pending',
            createdAt: new Date().toISOString()
        })

        // If institution details were provided, ensure an institutions document exists
        if (resolvedInstitutionName) {
            // Use provided institutionId if available; otherwise derive a slug from name
            const instId = resolvedInstitutionId || String(resolvedInstitutionName).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
            const instRef = firestoreDb.collection('institutions').doc(instId)
            const instDoc = await instRef.get()
            if (!instDoc.exists) {
                await instRef.set({
                    id: instId,
                    name: resolvedInstitutionName,
                    createdBy: user.uid,
                    createdAt: new Date().toISOString()
                })
            } else {
                // If exists but missing a name, merge name
                const data = instDoc.data() || {}
                if (!data.name && resolvedInstitutionName) {
                    await instRef.set({ name: resolvedInstitutionName }, { merge: true })
                }
            }
        }

        res.status(202).json({
            message: 'Admin request submitted. Awaiting director approval.',
            uid: user.uid,
            warning: inviteCheck.warning || null
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


// ── Session Login (creates refresh cookie) ─────────
const sessionLogin = async (req, res) => {
    try {
        const idToken = getIdTokenFromHeader(req)

        if (!idToken) {
            return res.status(401).json({ error: 'Missing Firebase ID token.' })
        }

        const decoded = await firebaseAuth.verifyIdToken(idToken)

        if (decoded.role !== 'admin') {
            return res.status(403).json({ error: 'Admin access required.' })
        }
        req.user = decoded
        req.authType = 'idToken'
        const sessionCookie = await firebaseAuth.createSessionCookie(idToken, {
            expiresIn: SESSION_EXPIRES_IN_MS
        })

        res.cookie(SESSION_COOKIE_NAME, sessionCookie, buildSessionCookieOptions())
        res.json({
            message: 'Session cookie set',
            uid: decoded.uid,
            expiresIn: SESSION_EXPIRES_IN_MS
        })
    } catch (error) {
        if (error.code === 'auth/id-token-expired') {
            return res.status(401).json({ error: 'Token expired. Please login again.' })
        }
        res.status(500).json({ error: error.message })
    }
}


// ── Session Logout (clears cookie) ────────────────
const sessionLogout = async (req, res) => {
    try {
        const uid = req.user?.uid

        if (uid) {
            await firebaseAuth.revokeRefreshTokens(uid)
        }

        res.clearCookie(SESSION_COOKIE_NAME, buildSessionCookieClearOptions())
        res.json({ message: 'Session cleared' })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}


module.exports = {
    createUser,
    adminSignup,
    driverLogin,
    passengerLogin,
    saveFcmToken,
    getMe,
    assignRole,
    sessionLogin,
    sessionLogout
}