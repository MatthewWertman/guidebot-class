const Command = require("../base/Command.js");

class Pfp extends Command {
    constructor (client) {
        super(client, {
            name: "pfp",
            description: "Sends a link of your avatar.",
            category:"Miscellaneous",
            usage: "pfp [member], where [member] is an optional mentioned member.",
            aliases: [],
            permLevel: "User"
        });
    }

    async run (message, args, level) { //eslint-disable-line no-unused-vars
        if (!message.mentions.users.size) return message.channel.send(`Your avatar: ${message.author.displayAvatarURL()}`);
        const avatarList = message.mentions.users.map(user => {
            return `${user.username}'s avatar: ${user.displayAvatarURL()}`;
        });
        message.channel.send(avatarList);
    }
}

module.exports = Pfp;
