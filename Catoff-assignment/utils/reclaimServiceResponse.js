class ReclaimServiceResponse {
    constructor(providerName, lastUpdateTimeStamp, usernameOrId, data, proof) {
      this.providerName = providerName;
      this.lastUpdateTimeStamp = lastUpdateTimeStamp;
      this.usernameOrId = usernameOrId;
      this.data = data;
      this.proof = proof;
    }
  }
  
  module.exports = { ReclaimServiceResponse };
  