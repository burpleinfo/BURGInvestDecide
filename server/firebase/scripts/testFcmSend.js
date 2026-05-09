// scripts/testFcmSend.js
// Quick script to create a test user doc and attempt a send via fcmService

const { firestoreDb } = require('../config/firebase')
const fcmService = require('../services/fcmService')

async function run() {
  try {
    const uid = 'test-web-user'
    const testToken = 'TEST_DEVICE_TOKEN_123'

    await firestoreDb.collection('users').doc(uid).set({
      uid,
      name: 'Test Web User',
      email: 'test@example.com',
      role: 'passenger',
      fcmToken: testToken,
      createdAt: new Date().toISOString()
    }, { merge: true })

    console.log('[testFcmSend] Test user written with token:', testToken)

    const result = await fcmService.notifyBoarded(uid, 'Test Student', 'TESTBUS', 'Test Stop')

    console.log('[testFcmSend] notifyBoarded result:', result)
  } catch (error) {
    console.error('[testFcmSend] Error:', error)
  }
}

run().then(() => process.exit(0)).catch(() => process.exit(1))
