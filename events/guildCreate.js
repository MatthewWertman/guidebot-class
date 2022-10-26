const fs = require("fs");

const GUILD_DEFAULTS = {
    "prefix": "~",
    "systemNotice": "true",
    "welcomeEnabled": "false",
    "welcomeChannel": "welcome",
    "welcomeMessage": "Say hello to {{user}}, everyone!"
};

const Guild = function (id, settings) {
    return {"id": id, guildSettings: settings};
};

module.exports = class {
    constructor (client) {
        this.client = client;
    }

    async run (guild) {
        this.client.user.setActivity(`${this.client.config.botSettings.prefix}help | ${this.client.guilds.cache.size} Servers`);
        this.client.logger.log(`New guild has been joined: ${guild.name} (${guild.id}) with ${guild.memberCount - 1} members`);
        const newGuild = new Guild(`${guild.id}`, GUILD_DEFAULTS);
        this.client.guildConfs.guilds.push(newGuild);
        fs.writeFileSync("./guildconfs.json", JSON.stringify(this.client.guildConfs));
    }
};
