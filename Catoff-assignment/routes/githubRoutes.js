const express = require('express');
const router = express.Router();
const githubController = require('../controllers/githubController');

router.post('/getGitHubData', githubController.getGitHubData);
router.post('/handleGitHubProof', githubController.handleGitHubProof);

module.exports = router;
