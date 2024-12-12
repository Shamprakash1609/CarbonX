const express = require('express');
const router = express.Router();
const emissionController = require('../controllers/emissionController');


router.post('/calculate', emissionController.calculate);
router.get('/emissions', emissionController.emissions);

module.exports = router;