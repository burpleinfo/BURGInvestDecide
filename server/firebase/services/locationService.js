// services/locationService.js

// ════════════════════════════════════════════════════
// SYSTEM DESIGN #1 — Live Location Flow
// ════════════════════════════════════════════════════
//
// WRITE PATH (Driver → Realtime DB):
//
//   Driver's phone calls POST /driver/update-location
//   every 5 seconds while trip is active
//         ↓
//   locationService.updateBusLocation()
//   writes { lat, lng, speed, timestamp } to:
//   Firebase Realtime DB → /liveLocations/{busId}
//         ↓
//   Single write, overwrites previous location
//   (no history kept in Realtime DB — just current position)
//
// READ PATH (Passenger/Admin ← Realtime DB):
//
//   Passenger → GET /passenger/live-location/{busId}
//   Admin     → GET /admin/all-locations
//         ↓
//   locationService reads from Realtime DB
//   Returns location + isStale flag
//
// STALE LOCATION DETECTION:
//   Every write includes timestamp: Date.now()
//   On read: if now - timestamp > 30000ms (30 seconds)
//   → isStale = true → frontend shows "Location unavailable"
//   This handles: driver app crash, no internet, phone off
//
// OFFLINE HANDLING:
//   If driver loses internet → writes stop coming in
//   After 30 seconds → frontend shows location as stale
//   When driver reconnects → writes resume, stale clears
//
// CLEANUP (when trip ends):
//   clearBusLocation() deletes /liveLocations/{busId}
//   This ensures no ghost bus markers on the map
//   after trip is completed
//
// ADMIN DASHBOARD:
//   getAllBusLocations() reads /liveLocations (entire node)
//   Returns all active bus locations in one single read
//   Much more efficient than reading each bus separately
// ════════════════════════════════════════════════════

const { realtimeDb } = require('../config/firebase')


// ── Write: Driver updates live GPS ────────────────
const updateBusLocation = async (busId, lat, lng, speed = 0) => {
    try {
        await realtimeDb.ref(`/liveLocations/${busId}`).set({
            lat,
            lng,
            speed,
            timestamp: Date.now()     // Used for stale detection
        })
        return { success: true }
    } catch (error) {
        console.error(`[Location] Update failed for bus ${busId}:`, error.message)
        throw error
    }
}


// ── Read: Get single bus location ─────────────────
const getBusLocation = async (busId) => {
    try {
        const snapshot = await realtimeDb
            .ref(`/liveLocations/${busId}`)
            .once('value')

        const location = snapshot.val()

        if (!location) {
            return null
        }

        // Check if location data is stale
        const isStale = Date.now() - location.timestamp > 30000

        return {
            ...location,
            isStale
        }
    } catch (error) {
        console.error(`[Location] Read failed for bus ${busId}:`, error.message)
        throw error
    }
}


// ── Read: Get ALL active bus locations ────────────
// Used by admin dashboard to show all buses on map
const getAllBusLocations = async () => {
    try {
        const snapshot  = await realtimeDb
            .ref('/liveLocations')
            .once('value')

        const locations = snapshot.val()

        if (!locations) return {}

        // Add isStale flag to each bus location
        const result = {}
        for (const [busId, location] of Object.entries(locations)) {
            result[busId] = {
                ...location,
                isStale: Date.now() - location.timestamp > 30000
            }
        }

        return result
    } catch (error) {
        console.error('[Location] Read all failed:', error.message)
        throw error
    }
}


// ── Cleanup: Remove location when trip ends ────────
const clearBusLocation = async (busId) => {
    try {
        await realtimeDb.ref(`/liveLocations/${busId}`).remove()
        console.log(`[Location] Cleared location for bus ${busId}`)
        return { success: true }
    } catch (error) {
        console.error(`[Location] Clear failed for bus ${busId}:`, error.message)
        throw error
    }
}


// ── Check: Is bus currently active/online ─────────
const isBusOnline = async (busId) => {
    try {
        const location = await getBusLocation(busId)
        if (!location) return false
        return !location.isStale
    } catch (error) {
        return false
    }
}


module.exports = {
    updateBusLocation,
    getBusLocation,
    getAllBusLocations,
    clearBusLocation,
    isBusOnline
}