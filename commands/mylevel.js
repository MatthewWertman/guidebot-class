const Command = require("../base/Command.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

class MyLevel extends Command {
    constructor (client) {
        super(client, {
            name: "mylevel",
            description: "Displays your permission level for your location.",
            data: new SlashCommandBuilder()
                .setName("mylevel")
                .setDescription("Displays your permission level for your location."),
            slashEnable: true,
            usage: "mylevel",
            guildOnly: true
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
