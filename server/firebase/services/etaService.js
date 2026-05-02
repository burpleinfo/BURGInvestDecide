// services/etaService.js

// No system design needed here.
// Simple Google Maps API call.
// Input  → bus current GPS + drop point GPS
// Output → ETA in minutes + distance in km

const axios  = require('axios')


// ── Calculate ETA from bus to drop point ──────────
const calculateETA = async (originLat, originLng, destLat, destLng) => {
    try {
        if (!process.env.GOOGLE_MAPS_API_KEY) {
            throw new Error('Google Maps API key not set in .env')
        }

        const response = await axios.get(
            'https://maps.googleapis.com/maps/api/distancematrix/json',
            {
                params: {
                    origins:      `${originLat},${originLng}`,
                    destinations: `${destLat},${destLng}`,
                    mode:         'driving',
                    key:          process.env.GOOGLE_MAPS_API_KEY
                },
                timeout: 10000   // 10 second timeout
            }
        )

        const element = response.data.rows[0].elements[0]

        if (element.status !== 'OK') {
            throw new Error(`Google Maps returned status: ${element.status}`)
        }

        return {
            etaMinutes:   Math.floor(element.duration.value / 60),
            etaSeconds:   element.duration.value,
            distanceKm:   (element.distance.value / 1000).toFixed(2),
            etaText:      element.duration.text,      // e.g. "12 mins"
            distanceText: element.distance.text        // e.g. "4.3 km"
        }

    } catch (error) {
        if (error.code === 'ECONNABORTED') {
            throw new Error('Google Maps API timeout')
        }
        throw new Error(`ETA calculation failed: ${error.message}`)
    }
}


// ── Calculate ETA for multiple stops at once ───────
// Used when admin wants ETA from bus to all stops on route
const calculateETAForStops = async (originLat, originLng, stops) => {
    try {
        // Build destinations string for all stops at once
        // e.g. "17.38,78.48|17.39,78.49|17.40,78.50"
        const destinations = stops
            .map(stop => `${stop.lat},${stop.lng}`)
            .join('|')

        const response = await axios.get(
            'https://maps.googleapis.com/maps/api/distancematrix/json',
            {
                params: {
                    origins:      `${originLat},${originLng}`,
                    destinations,
                    mode:         'driving',
                    key:          process.env.GOOGLE_MAPS_API_KEY
                },
                timeout: 10000
            }
        )

        const elements = response.data.rows[0].elements

        return stops.map((stop, index) => {
            const el = elements[index]
            if (el.status !== 'OK') {
                return { stopId: stop.id, stopName: stop.name, error: 'Could not calculate' }
            }
            return {
                stopId:       stop.id,
                stopName:     stop.name,
                etaMinutes:   Math.floor(el.duration.value / 60),
                distanceKm:   (el.distance.value / 1000).toFixed(2),
                etaText:      el.duration.text,
                distanceText: el.distance.text
            }
        })

    } catch (error) {
        throw new Error(`Multi-stop ETA failed: ${error.message}`)
    }
}


module.exports = {
    calculateETA,
    calculateETAForStops
}