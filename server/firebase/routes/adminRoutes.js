// routes/adminRoutes.js

// ════════════════════════════════════════════════════
// SYSTEM DESIGN NOTE — Role Based Access (Design #2)
// ════════════════════════════════════════════════════
// Three roles touch the same Firestore data.
// Access is controlled at TWO layers:
//
// LAYER 1 — Node.js Middleware (authMiddleware.js)
//   adminOnly    → verifyToken + role === 'admin'
//   driverOnly   → verifyToken + role === 'driver'
//   passengerOnly→ verifyToken + role === 'passenger'
//
// LAYER 2 — Firestore Security Rules (firestore.rules)
//   Even if middleware is bypassed, Firestore rules
//   block reads/writes at the database level.
//
// Rule summary:
//   Admin     → read/write ALL collections
//   Driver    → read/write only their own bus + trip
//   Passenger → read only their own bus location + status
//
// Both layers must be consistent —
// if you add a new collection, update BOTH middleware
// guards and Firestore rules.
// ════════════════════════════════════════════════════

const express    = require('express')
const router     = express.Router()
const controller = require('../controllers/adminController')
const { adminOnly } = require('../middleware/authMiddleware')


// ── User Management ───────────────────────────────
router.post('/create-driver',      ...adminOnly, controller.createDriver)
router.post('/create-passenger',   ...adminOnly, controller.createPassenger)
router.delete('/delete-user/:uid', ...adminOnly, controller.deleteUser)
router.get('/all-drivers',         ...adminOnly, controller.getAllDrivers)
router.get('/all-passengers',      ...adminOnly, controller.getAllPassengers)

// ── Bus Management ────────────────────────────────
router.post('/add-bus',            ...adminOnly, controller.addBus)
router.put('/update-bus/:busId',   ...adminOnly, controller.updateBus)
router.delete('/delete-bus/:busId',...adminOnly, controller.deleteBus)
router.get('/all-buses',           ...adminOnly, controller.getAllBuses)

// ── Route Management ──────────────────────────────
router.post('/add-route',          ...adminOnly, controller.addRoute)
router.put('/update-route/:routeId',...adminOnly, controller.updateRoute)
router.get('/all-routes',          ...adminOnly, controller.getAllRoutes)

// ── Trip Management ───────────────────────────────
router.post('/start-trip',         ...adminOnly, controller.startTrip)
router.get('/active-trips',        ...adminOnly, controller.getActiveTrips)
router.get('/trip-report/:tripId', ...adminOnly, controller.getTripReport)

// ── Live Dashboard (System Design #1) ─────────────
// Returns all bus locations from Realtime DB at once
router.get('/all-locations',       ...adminOnly, controller.getAllLiveLocations)

// ── Attendance Report ─────────────────────────────
router.get('/attendance/:tripId',  ...adminOnly, controller.getAttendanceReport)

// ── Notifications & Alerts (System Design #3) ─────
router.post('/broadcast',          ...adminOnly, controller.broadcastAlert)
router.post('/notify-delay',       ...adminOnly, controller.notifyDelay)
router.get('/sos-alerts',          ...adminOnly, controller.getSOSAlerts)

// ── Revenue & Payments ────────────────────────────
router.get('/revenue',             ...adminOnly, controller.getRevenueReport)


module.exports = router