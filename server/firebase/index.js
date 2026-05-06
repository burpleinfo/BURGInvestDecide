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
const configuredOrigins = (process.env.CORS_ORIGIN || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)
    .filter((origin) => origin !== '*')

const defaultOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://burgridesafe-eight.vercel.app'
]

const allowedOrigins = configuredOrigins.length ? configuredOrigins : defaultOrigins

const corsOptions = {
    credentials: true,
    origin: (origin, callback) => {
        // Allow non-browser clients with no Origin header.
        if (!origin) {
            return callback(null, true)
        }

        if (allowedOrigins.includes(origin)) {
            return callback(null, true)
        }

        return callback(new Error(`CORS blocked for origin: ${origin}`))
    }
}

// ── Middleware ─────────────────────────────────────
app.use(helmet())
app.use(cors(corsOptions))
app.options('*', cors(corsOptions))
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