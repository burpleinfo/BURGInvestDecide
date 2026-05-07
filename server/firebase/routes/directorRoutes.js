// routes/directorRoutes.js

const express = require('express');
const router = express.Router();
const controller = require('../controllers/directorController');
const { directorOnly } = require('../middleware/authMiddleware');

router.get('/snapshot', ...directorOnly, controller.getDirectorSnapshot);
router.post('/admin-requests/:requestId/approve', ...directorOnly, controller.approveAdminRequest);

module.exports = router;
