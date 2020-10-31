const Command = require("../base/Command.js");
const {
    version,
    MessageEmbed
} = require("discord.js");
const moment = require("moment");
require("moment-duration-format");

class Stats extends Command {
    constructor (client) {
        super(client, {
            name: "stats",
            description: "Gives some useful bot statistics.",
            usage: "stats",
        });
    }

    async run (message, args, level) { // eslint-disable-line no-unused-vars
        const duration = moment.duration(this.client.uptime).format(" D [days], H [hrs], m [mins], s [secs]");
        const embed = new MessageEmbed()
            .setColor(0x00ff00)
            .setTitle("STATISTICS")
            .addField("🤓", `• Mem Usage: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB\n• Uptime: ${duration}\n• Users: ${this.client.users.cache.size.toLocaleString()}\n• Servers: ${this.client.guilds.cache.size.toLocaleString()}\n• Channels: ${this.client.channels.cache.size.toLocaleString()}\n• Discord.js: v${version}\n• Node: ${process.version}`);
        message.channel.send(embed);
    }
}

module.exports = Stats;
