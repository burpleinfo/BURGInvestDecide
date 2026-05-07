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

// Never allow wildcard when credentials: true
const configuredOrigins = (process.env.CORS_ORIGIN || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)
    .filter((origin) => origin !== '*') // Explicitly reject wildcard

const defaultOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://burgridesafe-eight.vercel.app'
]

const allowedOrigins = configuredOrigins.length > 0 ? configuredOrigins : defaultOrigins

const corsOptions = {
    credentials: true,
    origin: (origin, callback) => {
        // Allow non-browser clients with no Origin header
        if (!origin) {
            return callback(null, true)
        }

        // Check if origin is allowed
        if (allowedOrigins.includes(origin)) {
            // Allow this origin. Passing `true` tells the cors middleware
            // to reflect the request's Origin header back in
            // `Access-Control-Allow-Origin` (safer than using `*`).
            return callback(null, true)
        }

        // Log blocked origin for debugging
        console.warn(`CORS blocked for origin: ${origin}. Allowed: ${allowedOrigins.join(', ')}`)
        return callback(new Error(`CORS blocked for origin: ${origin}`))
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'X-CSRF-Token'],
    exposedHeaders: ['Set-Cookie', 'Access-Control-Allow-Origin']
}

// ── Middleware ─────────────────────────────────────
// Configure Helmet to NOT set CORS headers - let cors() middleware handle it
app.use(helmet({
    crossOriginResourcePolicy: false,  // Disable helmet's CORS override
    crossOriginOpenerPolicy: false     // Don't interfere with COOP
}))
// CORS MUST come before routes
app.use(cors(corsOptions))
app.options('*', cors(corsOptions))
app.use(cookieParser())
app.use(express.json())

// Ensure the `Vary` header reflects that responses vary by Origin
app.use((req, res, next) => {
    res.vary('Origin')
    next()
})

// ── Routes ─────────────────────────────────────────
app.use('/auth',      require('./routes/authRoutes'))
app.use('/driver',    require('./routes/driverRoutes'))
app.use('/passenger', require('./routes/passengerRoutes'))
app.use('/payment',   require('./routes/paymentRoutes'))
app.use('/admin',     auditLogger('admin.request', {
    shouldLog: (req) => !(req.method === 'GET' && req.originalUrl.includes('/admin/all-locations'))
}), require('./routes/adminRoutes'))
app.use('/director',  auditLogger('director.request'), require('./routes/directorRoutes'))
app.use('/institution', auditLogger('institution.request'), require('./routes/institutionRoutes'))

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
    // Ensure CORS headers are sent even on error
    const origin = req.get('origin')
    if (allowedOrigins.includes(origin)) {
        res.set('Access-Control-Allow-Origin', origin)
        res.set('Access-Control-Allow-Credentials', 'true')
    }
    res.status(500).json({ error: err.message || 'Internal server error' })
})

// ── Start Server ───────────────────────────────────
const PORT = process.env.PORT || 8000
const server = http.createServer(app)

startLiveLocationsSocket(server)

server.listen(PORT, () => {
    console.log(`🚌 RIDESAFE server running on port ${PORT}`)
})