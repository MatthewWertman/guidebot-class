module.exports = class {
    constructor (client) {
        this.client = client;
    }
    
    async run (rateLimitData) {
        this.client.logger.log(`Client has reached rate limit of ${rateLimitData.limit}, timed out for ${rateLimitData.timeout} ms!`, "warn");
    }
};
