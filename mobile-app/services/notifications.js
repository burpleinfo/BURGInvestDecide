import { Platform } from 'react-native'
import Constants from 'expo-constants'

import * as api from './api'

/**
 * Mobile-app notifications helper.
 *
 * NOTE: For Android/iOS builds, expo-notifications returns the native
 * device token on real devices. That token is saved to the backend and
 * used by the server FCM service.
 */

export const saveFcmTokenToServer = async (token) => {
  if (!token) return { ok: false, reason: 'no-token' }
  try {
    await api.auth.saveFcmToken(token)
    return { ok: true }
  } catch (error) {
    console.error('[Mobile Notifications] Failed to save token', error)
    return { ok: false, reason: error.message }
  }
}

export const registerAndSavePushToken = async () => {
  if (Platform.OS === 'web') {
    return { ok: false, reason: 'web-not-supported' }
  }

  const isExpoGo = Constants.appOwnership === 'expo' || Constants.executionEnvironment === 'storeClient'
  if (isExpoGo) {
    return { ok: false, reason: 'expo-go-not-supported' }
  }

  try {
    const Notifications = await import('expo-notifications')

    const currentPermission = await Notifications.getPermissionsAsync()
    let finalStatus = currentPermission.status

    if (finalStatus !== 'granted') {
      const requested = await Notifications.requestPermissionsAsync()
      finalStatus = requested.status
    }

    if (finalStatus !== 'granted') {
      return { ok: false, reason: 'permission-denied' }
    }

    const tokenResponse = await Notifications.getDevicePushTokenAsync()
    const token = tokenResponse?.data || ''

    if (!token) {
      return { ok: false, reason: 'no-device-token' }
    }

    return await saveFcmTokenToServer(token)
  } catch (error) {
    console.error('[Mobile Notifications] Failed to register token', error)
    return { ok: false, reason: error.message }
  }
}

export default { saveFcmTokenToServer, registerAndSavePushToken }
