const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const Command = require("../base/Command.js");

class Info extends Command {
    constructor (client) {
        super(client, {
            name: "info",
            description: "Shows some information about a mentioned user",
            category: "Miscellaneous",
            data: new SlashCommandBuilder()
                .setName("info")
                .setDescription("Shows some information about a mentioned user.")
                .addUserOption(option => option.setName("target").setDescription("User to get info on.").setRequired(true)),
            slashEnable: true,
            guildOnly: true,
            usage: "info @user",
            aliases: ["i", "user"],
            permLevel: "User"
        });
    }

    createUserEmbed (user, member) {
        return new MessageEmbed()
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
                for (const index in [...member.roles.cache.keys()].name) {
                    role += `${[...member.roles.cache.keys()][index]}` + ", ";
                }
                return role;

            })}`, true);
    }

    async run (message, args, level) { //eslint-disable-line no-unused-vars
        if (!message.mentions.users.size) return message.channel.send(`You need to mention someone. ${exports.help.usage}`);
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
