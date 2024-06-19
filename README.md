# Catoff-assignment

Project Documentation
Overview
This project integrates Reclaim with GitHub, Twitter, Facebook, and Google, using Node.js, Express.js, and Axios. Each service handles the processing of Reclaim proofs and returns a ReclaimServiceResponse object. The controllers handle the routing and calling of the services based on the provider name. Routes define the endpoints for each service.

Project Structure

project/
│
├── controllers/
│   ├── githubController.js
│   ├── twitterController.js
│   ├── facebookController.js
│   └── googleController.js
│
├── services/
│   ├── githubService.js
│   ├── twitterService.js
│   ├── facebookService.js
│   ├── googleService.js
│   └── reclaimIntegrationService.js
│
├── utils/
│   ├── reclaimServiceResponse.js
│   └── constants.js
│
├── routes/
│   ├── githubRoutes.js
│   ├── twitterRoutes.js
│   ├── facebookRoutes.js
│   └── googleRoutes.js
│
├── index.js
└── package.json

Setup
Step 1: Create a New Node.js Project

mkdir project
cd project
npm init -y


Step 2: Install Dependencies

npm install express axios @reclaimprotocol/js-sdk


Step 3: Environment Variables
Create a .env file at the root of your project and add your Reclaim app secrets:

TWITTER_ANALYTICS_VIEWS_SECRET=your_twitter_secret
GITHUB_ACCOUNT_VERIFICATION_SECRET=your_github_secret
FACEBOOK_ANALYTICS_SECRET=your_facebook_secret
GOOGLE_ANALYTICS_SECRET=your_google_secret
RECLAIM_GITHUB_TOKEN=your_github_token


Step 4: Constants
Create a constants.js file in the utils directory to manage provider IDs and app IDs.

utils/constants.js:

module.exports = {
  RECLAIM_PROVIDER_ID: {
    1: 'TWITTER_ANALYTICS_VIEWS',
    2: 'GITHUB_ACCOUNT_VERIFICATION',
    3: 'FACEBOOK_ANALYTICS',
    4: 'GOOGLE_ANALYTICS',
    // Add more provider IDs as needed
  },
  RECLAIM_APP_ID: {
    'TWITTER_ANALYTICS_VIEWS': 'YOUR_TWITTER_APP_ID',
    'GITHUB_ACCOUNT_VERIFICATION': 'YOUR_GITHUB_APP_ID',
    'FACEBOOK_ANALYTICS': 'YOUR_FACEBOOK_APP_ID',
    'GOOGLE_ANALYTICS': 'YOUR_GOOGLE_APP_ID',
    // Update with your app IDs
  },
};

Step 4: Constants
Create a constants.js file in the utils directory to manage provider IDs and app IDs.

utils/constants.js:

module.exports = {
  RECLAIM_PROVIDER_ID: {
    1: 'TWITTER_ANALYTICS_VIEWS',
    2: 'GITHUB_ACCOUNT_VERIFICATION',
    3: 'FACEBOOK_ANALYTICS',
    4: 'GOOGLE_ANALYTICS',
    // Add more provider IDs as needed
  },
  RECLAIM_APP_ID: {
    'TWITTER_ANALYTICS_VIEWS': 'YOUR_TWITTER_APP_ID',
    'GITHUB_ACCOUNT_VERIFICATION': 'YOUR_GITHUB_APP_ID',
    'FACEBOOK_ANALYTICS': 'YOUR_FACEBOOK_APP_ID',
    'GOOGLE_ANALYTICS': 'YOUR_GOOGLE_APP_ID',
    // Update with your app IDs
  },
};

Services
Reclaim Integration Service
Handles Reclaim proof requests and sessions.

services/reclaimIntegrationService.js:

const axios = require('axios');
const { Reclaim } = require('@reclaimprotocol/js-sdk');
const { RECLAIM_PROVIDER_ID, RECLAIM_APP_ID } = require('../utils/constants');
const { processTwitterData } = require('./twitterService');
const { processGitHubData } = require('./githubService');
const { processFacebookData } = require('./facebookService');
const { processGoogleData } = require('./googleService');

exports.signWithProviderID = async (userId, providerId) => {
  const providerName = RECLAIM_PROVIDER_ID[providerId];
  const reclaimAppID = RECLAIM_APP_ID[providerName];
  const reclaimAppSecret = process.env[`${providerName}_SECRET`];

  console.log(
    `Sending signature request to Reclaim for userId: ${userId} with providerName: ${providerName}`
  );

  try {
    const reclaimClient = new Reclaim.ProofRequest(reclaimAppID);
    await reclaimClient.buildProofRequest(providerId);
    reclaimClient.setSignature(
      await reclaimClient.generateSignature(reclaimAppSecret)
    );
    const { requestUrl: signedUrl } =
      await reclaimClient.createVerificationRequest();

    await handleReclaimSession(userId, reclaimClient, providerName);
    return signedUrl;
  } catch (error) {
    console.error(
      `Failed to process Reclaim request for userId: ${userId}`,
      error
    );
    throw error;
  }
};

const handleReclaimSession = async (userId, reclaimClient, providerName) => {
  await reclaimClient.startSession({
    onSuccessCallback: async (proof) => {
      console.log(
        `Successful reclaim callback with proof: ${JSON.stringify(proof)}`
      );

      try {
        let processedData;
        switch (providerName) {
          case 'TWITTER_ANALYTICS_VIEWS':
            processedData = await processTwitterData(proof, providerName);
            break;
          case 'GITHUB_ACCOUNT_VERIFICATION':
            processedData = await processGitHubData(proof, providerName);
            break;
          case 'FACEBOOK_ANALYTICS':
            processedData = await processFacebookData(proof, providerName);
            break;
          case 'GOOGLE_ANALYTICS':
            processedData = await processGoogleData(proof, providerName);
            break;
          default:
            throw new Error(`No handler for

Facebook Service 
services/facebookService.js:

const { ReclaimServiceResponse } = require('../utils/reclaimServiceResponse');

exports.processFacebookData = async (proof, providerName) => {
  const postLikes = JSON.parse(proof[0].claimData.context).extractedParameters.likesCount;
  const postShares = JSON.parse(proof[0].claimData.context).extractedParameters.sharesCount;
  const postComments = JSON.parse(proof[0].claimData.context).extractedParameters.commentsCount;

  const postStats = {
    likes: parseInt(postLikes, 10),
    shares: parseInt(postShares, 10),
    comments: parseInt(postComments, 10),
  };

  const url = JSON.parse(proof[0].claimData.parameters).url;
  const matchUrl = url.match(/posts\/([^\/]+)/);
  const postId = matchUrl ? matchUrl[1] : null;
  const lastUpdateTimeStamp = JSON.parse(proof[0].claimData.timestampS);

  return new ReclaimServiceResponse(
    providerName,
    lastUpdateTimeStamp,
    postId,
    postStats,
    proof[0]
  );
};


Google Service
Handles processing of Google data.

services/googleService.js:

const { ReclaimServiceResponse } = require('../utils/reclaimServiceResponse');

exports.processGoogleData = async (proof, providerName) => {
  const analyticsData = JSON.parse(proof[0].claimData.context).extractedParameters.analyticsData;

  const views = parseInt(analyticsData.views, 10);
  const clicks = parseInt(analyticsData.clicks, 10);
  const impressions = parseInt(analyticsData.impressions, 10);

  const stats = {
    views,
    clicks,
    impressions,
  };

  const lastUpdateTimeStamp = JSON.parse(proof[0].claimData.timestampS);

  return new ReclaimServiceResponse(
    providerName,
    lastUpdateTimeStamp,
    'google_analytics',
    stats,
    proof[0]
  );
};


Facebook Controller
controllers/facebookController.js:

const { signWithProviderID } = require('../services/reclaimIntegrationService');
const { processFacebookData } = require('../services/facebookService');

exports.getFacebookData = async (req, res) => {
  const { proof, userId, providerId } = req.body;

  try {
    const signedUrl = await signWithProviderID(userId, providerId);
    res.status(200).json({ signedUrl });
  } catch (error) {
    console.error('Error signing with Reclaim:', error);
    res.status(500).json({ error: 'Failed to sign with Reclaim' });
  }
};

exports.handleFacebookProof = async (req, res) => {
  const { proof, userId, providerId } = req.body;
  const providerName = 'FACEBOOK_ANALYTICS';

  try {
    const processedData = await processFacebookData(proof, providerName);
    console.log(`Processed data: ${JSON.stringify(processedData)}`);
    res.status(200).json(processedData);
  } catch (error) {
    console.error(`Failed to process Reclaim proof for userId: ${userId}`, error);
    res.status(500).json({ error: 'Failed to process Reclaim proof' });
  }
};


Google Controller
controllers/googleController.js:

const { signWithProviderID } = require('../services/reclaimIntegrationService');
const { processGoogleData } = require('../services/googleService');

exports.getGoogleData = async (req, res) => {
  const { proof, userId, providerId } = req.body;

  try {
    const signedUrl = await signWithProviderID(userId, providerId);
    res.status(200).json({ signedUrl });
  } catch (error) {
    console.error('Error signing with Reclaim:', error);
    res.status(500).json({ error: 'Failed to sign with Reclaim' });
  }
};

exports.handleGoogleProof = async (req, res) => {
  const { proof, userId, providerId } = req.body;
  const providerName = 'GOOGLE_ANALYTICS';

  try {
    const processedData = await processGoogleData(proof, providerName);
    console.log(`Processed data: ${JSON.stringify(processedData)}`);
    res.status(200).json(processedData);
  } catch (error) {
    console.error(`Failed to process Reclaim proof for userId: ${userId}`, error);
    res.status(500).json({ error: 'Failed to process Reclaim proof' });
  }
};


Routes
Twitter Routes
routes/twitterRoutes.js:

const express = require('express');
const router = express.Router();
const twitterController = require('../controllers/twitterController');

router.post('/getTwitterData', twitterController.getTwitterData);
router.post('/handleTwitterProof', twitterController.handleTwitterProof);

module.exports = router;
GitHub Routes
routes/githubRoutes.js:

javascript
Copy code
const express = require('express');
const router = express.Router();
const githubController = require('../controllers/githubController');

router.post('/getGitHubData', githubController.getGitHubData);
router.post('/handleGitHubProof', githubController.handleGitHubProof);

module.exports = router;
Facebook Routes
routes/facebookRoutes.js:

javascript
Copy code
const express = require('express');
const router = express.Router();
const facebookController = require('../controllers/facebookController');

router.post('/getFacebookData', facebookController.getFacebookData);
router.post('/handleFacebookProof', facebookController.handleFacebookProof);

module.exports = router;
Google Routes
routes/googleRoutes.js:

javascript
Copy code
const express = require('express');
const router = express.Router();
const googleController = require('../controllers/googleController');

router.post('/getGoogleData', googleController.getGoogleData);
router.post('/handleGoogleProof', googleController.handleGoogleProof);

module.exports = router;
Main Application
index.js:

javascript
Copy code
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
require('dotenv').config();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
const githubRoutes = require('./routes/githubRoutes');
const twitterRoutes = require('./routes/twitterRoutes');
const facebookRoutes = require('./routes/facebookRoutes');
const googleRoutes = require('./routes/googleRoutes');

app.use('/github', githubRoutes);
app.use('/twitter', twitterRoutes);
app.use('/facebook', facebookRoutes);
app.use('/google', googleRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
Usage
Get Signed URL:

Send a POST request to the appropriate endpoint (/github/getGitHubData, /twitter/getTwitterData, /facebook/getFacebookData, /google/getGoogleData) with the userId, providerId, and proof in the request body.
Example request body:
json
Copy code
{
  "userId": "user123",
  "providerId": 1,
  "proof": {}
}
Handle Proof:

Send a POST request to the appropriate endpoint (/github/handleGitHubProof, /twitter/handleTwitterProof, /facebook/handleFacebookProof, /google/handleGoogleProof) with the userId, providerId, and proof in the request body.
Example request body:
json
Copy code
{
  "userId": "user123",
  "providerId": 1,
  "proof": {}
}
This documentation should help you set up and understand the functionality of your Reclaim integration project.
