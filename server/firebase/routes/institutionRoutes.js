// routes/institutionRoutes.js

const express = require('express');
const router = express.Router();
const controller = require('../controllers/institutionController');
const { adminOnly } = require('../middleware/authMiddleware');

// ── Institution Management ────────────────────────
router.get('/institution/:institutionId', controller.getInstitution);

// ── Driver Management ─────────────────────────────
router.get('/institution/:institutionId/drivers', controller.getInstitutionDrivers);
router.post('/institution/:institutionId/drivers', ...adminOnly, controller.createInstitutionDriver);
router.put('/institution/:institutionId/drivers/:driverId', ...adminOnly, controller.updateInstitutionDriver);
router.delete('/institution/:institutionId/drivers/:driverId', ...adminOnly, controller.deleteInstitutionDriver);

// ── Passenger Management ──────────────────────────
router.get('/institution/:institutionId/passengers', controller.getInstitutionPassengers);
router.post('/institution/:institutionId/passengers', ...adminOnly, controller.createInstitutionPassenger);
router.put('/institution/:institutionId/passengers/:passengerId', ...adminOnly, controller.updateInstitutionPassenger);
router.delete('/institution/:institutionId/passengers/:passengerId', ...adminOnly, controller.deleteInstitutionPassenger);

// ── Route Management ──────────────────────────────
router.get('/institution/:institutionId/routes', controller.getInstitutionRoutes);
router.post('/institution/:institutionId/routes', ...adminOnly, controller.addInstitutionRoute);

module.exports = router;
