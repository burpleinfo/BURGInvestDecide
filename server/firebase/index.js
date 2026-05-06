// index.js

const express    = require('express')
const cors       = require('cors')
const helmet     = require('helmet')
const dotenv     = require('dotenv')
const path       = require('path')
const http       = require('http')
const cookieParser = require('cookie-parser')
const auditLogger = require('./middleware/auditLogger')
const { startLiveLocationsSocket } = require('./websocket/liveLocationsSocket')

dotenv.config({ path: path.join(__dirname, '..', '.env') })

const app = express()

// ── Middleware ─────────────────────────────────────
app.use(helmet())
app.use(cors({
    origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : true,
    credentials: true
}))
app.use(cookieParser())
app.use(express.json())

// ── Routes ─────────────────────────────────────────
app.use('/auth',      require('./routes/authRoutes'))
app.use('/driver',    require('./routes/driverRoutes'))
app.use('/passenger', require('./routes/passengerRoutes'))
app.use('/payment',   require('./routes/paymentRoutes'))
app.use('/admin',     auditLogger('admin.request', {
    shouldLog: (req) => !(req.method === 'GET' && req.originalUrl.includes('/admin/all-locations'))
}), require('./routes/adminRoutes'))

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
const server = http.createServer(app)

startLiveLocationsSocket(server)

server.listen(PORT, () => {
    console.log(`🚌 RIDESAFE server running on port ${PORT}`)
})