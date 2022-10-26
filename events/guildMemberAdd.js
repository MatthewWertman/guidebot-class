module.exports = class {
    constructor (client) {
        this.client = client;
    }

    async run (member) {
        const foundGuild = this.client.guildConfs.find(guild => guild.id === member.guild.id);
        
        if (foundGuild.guildSettings.welcomeEnabled !== "true") return;
        const welcomeMessage = foundGuild.guildSettings.welcomeMessage.replace("{{user}}", member.user.tag);

        member.guild.channels.cache.find(c => c.name === foundGuild.guildSettings.welcomeChannel).send(welcomeMessage).catch(console.error);
    }
};
