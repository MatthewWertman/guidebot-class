const Command = require("../base/Command.js");

class Echo extends Command {
    constructor (client) {
        super(client, {
            name: "echo",
            description: "Repeats what you say.",
            category: "Miscellaneous",
            usage: "echo [channel] <text>",
            aliases: ["ev"],
            permLevel: "User"
        });
    }

    async run (message, args, level) { //eslint-disable-line no-unused-vars
        if (!args && args.size < 1) return message.channel.send(`Please input text. USAGE: ${exports.help.usage}`);
        let channel;
        var text = args.slice(1, args.length).join(" ");

        if (!message.mentions.channels.size) {
            channel = message.guild.channels.cache.find(ch => ch.name === args[0]);
        } else if (message.mentions.channels.size > 1) {
            return message.channel.send("You may only mention one channel at a time");
        } else if (message.mentions.channels.size === 1) {
            channel = message.mentions.channels.first();
        }
        if (!channel) {
            message.channel.send("Sending message in current channel...")
                .then(msg => {
                    msg.edit(`${args.join(" ")}`);
                })
                .catch(console.error);
        } else {
            channel.send(text);
        }
    }
}

module.exports = Echo;
