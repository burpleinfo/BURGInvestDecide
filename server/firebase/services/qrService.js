// services/qrService.js

// No system design needed here.
// QR code is generated from passenger's UID + burgId.
// Driver scans QR → backend verifies → marks boarded.
//
// FLOW:
//   Passenger opens app → GET /passenger/qr-code
//   → qrService.generateQR() creates a QR image
//   → QR contains: { uid, burgId, timestamp }
//
//   Driver scans QR → POST /passenger/scan-qr
//   → qrService.verifyQR() decodes and validates
//   → Returns passengerUid if valid
//   → Controller marks passenger as boarded

const QRCode = require('qrcode')


// ── Generate QR Code for a passenger ──────────────
const generateQR = async (uid, burgId) => {
    try {
        // Payload embedded in QR
        const payload = JSON.stringify({
            uid,
            burgId,
            timestamp: Date.now()
        })

        // Generate as base64 image string
        // Frontend renders this directly as <img src={qrCode} />
        const qrDataURL = await QRCode.toDataURL(payload, {
            errorCorrectionLevel: 'H',   // High error correction
            width:                300,
            margin:               2,
            color: {
                dark:  '#0F766E',          // Teal (matches app theme)
                light: '#FFFFFF'
            }
        })

        return { qrCode: qrDataURL, burgId }

    } catch (error) {
        throw new Error(`QR generation failed: ${error.message}`)
    }
}


// ── Verify scanned QR data ─────────────────────────
const verifyQR = (qrData) => {
    try {
        const parsed = JSON.parse(qrData)

        // Validate required fields
        if (!parsed.uid || !parsed.burgId || !parsed.timestamp) {
            return { valid: false, error: 'Invalid QR data' }
        }

        // Check QR is not older than 5 minutes
        // Prevents reuse of old QR screenshots
        const ageMs      = Date.now() - parsed.timestamp
        const maxAgeMs   = 5 * 60 * 1000   // 5 minutes

        if (ageMs > maxAgeMs) {
            return { valid: false, error: 'QR code expired. Please refresh.' }
        }

        return {
            valid: true,
            uid:   parsed.uid,
            burgId: parsed.burgId
        }

    } catch (error) {
        return { valid: false, error: 'Could not read QR code' }
    }
}


// ── Generate QR as plain text (for testing) ────────
const generateQRText = async (uid, burgId) => {
    try {
        const payload = JSON.stringify({ uid, burgId, timestamp: Date.now() })
        const qrText  = await QRCode.toString(payload, { type: 'terminal' })
        return qrText
    } catch (error) {
        throw new Error(`QR text generation failed: ${error.message}`)
    }
}


module.exports = {
    generateQR,
    verifyQR,
    generateQRText
}