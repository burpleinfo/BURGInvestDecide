// scripts/testFcmSend.js
// Quick script to create a test user doc and attempt a send via fcmService

const { firestoreDb } = require('../config/firebase')
const fcmService = require('../services/fcmService')

async function run() {
  try {
    const uid = process.argv[2]
    const fcmToken = process.argv[3]

    if (!uid || !fcmToken) {
      console.error('[testFcmSend] Missing arguments!')
      console.log('[testFcmSend] Usage: node testFcmSend.js <uid> <fcmToken>')
      console.log('[testFcmSend] Example:')
      console.log('  node testFcmSend.js XRcCKbX470XdQdNs4DubwMS8bIv1 "dTHQOX4CRUupJhHV46k_X4:APA91b..."')
      process.exit(1)
    }

    await firestoreDb.collection('users').doc(uid).set({
      fcmToken,
    }, { merge: true })

    console.log('[testFcmSend] Updated user token for:', uid)
    console.log('[testFcmSend] Token:', fcmToken)

    const userDoc = await firestoreDb.collection('users').doc(uid).get()
    const userData = userDoc.data() || {}

    const result = await fcmService.notifyBoarded(
      uid,
      userData.name || 'Driver',
      userData.assignedBusNumber || userData.busNumber || '',
      userData.assignedLocationName || userData.assignedRouteName || ''
    )

    console.log('[testFcmSend] notifyBoarded result:', result)
  } catch (error) {
    console.error('[testFcmSend] Error:', error)
  }
}

run().then(() => process.exit(0)).catch(() => process.exit(1))
