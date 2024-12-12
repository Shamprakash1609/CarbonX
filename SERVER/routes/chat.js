const express = require('express');
const router = express.Router();
const { getGeminiResponse } = require('../controllers/chatController');

router.post('/gemini', getGeminiResponse);

module.exports = router;

