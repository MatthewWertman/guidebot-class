const { SlashCommandBuilder } = require("discord.js");
const Command = require("../base/Command.js");


class Pfp extends Command {
    constructor (client) {
        super(client, {
            name: "pfp",
            description: "Sends a link of your avatar.",
            slashBuilder: new SlashCommandBuilder()
                .setName("pfp")
                .setDescription("Sends a link of your or another user's avatar.")
                .addUserOption(option => option.setName("target").setDescription("Select a user")),
            slashEnable: true,
            usage: "pfp [member], where [member] is an mentioned guild member."
        });
    }

    async run (message, args, level) { //eslint-disable-line no-unused-vars
        if (!message.mentions.users.size) return message.channel.send(`Your avatar: ${message.author.displayAvatarURL()}`);
        const user = message.mentions.users.first();
        message.channel.send(`${user.username}'s avatar: ${user.displayAvatarURL()}`);
    }

    async interact (interaction) {
        const user = interaction.options.getUser("target");
        if (!user) return interaction.reply(`Your avatar: ${interaction.user.displayAvatarURL()}`);
        await interaction.reply(` ${user.username}'s avatar: ${user.displayAvatarURL()}`);
    }
}

module.exports = Pfp;
