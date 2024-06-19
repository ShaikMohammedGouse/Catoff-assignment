const { ReclaimServiceResponse } = require('../utils/reclaimServiceResponse');

exports.processGoogleData = async (proof, providerName) => {
  const searchResults = JSON.parse(proof[0].claimData.context).extractedParameters.resultsCount;

  const url = JSON.parse(proof[0].claimData.parameters).url;
  const matchUrl = url.match(/search\/([^\/]+)/);
  const searchQuery = matchUrl ? matchUrl[1] : null;
  const lastUpdateTimeStamp = JSON.parse(proof[0].claimData.timestampS);

  return new ReclaimServiceResponse(
    providerName,
    lastUpdateTimeStamp,
    searchQuery,
    parseInt(searchResults, 10),
    proof[0]
  );
};
