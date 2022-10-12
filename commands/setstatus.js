const Command = require("../base/Command.js");


class Setstatus extends Command {
    constructor (client) {
        super(client, {
            name: "setstatus",
            category: "Config",
            description: "sets the bot's current state",
            usage: "setstatus <online|idle|invisible|dnd>",
            aliases: ["setStat", "ss"],
            permLevel: "Bot Support"
        });
    }

    async run (message, args, level) { //eslint-disable-line no-unused-vars
        if (!args[0] && args.length === 0) return message.channel.send(`You need to supply a valid status. USAGE: ${this.help.usage}`);
        var result = args.join(" ");
        if (!result) {
            result = "online";
        }
        this.client.user.setStatus(result);
    }
}

module.exports = Setstatus;
