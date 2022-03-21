const { MessageEmbed } = require("discord.js");
const Command = require("../base/Command.js");

class Poll extends Command {
    constructor (client) {
        super(client, {
            name: "poll",
            description: "Creates a yes-no poll for people to vote on",
            usage: "poll [image link] <question>",
            guildOnly: true,
            permLevel: "Server Owner"
        });
    }

    async run (message, args, level) { //eslint-disable-line no-unused-vars
        if (!args[0]) return message.channel.send(`USAGE: ${this.help.usage}`);
        let channel = message.member.guild.channels.cache.find(ch => ch.name === "announcements");
        if (!channel || !message.guild.members.cache.find(m => m.id === message.guild.me.id).permissionsIn(channel).has("SEND_MESSAGES")) channel = message.channel;
        let title = args.join(" ");
        let image;
        const linkCheck = /https?:\/\/.+\.(?:png|jpg|jpeg)/gi;
        if (args[0] && linkCheck.test(args[0])) {
            title = args.slice(1, args.length).join(" ");
            image = args[0];
        }
        const embed = new MessageEmbed()
            .setColor(0xff0000)
            .setDescription("React with ✅ to vote yes\nReact with ❌ to vote no")
            .setFooter({text: "React to vote", iconURL: `${message.author.displayAvatarURL()}`})
            .setTitle(`${title}`);
        if (image) {
            embed.setImage(args[0]);
        }

        const msg = await channel.send({embeds: [embed]});
        await msg.react("✅");
        await msg.react("❌");
    }
}

module.exports = Poll;
