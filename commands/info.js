const {MessageEmbed} = require("discord.js");
const Command = require("../base/Command.js");

class Info extends Command {
    constructor (client) {
        super(client, {
            name: "info",
            description: "Shows some information about a mentioned user",
            category: "Miscellaneous",
            usage: "info @user",
            guildOnly: true,
            aliases: ["i", "user"],
            permLevel: "User"
        });
    }

    async run (message, args, level) { //eslint-disable-line no-unused-vars
        if (!message.mentions.users.size) return message.channel.send(`You need to mention someone. ${exports.help.usage}`);
        var member = message.guild.member(message.mentions.users.first());
        message.mentions.users.map(user => {
            var userEmbed = new MessageEmbed()
                .setColor("#9689b9")
                .setAuthor(`${user.tag}`, `${user.displayAvatarURL()}`)
                .addField("Username", `${user.username}`, true)
                .addField("Discriminator", `${user.discriminator}`, true)
                .addField("Display Name", `${member.displayName}`, true)
                .addField("ID", `${user.id}`, true)
                .addField("Bot", `${user.bot}`, true)
                .addField("Created", `${user.createdAt}`, true)
                .addField("Account Age", `${Math.round((Date.now() - user.createdAt.getTime()) / (1000*60*60*24))} days`, true)
                .addField("Server Age", `${Math.round((Date.now() - member.joinedAt.getTime()) / (1000*60*60*24))} days`, true)
                .addField("Roles", `${member.roles.cache.map(role => {
                    for (const index in member.roles.cache.keyArray().name) {
                        role += `${member.roles.cache.keyArray()[index]}` + ", ";
                    }
                    return role;

                })}`, true);

            return message.channel.send(userEmbed);
        });
    }
}

module.exports = Info;
