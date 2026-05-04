// index.js

const express    = require('express')
const cors       = require('cors')
const helmet     = require('helmet')
const dotenv     = require('dotenv')
const path       = require('path')

dotenv.config({ path: path.join(__dirname, '..', '.env') })

const app = express()

// ── Middleware ─────────────────────────────────────
app.use(helmet())
app.use(cors())
app.use(express.json())

// ── Routes ─────────────────────────────────────────
app.use('/auth',      require('./routes/authRoutes'))
app.use('/driver',    require('./routes/driverRoutes'))
app.use('/passenger', require('./routes/passengerRoutes'))
app.use('/payment',   require('./routes/paymentRoutes'))
app.use('/admin',     require('./routes/adminRoutes'))

// ── Health Check ───────────────────────────────────
app.get('/', (req, res) => {
    res.json({ message: 'RIDESAFE Backend Running ✅' })
})

// ── 404 Handler ────────────────────────────────────
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' })
})

// ── Global Error Handler ───────────────────────────
app.use((err, req, res, next) => {
    console.error('[ERROR]', err.message)
    res.status(500).json({ error: err.message || 'Internal server error' })
})

// ── Start Server ───────────────────────────────────
const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
    console.log(`🚌 RIDESAFE server running on port ${PORT}`)
})