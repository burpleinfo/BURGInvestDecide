import { firebaseApp, firebaseAuth } from './firebaseClient'
import { getMessaging, getToken, onMessage } from 'firebase/messaging'
import { getApiUrl } from '../utils/apiUrl'

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY || (window.__RIDE_SAFE_CONFIG && window.__RIDE_SAFE_CONFIG.FIREBASE_VAPID_KEY) || ''

const messaging = (() => {
  try {
    return getMessaging(firebaseApp)
  } catch (e) {
    console.warn('[Notifications] Messaging not available in this environment', e.message)
    return null
  }
})()

export const requestWebPushPermissionAndSave = async () => {
  if (!messaging) return { ok: false, reason: 'messaging-unavailable' }

  if (!('Notification' in window)) {
    return { ok: false, reason: 'notifications-not-supported' }
  }

  const permission = await Notification.requestPermission()
  if (permission !== 'granted') return { ok: false, reason: 'permission-denied' }

  try {
    // Ensure the firebase service worker is registered from /firebase-messaging-sw.js
    let swRegistration = null
    if ('serviceWorker' in navigator) {
      try {
        // register the service worker and wait until it's active
        await navigator.serviceWorker.register('/firebase-messaging-sw.js')
        swRegistration = await navigator.serviceWorker.ready
        console.log('[Notifications] Service worker ready:', !!(swRegistration && swRegistration.active))
      } catch (swErr) {
        console.error('[Notifications] Service worker registration failed', swErr)
        return { ok: false, reason: swErr.message }
      }
    }

    const token = await getToken(messaging, { vapidKey: VAPID_KEY, serviceWorkerRegistration: swRegistration })
    if (!token) return { ok: false, reason: 'no-token' }

    // Send token to backend save endpoint using Firebase ID token for auth
    const user = firebaseAuth.currentUser
    if (!user) return { ok: false, reason: 'not-signed-in' }

    const idToken = await user.getIdToken()

    const response = await fetch(getApiUrl('/auth/save-fcm-token'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`
      },
      body: JSON.stringify({ fcmToken: token })
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Save token failed (${response.status}): ${errorText}`)
    }

    return { ok: true, token }
  } catch (error) {
    console.error('[Notifications] Failed to get/save token', error)
    return { ok: false, reason: error.message }
  }
}

export const listenForegroundMessages = (handler) => {
  if (!messaging) return () => {}
  return onMessage(messaging, handler)
}

export default { requestWebPushPermissionAndSave, listenForegroundMessages }
