// config/firebase.js

const admin          = require('firebase-admin')
const serviceAccount = require('../serviceAccountKey.json')
const dotenv         = require('dotenv')

dotenv.config()

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