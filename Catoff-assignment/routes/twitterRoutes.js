const express = require('express');
const router = express.Router();
const twitterController = require('../controllers/twitterController');

router.post('/getTwitterData', twitterController.getTwitterData);
router.post('/handleTwitterProof', twitterController.handleTwitterProof);

module.exports = router;
