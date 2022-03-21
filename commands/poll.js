const { MessageEmbed } = require("discord.js");
const Command = require("../base/Command.js");

class Poll extends Command {
    constructor (client) {
        super(client, {
            name: "poll",
            description: "Creates a yes-no poll for people to vote on",
            usage: "poll <question>",
            guildOnly: true,
            permLevel: "Server Owner"
        });
    }

    async run (message, args, level) { //eslint-disable-line no-unused-vars
        if (!args[0]) return message.channel.send(`USAGE: ${this.help.usage}`);
        const channel = message.member.guild.channels.cache.find(ch => ch.name === "announcements");
        if (!channel) return;
        const embed = new MessageEmbed()
            .setColor(0xff0000)
            .setDescription("React with ✅ to vote yes\nReact with ❌ to vote no")
            .setFooter("React to vote", `${message.author.displayAvatarURL()}`)
            .setTitle(`${args.join(" ")}`);

        const msg = await channel.send({embeds: [embed]});
        await msg.react("✅");
        await msg.react("❌");

        // Delete original message
    }
}

module.exports = Poll;
