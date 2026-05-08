// config/firebase.js

const admin          = require('firebase-admin')
const dotenv         = require('dotenv')
const path           = require('path')
const fs             = require('fs')

dotenv.config({ path: path.join(__dirname, '..', '..', '.env') })

// Load service account from ENV first, then fallback to local key file for dev.
function loadServiceAccount() {
    const rawServiceAccount = process.env.FIREBASE_SERVICE_ACCOUNT

    if (rawServiceAccount && rawServiceAccount.trim()) {
        try {
            return JSON.parse(rawServiceAccount)
        } catch (error) {
            throw new Error('Invalid FIREBASE_SERVICE_ACCOUNT JSON in environment.')
        }
    }

    const localServiceAccountPath = path.join(__dirname, '..', 'serviceAccountkey.json')
    if (fs.existsSync(localServiceAccountPath)) {
        return require(localServiceAccountPath)
    }

    throw new Error('Firebase credentials missing. Set FIREBASE_SERVICE_ACCOUNT or add server/firebase/serviceAccountkey.json.')
}

const serviceAccount = loadServiceAccount()

// Fix private key issue
if (serviceAccount.private_key) {
    serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n')
}

// Initialize Firebase app (only once)
if (!admin.apps.length) {
    admin.initializeApp({
        credential:  admin.credential.cert(serviceAccount),
        databaseURL: process.env.FIREBASE_REALTIME_DB_URL
    })
}

// Export all Firebase clients
const firestoreDb  = admin.firestore()   // Main database
const realtimeDb   = admin.database()    // Live GPS location
const firebaseAuth = admin.auth()        // User authentication
const fcm          = admin.messaging()   // Push notifications

module.exports = { admin, firestoreDb, realtimeDb, firebaseAuth, fcm }