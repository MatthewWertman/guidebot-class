const Command = require("../base/Command.js");
const { SlashCommandBuilder } = require("discord.js");

class Ping extends Command {
    constructor (client) {
        super(client, {
            name: "ping",
            description: "Latency and API response times.",
            category: "System",
            slashBuilder: new SlashCommandBuilder()
                .setName("ping")
                .setDescription("Latency and API response times."),
            slashEnable: true,
            usage: "ping",
            aliases: ["pong"]
        });
    }

    async run (message, args, level) { // eslint-disable-line no-unused-vars
        try {
            const msg = await message.channel.send("🏓 Ping!");
            msg.edit(`🏓 Pong! (Roundtrip took: ${msg.createdTimestamp - message.createdTimestamp}ms. 💙: ${Math.round(this.client.ws.ping)}ms.)`);
        } catch (err) {
            this.client.logger.error(err);
        }
    }

    async interact (interaction) {
        try {
            const initReply = await interaction.reply({content: "🏓 Ping!", fetchReply: true});
            await interaction.editReply(`🏓 Pong! (Roundtrip took: ${initReply.createdTimestamp - interaction.createdTimestamp}ms. 💙: ${Math.round(interaction.client.ws.ping)}ms.)`);
        } catch (err) {
            this.client.logger.error(err);
        }
    }
}

module.exports = Ping;
