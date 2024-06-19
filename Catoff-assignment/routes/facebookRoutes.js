const express = require('express');
const router = express.Router();
const facebookController = require('../controllers/facebookController');

router.post('/getFacebookData', facebookController.getFacebookData);
router.post('/handleFacebookProof', facebookController.handleFacebookProof);

module.exports = router;
