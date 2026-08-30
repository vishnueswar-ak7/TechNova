const express = require('express');
const router = express.Router();
const { upload } = require('../middleware/upload');
const { analyzeScreenshot } = require('../controllers/analyzeController');

// POST /api/analyze
// Accepts: multipart/form-data with fields: image (file), language (string), mode (string)
router.post('/', upload.single('image'), analyzeScreenshot);

module.exports = router;
