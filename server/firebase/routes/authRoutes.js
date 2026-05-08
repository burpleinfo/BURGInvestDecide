// routes/authRoutes.js

const express    = require('express')
const router     = express.Router()
const controller = require('../controllers/authController')
const { verifyToken } = require('../middleware/authMiddleware')


// ── Public Routes (no token needed) ───────────────
router.post('/create-user',    controller.createUser)
router.post('/admin-signup',   controller.adminSignup)
router.post('/driver-login',   controller.driverLogin)
router.post('/passenger-login',controller.passengerLogin)
router.post('/session-login',  controller.sessionLogin)

// ── Protected Routes (token required) ─────────────
router.post('/save-fcm-token', verifyToken, controller.saveFcmToken)
router.get('/me',              verifyToken, controller.getMe)
router.post('/assign-role',    verifyToken, controller.assignRole)
router.post('/session-logout',  verifyToken, controller.sessionLogout)


module.exports = router