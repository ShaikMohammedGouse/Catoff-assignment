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
