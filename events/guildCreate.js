module.exports = class {
    constructor (client) {
        this.client = client;
    }

    async run (guild) {

        this.client.user.setActivity(`${this.client.config.botSettings.prefix}help | ${this.client.guilds.cache.size} Servers`);
        console.log(`New guild has been joined: ${guild.name} (${guild.id}) with ${guild.memberCount - 1} members`);
    }
};
