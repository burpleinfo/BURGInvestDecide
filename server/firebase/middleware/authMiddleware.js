// middleware/authMiddleware.js

// ════════════════════════════════════════════════════
// SYSTEM DESIGN #2 — Role Based Access Control
// ════════════════════════════════════════════════════
// Access control works at TWO layers:
//
// LAYER 1 — This middleware (runs on every request)
//
//   Step 1: Frontend sends request with header:
//           Authorization: Bearer <firebase_token>
//
//   Step 2: verifyToken() extracts the token,
//           calls Firebase to verify it,
//           attaches decoded user to req.user
//           decoded = { uid, email, role, name }
//
//   Step 3: requireRole() checks req.user.role
//           against the allowed roles for that route.
//           If role doesn't match → 403 Access Denied
//           If role matches      → next() → controller runs
//
// LAYER 2 — Firestore Security Rules (firestore.rules)
//   Even if this middleware is bypassed somehow,
//   Firestore will still block the read/write
//   at the database level based on the same role.
//
// Role assignment flow:
//   Admin creates user → Firebase Auth account created
//   → custom claim set: { role: 'driver' | 'passenger' | 'admin' }
//   → custom claim is embedded in the JWT token
//   → verifyToken reads it from decoded token
//   → no extra database call needed for role check
//
// Role matrix:
//   Route prefix    Allowed roles
//   /auth           public (no role needed)
//   /driver/*       driver only
//   /passenger/*    passenger only
//   /payment/*      passenger (own) | admin (all)
//   /admin/*        admin only
// ════════════════════════════════════════════════════

const { firebaseAuth } = require('../config/firebase')


const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                error: 'Invalid authorization format. Use: Bearer <token>'
            })
        }

        const token   = authHeader.split('Bearer ')[1]
        const decoded = await firebaseAuth.verifyIdToken(token)

        req.user = decoded
        next()

    } catch (error) {
        if (error.code === 'auth/id-token-expired') {
            return res.status(401).json({ error: 'Token expired. Please login again.' })
        }
        return res.status(401).json({ error: 'Invalid token.' })
    }
}


const requireRole = (...allowedRoles) => {
    return (req, res, next) => {
        const userRole = req.user?.role

        if (!userRole || !allowedRoles.includes(userRole)) {
            return res.status(403).json({
                error: `Access denied. Required: ${allowedRoles}. Your role: ${userRole}`
            })
        }
        next()
    }
}


const adminOnly     = [verifyToken, requireRole('admin')]
const driverOnly    = [verifyToken, requireRole('driver')]
const passengerOnly = [verifyToken, requireRole('passenger')]
const anyRole       = [verifyToken, requireRole('admin', 'driver', 'passenger')]


module.exports = { verifyToken, requireRole, adminOnly, driverOnly, passengerOnly, anyRole }