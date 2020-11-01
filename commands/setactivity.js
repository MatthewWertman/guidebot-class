const Command = require("../base/Command.js");


class Setactivity extends Command {
    constructor (client) {
        super(client, {
            name: "setactivity",
            category: "Config",
            description: "sets what the bot is \"doing\"",
            usage: "setactivity <type> <url> <activity>. type is an optional parameter. 0 = 'PLAYING', 1 = 'STREAMING', 2 = 'LISTENING' and 3 = 'WATCHING'\n if option is STREAMING, then the <url> parameter is required.",
            aliases: ["setGame", "setAct", "sa", "game"],
            permLevel: "Bot Owner"
        });
    }

    async run (message, args, level) { //eslint-disable-line no-unused-vars
        if (!args[0]) return message.channel.send(`Please input a paramater. USAGE: ${exports.help.usage}`);
        var option = args[0];
        var result = args.join(" ");
        if (option.length >= 1 && isNaN(Number(option)) || args.length === 1 && !isNaN(Number(option))) {
            option = 0;
        } else {
            option = Number(args[0]);
            result = args.slice(1, args.length).join(" ");
            if (option === 1) {
                var url = args[1];
                result = args.slice(2, args.length).join(" ");
            } else {
                url = null;
            }
            if (!result) {
                result = null;
            }
        }
        this.client.user.setActivity(result, {
            type: option,
            url: url
        });
    }
}

module.exports = Setactivity;
