// config/firebase.js

const admin = require('firebase-admin')
const dotenv = require('dotenv')
const path   = require('path')
const fs     = require('fs')

// Load the shared server .env from the server root.
dotenv.config({ path: path.join(__dirname, '..', '..', '.env') })

function loadServiceAccount() {
    const rawServiceAccount = process.env.FIREBASE_SERVICE_ACCOUNT

    if (rawServiceAccount && rawServiceAccount.trim()) {
        try {
            return JSON.parse(rawServiceAccount)
        } catch (error) {
            throw new Error('Invalid FIREBASE_SERVICE_ACCOUNT JSON in environment.')
        }
    }

    // Fix 2 — capital K in Key
    const localServiceAccountPath = path.join(__dirname, '..', 'serviceAccountKey.json')
    if (fs.existsSync(localServiceAccountPath)) {
        return require(localServiceAccountPath)
    }

    throw new Error('Firebase credentials missing. Set FIREBASE_SERVICE_ACCOUNT or add serviceAccountKey.json.')
}

const serviceAccount = loadServiceAccount()

if (serviceAccount.private_key) {
    serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n')
}

console.log('[Firebase] DB URL:', process.env.FIREBASE_REALTIME_DB_URL)

if (!admin.apps.length) {
    admin.initializeApp({
        credential:  admin.credential.cert(serviceAccount),
        databaseURL: process.env.FIREBASE_REALTIME_DB_URL
    })
}

const firestoreDb  = admin.firestore()
const realtimeDb   = admin.database()
const firebaseAuth = admin.auth()
const fcm          = admin.messaging()

module.exports = { admin, firestoreDb, realtimeDb, firebaseAuth, fcm }