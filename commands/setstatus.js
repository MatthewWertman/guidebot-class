const Command = require("../base/Command.js");


class Setstatus extends Command {
    constructor (client) {
        super(client, {
            name: "setstatus",
            category: "Config",
            description: "sets the bot's current state",
            usage: "setstatus <status>",
            aliases: ["setStat", "ss"],
            permLevel: "Bot Owner"
        });
    }

    async run (client, message, args, level) { //eslint-disable-line no-unused-vars
        if (!args[0] && args.length === 0) return message.channel.send(`USAGE: ${exports.help.usage}`);
        var result = args.join(" ");
        if (!result) {
            result = "online";
        }
        this.client.user.setStatus(result);
    }
}

module.exports = Setstatus;
