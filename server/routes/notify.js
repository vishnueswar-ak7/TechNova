const express = require('express');
const router = express.Router();
const { sendNotification } = require('../controllers/notifyController');

// POST /api/notify
// Accepts: JSON { summary, contactEmail, contactPhone }
router.post('/', sendNotification);

module.exports = router;
