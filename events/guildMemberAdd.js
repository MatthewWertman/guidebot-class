module.exports = class {
    constructor (client) {
        this.client = client;
    }

    async run (member) {
        if (this.client.config.botSettings.welcomeEnabled !== "true") return;
        const welcomeMessage = this.client.config.botSettings.welcomeMessage.replace("{{user}}", member.user.tag);

        member.guild.channels.cache.find(c => c.name === this.client.config.botSettings.welcomeChannel).send(welcomeMessage).catch(console.error);
    }
};
