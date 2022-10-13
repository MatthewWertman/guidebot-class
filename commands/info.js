const {
    EmbedBuilder,
    SlashCommandBuilder
} = require("discord.js");
const Command = require("../base/Command.js");

class Info extends Command {
    constructor (client) {
        super(client, {
            name: "info",
            description: "Shows some information about a mentioned user",
            slashBuilder: new SlashCommandBuilder()
                .setName("info")
                .setDescription("Shows some information about a mentioned user.")
                .addUserOption(option => option.setName("target").setDescription("User to get info on.").setRequired(true)),
            slashEnable: true,
            guildOnly: true,
            usage: "info @user",
            aliases: ["i", "user"]
        });
    }

    createUserEmbed (user, member) {
        return new EmbedBuilder()
            .setColor("#9689b9")
            .setAuthor({name:`${user.tag}`, iconURL: `${user.displayAvatarURL()}`})
            .addFields([
                {name: "Username", value: `${user.username}`, inline: true},
                {name: "Discriminator", value: `${user.discriminator}`, inline: true},
                {name: "Display Name", value: `${member.displayName}`, inline: true},
                {name: "ID", value: `${user.id}`, inline: true},
                {name: "Bot", value: `${user.bot}`, inline: true},
                {name: "Created", value: `${user.createdAt}`, inline: true},
                {name: "Account Age", value: `${Math.round((Date.now() - user.createdAt.getTime()) / (1000*60*60*24))} days`, inline: true},
                {name: "Server Age", value: `${Math.round((Date.now() - member.joinedAt.getTime()) / (1000*60*60*24))} days`, inline: true},
                {name: "Roles", value: `${member.roles.cache.map(role => {
                    for (const index in [...member.roles.cache.keys()].name) {
                        role += `${[...member.roles.cache.keys()][index]}` + ", ";
                    }
                    return role;

                })}`, inline: true}
            ]);
    }

    async run (message, args, level) { //eslint-disable-line no-unused-vars
        if (!message.mentions.users.size) return message.channel.send(`You need to mention someone. USAGE: ${this.help.usage}`);
        const user = message.mentions.users.first();
        const member = message.guild.members.cache.get(user.id);
        const userEmbed = this.createUserEmbed(user, member);
        message.channel.send({embeds: [userEmbed]});
    }

    async interact (interaction) {
        const user = interaction.options.getUser("target");
        const member = interaction.guild.members.cache.get(user.id);
        const userEmbed = this.createUserEmbed(user, member);
        interaction.reply({embeds: [userEmbed]});
    }
}

module.exports = Info;
