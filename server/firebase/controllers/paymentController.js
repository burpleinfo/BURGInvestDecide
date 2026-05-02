// controllers/paymentController.js

// No system design needed here.
// Standard Firestore CRUD operations.

const { firestoreDb } = require('../config/firebase')


// ── Get Fare ──────────────────────────────────────
const getFare = async (req, res) => {
    try {
        const { busId } = req.params

        const busDoc = await firestoreDb.collection('buses').doc(busId).get()

        if (!busDoc.exists) {
            return res.status(404).json({ error: 'Bus not found' })
        }

        res.json({ fare: busDoc.data().fare || 15.00 })

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}


// ── Process Payment ───────────────────────────────
const processPayment = async (req, res) => {
    try {
        const uid                              = req.user.uid
        const { busId, amount, method, details } = req.body

        // Save payment record to Firestore
        const paymentRef = await firestoreDb.collection('payments').add({
            passengerUid: uid,
            busId,
            amount,
            method,          // 'card' | 'upi' | 'netbanking'
            details,         // card last 4 digits / UPI id
            status:          'success',
            createdAt:       new Date().toISOString()
        })

        res.status(201).json({
            message:   'Payment successful',
            paymentId: paymentRef.id,
            amount,
            method
        })

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}


// ── Get Payment History ───────────────────────────
const getPaymentHistory = async (req, res) => {
    try {
        const uid = req.user.uid

        const snap = await firestoreDb
            .collection('payments')
            .where('passengerUid', '==', uid)
            .orderBy('createdAt', 'desc')
            .get()

        const payments = snap.docs.map(d => ({ id: d.id, ...d.data() }))
        res.json({ payments })

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}


// ── Get Receipt ───────────────────────────────────
const getReceipt = async (req, res) => {
    try {
        const { paymentId } = req.params
        const uid           = req.user.uid

        const paymentDoc = await firestoreDb
            .collection('payments').doc(paymentId).get()

        if (!paymentDoc.exists) {
            return res.status(404).json({ error: 'Payment not found' })
        }

        // Make sure passenger can only see their own receipt
        if (paymentDoc.data().passengerUid !== uid) {
            return res.status(403).json({ error: 'Access denied' })
        }

        res.json({ receipt: { id: paymentDoc.id, ...paymentDoc.data() } })

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}


// ── Get All Transactions (Admin) ──────────────────
const getAllTransactions = async (req, res) => {
    try {
        const snap = await firestoreDb
            .collection('payments')
            .orderBy('createdAt', 'desc')
            .get()

        const payments = snap.docs.map(d => ({ id: d.id, ...d.data() }))
        res.json({ payments, total: payments.length })

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}


// ── Get Revenue Report (Admin) ────────────────────
const getRevenueReport = async (req, res) => {
    try {
        const snap = await firestoreDb.collection('payments').get()

        const total   = snap.docs.reduce((sum, d) => sum + d.data().amount, 0)
        const byBus   = {}

        snap.docs.forEach(d => {
            const { busId, amount } = d.data()
            byBus[busId] = (byBus[busId] || 0) + amount
        })

        res.json({
            totalRevenue: total.toFixed(2),
            byBus
        })

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}


module.exports = {
    getFare,
    processPayment,
    getPaymentHistory,
    getReceipt,
    getAllTransactions,
    getRevenueReport
}