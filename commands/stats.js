const Command = require("../base/Command.js");
const {
    version,
    EmbedBuilder,
    SlashCommandBuilder
} = require("discord.js");
const dayjs = require("dayjs");
const duration = require("dayjs/plugin/duration");
dayjs.extend(duration);

class Stats extends Command {
    constructor (client) {
        super(client, {
            name: "stats",
            description: "Gives some useful bot statistics.",
            category: "System",
            data: new SlashCommandBuilder()
                .setName("stats")
                .setDescription("Gives some useful bot statistics."),
            slashEnable: true,
            usage: "stats",
        });
    }

    createStatsEmbed () {
        const duration = dayjs.duration(this.client.uptime).format(" D [days], H [hrs], m [mins], s [secs]");
        return new EmbedBuilder()
            .setColor(0x00ff00)
            .setTitle("STATISTICS")
            .addFields([{name: "🤓", value: `• Mem Usage: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB\n• Uptime: ${duration}\n• Users: ${this.client.users.cache.size.toLocaleString()}\n• Servers: ${this.client.guilds.cache.size.toLocaleString()}\n• Channels: ${this.client.channels.cache.size.toLocaleString()}\n• Discord.js: v${version}\n• Node: ${process.version}`}]);
    }

    async run (message, args, level) { // eslint-disable-line no-unused-vars

        const embed = this.createStatsEmbed();
        message.channel.send({embeds: [embed]});
    }

    async interact (interaction) {
        const embed = this.createStatsEmbed();
        interaction.reply({embeds: [embed]});
    }
}

module.exports = Stats;
