// config/firebase.js

const admin          = require('firebase-admin')
const dotenv         = require('dotenv')
const path           = require('path')

dotenv.config({ path: path.join(__dirname, '..', '..', '.env') })

// Load service account from ENV
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)

// Fix private key issue
serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n')

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