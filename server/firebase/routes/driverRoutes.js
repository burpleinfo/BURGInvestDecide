// routes/driverRoutes.js

// ════════════════════════════════════════════════════
// SYSTEM DESIGN NOTE — Live Location (Design #1)
// ════════════════════════════════════════════════════
// POST /driver/update-location is called every 5 seconds
// by the driver's phone while trip is active.
//
// Flow:
//   Driver phone → POST /update-location
//   → locationService writes to Realtime DB
//   → Passenger app listens to Realtime DB directly
//   → Admin dashboard reads all locations from Realtime DB
//
// When to call:
//   START writing  → when driver starts trip
//   STOP writing   → when driver ends trip (clear from Realtime DB)
//
// Stale location handling:
//   Each location write includes a timestamp.
//   If timestamp > 30 seconds old → frontend shows "Location unavailable"
//   When trip ends → clear bus location from Realtime DB
// ════════════════════════════════════════════════════

const express    = require('express')
const router     = express.Router()
const controller = require('../controllers/driverContoller')
const { driverOnly } = require('../middleware/authMiddleware')


// ── Trip ──────────────────────────────────────────
router.get('/my-trip',              ...driverOnly, controller.getMyTrip)
router.post('/end-trip/:tripId',    ...driverOnly, controller.endTrip)

// ── Live Location (System Design #1) ──────────────
router.post('/update-location',     ...driverOnly, controller.updateLocation)

// ── Attendance ────────────────────────────────────
router.post('/mark-boarded/:studentId', ...driverOnly, controller.markBoarded)
router.post('/mark-dropped/:studentId', ...driverOnly, controller.markDropped)
router.post('/mark-all-boarded',        ...driverOnly, controller.markAllBoarded)

// ── Stops ─────────────────────────────────────────
router.post('/complete-stop/:stopId',   ...driverOnly, controller.completeStop)

// ── SOS (System Design #3 — Notification) ─────────
// Triggers FCM to Admin + Office immediately
router.post('/sos',                     ...driverOnly, controller.triggerSOS)

// ── ETA Share ─────────────────────────────────────
router.post('/share-eta',               ...driverOnly, controller.shareETA)

// ── Passengers list ───────────────────────────────
router.get('/passengers',               ...driverOnly, controller.getPassengers)


module.exports = router