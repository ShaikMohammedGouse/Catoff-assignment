const express = require('express');
const router = express.Router();
const googleController = require('../controllers/googleController');

router.post('/getGoogleData', googleController.getGoogleData);
router.post('/handleGoogleProof', googleController.handleGoogleProof);

module.exports = router;
