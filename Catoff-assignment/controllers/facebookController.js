const { signWithProviderID } = require('../services/reclaimIntegrationService');
const { processFacebookData } = require('../services/facebookService');
const { ReclaimServiceResponse } = require('../utils/reclaimServiceResponse');

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
  const providerName = 'FACEBOOK_ANALYTICS'; // Change this as per your provider name

  try {
    let processedData;
    switch (providerName) {
      case 'FACEBOOK_ANALYTICS':
        processedData = await processFacebookData(proof, providerName);
        break;
      default:
        throw new Error(`No handler for provider: ${providerName}`);
    }

    console.log(`Processed data: ${JSON.stringify(processedData)}`);
    res.status(200).json(processedData);
  } catch (error) {
    console.error(`Failed to process Reclaim proof for userId: ${userId}`, error);
    res.status(500).json({ error: 'Failed to process Reclaim proof' });
  }
};
