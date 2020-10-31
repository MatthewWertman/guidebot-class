module.exports = class {
    constructor (client) {
        this.client = client;
    }

    async run (guild) {

        this.client.user.setActivity(`${this.client.config.botSettings.prefix}help | ${this.client.guilds.cache.size} Servers`);
        console.log(`Left guild: ${guild.name} (${guild.id}) with ${guild.memberCount} members`);
    }
};
