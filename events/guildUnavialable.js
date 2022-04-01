module.exports = class {
    constructor (client) {
        this.client = client;
    }

    async run (guild) {
        this.client.logger.warn(`Unable to reach ${guild.name} (${guild.id}) with ${guild.memberCount} members!`);
    }
};
