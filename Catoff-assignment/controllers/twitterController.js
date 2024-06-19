const { signWithProviderID } = require('../services/reclaimIntegrationService');
const { processTwitterData } = require('../services/twitterService');
const { ReclaimServiceResponse } = require('../utils/reclaimServiceResponse');

exports.getTwitterData = async (req, res) => {
  const { proof, userId, providerId } = req.body;

  try {
    const signedUrl = await signWithProviderID(userId, providerId);
    res.status(200).json({ signedUrl });
  } catch (error) {
    console.error('Error signing with Reclaim:', error);
    res.status(500).json({ error: 'Failed to sign with Reclaim' });
  }
};

exports.handleTwitterProof = async (req, res) => {
  const { proof, userId, providerId } = req.body;
  const providerName = 'TWITTER_ANALYTICS_VIEWS'; // Change this as per your provider name

  try {
    let processedData;
    switch (providerName) {
      case 'TWITTER_ANALYTICS_VIEWS':
        processedData = await processTwitterData(proof, providerName);
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
