// routes/passengerRoutes.js

// ════════════════════════════════════════════════════
// SYSTEM DESIGN NOTE — Notification Flow (Design #3)
// ════════════════════════════════════════════════════
// Notifications are triggered from these passenger events:
//
//   PASSENGER BOARDS (driver marks boarded)
//   → FCM to parent/guardian phone
//   → Message: "{name} has boarded bus {busNumber}"
//
//   PASSENGER DROPPED
//   → FCM to parent/guardian phone
//   → Message: "{name} safely dropped at {stopName}"
//
//   BUS DELAYED
//   → POST /passenger/notify-delay (called by admin)
//   → FCM to ALL passengers on that bus
//
//   MISSED BUS
//   → Passenger opens live tracking, bus has passed their stop
//   → App shows nearest alternative pickup point
//   → No notification needed — handled in frontend from live data
//
// Failed notification handling:
//   If FCM token is null → skip silently, log warning
//   If FCM send fails    → log error, do not crash the request
// ════════════════════════════════════════════════════

const express    = require('express')
const router     = express.Router()
const controller = require('../controllers/passengerController')
const { passengerOnly, verifyToken } = require('../middleware/authMiddleware')


// ── Profile & BURG ID ─────────────────────────────
router.get('/me',                   ...passengerOnly, controller.getMyProfile)
router.get('/burg-id',              ...passengerOnly, controller.getBurgId)

// ── QR Boarding ───────────────────────────────────
router.get('/qr-code',              ...passengerOnly, controller.generateQR)
router.post('/scan-qr',             ...passengerOnly, controller.scanQR)

// ── Schedule Manager ──────────────────────────────
router.get('/schedule',             ...passengerOnly, controller.getSchedule)
router.post('/schedule',            ...passengerOnly, controller.saveSchedule)

// ── Live Tracking (reads from Realtime DB) ────────
router.get('/live-location/:busId', ...passengerOnly, controller.getLiveLocation)
router.get('/eta/:busId',           ...passengerOnly, controller.getETA)
router.get('/trip-status',          ...passengerOnly, controller.getTripStatus)

// ── Missed Bus ────────────────────────────────────
router.get('/nearest-stop',         ...passengerOnly, controller.getNearestAlternativeStop)

// ── Driver Info ───────────────────────────────────
router.get('/driver-info/:busId',   ...passengerOnly, controller.getDriverInfo)


module.exports = router