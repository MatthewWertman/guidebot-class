const Command = require("../base/Command.js");
const { SlashCommandBuilder } = require("discord.js");

class MyLevel extends Command {
    constructor (client) {
        super(client, {
            name: "mylevel",
            description: "Displays your permission level for your location.",
            slashBuilder: new SlashCommandBuilder()
                .setName("mylevel")
                .setDescription("Displays your permission level for your location."),
            slashEnable: true,
            guildOnly: true,
            usage: "mylevel"
        });
    }

    async run (message, args, level) {
        const friendly = this.client.config.permLevels.find(l => l.level === level).name;
        message.reply(`Your permission level is: ${level} - ${friendly}`);
    }

    async interact (interaction) {
        const level = this.client.permlevel(interaction);
        const lvlName = this.client.config.permLevels.find(l => l.level === level).name;
        interaction.reply(`Your permission level is: ${level} - ${lvlName}`);
    }
}

module.exports = MyLevel;
