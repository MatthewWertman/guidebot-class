const Command = require("../base/Command.js");

class Rename extends Command {
    constructor (client) {
        super(client, {
            name: "rename",
            description: "Changes bot nickname",
            category: "Config",
            guildOnly: true,
            usage: "rename <nickname>|reset",
            aliases: ["name"],
            permLevel: "Server Owner"
        });
    }

    async run (message, args, level) { //eslint-disable-line no-unused-vars
        if (!args[0] && args.length === 0) return message.channel.send(`USAGE: ${this.help.usage}`);
        let name = await this.client.clean(args.join(" "));
        if (name.length > 32) name = name.substring(0, 32);
        switch (name) {
            case "reset":
                message.guild.members.me.setNickname(null);
                message.reply("Successfully reverted nickname!");
                this.client.logger.log(`${message.author.username} (${message.author.id}) removed nickname from bot.`);
                break;
            default:
                message.guild.members.me.setNickname(name);
                message.reply(`Successfully changed name to '${name}'`);
                this.client.logger.log(`${message.author.username} (${message.author.id}) renamed the bot to '${name}'.`);
        }
    }
}

module.exports = Rename;
