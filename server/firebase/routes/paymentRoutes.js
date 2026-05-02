// routes/paymentRoutes.js

// No system design needed here.
// Standard CRUD — save payment record to Firestore,
// fetch history from Firestore. No real-time needed.

const express    = require('express')
const router     = express.Router()
const controller = require('../controllers/paymentController')
const { passengerOnly, adminOnly } = require('../middleware/authMiddleware')


// ── Passenger Payment Routes ───────────────────────
router.get('/fare/:busId',       ...passengerOnly, controller.getFare)
router.post('/pay',              ...passengerOnly, controller.processPayment)
router.get('/history',           ...passengerOnly, controller.getPaymentHistory)
router.get('/receipt/:paymentId',...passengerOnly, controller.getReceipt)

// ── Admin Payment Routes ───────────────────────────
router.get('/all-transactions',  ...adminOnly, controller.getAllTransactions)
router.get('/revenue',           ...adminOnly, controller.getRevenueReport)


module.exports = router