const { PermissionsBitField } = require("discord.js");

module.exports = class {
    constructor (client) {
        this.client = client;
    }

    async run (message) {
        if (message.author.bot) return;

        const foundGuild = this.client.guildConfs.find(guild => guild.id === message.guild.id);
        const prefix = foundGuild && foundGuild.guildSettings.prefix ? foundGuild.guildSettings.prefix : this.client.config.botSettings.prefix;
        const systemNotice = foundGuild && foundGuild.guildSettings.systemNotice ? foundGuild.guildSettings.systemNotice : this.client.config.botSettings.systemNotice;

        if (message.guild && !message.channel.permissionsFor(message.guild.members.me).missing(PermissionsBitField.Flags.SendMessages)) return;
        const prefixMention = new RegExp(`^<@!?${this.client.user.id}> ?$`);
        if (message.content.match(prefixMention)) {
            return message.reply(`My prefix on this guild is \`${prefix}\``);
        }

        if (message.content.indexOf(prefix) !== 0) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/g);
        const command = args.shift().toLowerCase();

        // If the member on a guild is invisible or not cached, fetch them.
        if (message.guild && !message.member) await message.guild.fetchMember(message.author);

        const level = this.client.permlevel(message);

        const cmd = this.client.commands.get(command) || this.client.commands.get(this.client.aliases.get(command));
        if (!cmd) return;

        // Some commands may not be useable in DMs. This check prevents those commands from running
        // and return a friendly error message.
        if (cmd && !message.guild && cmd.conf.guildOnly)
            return message.channel.send("This command is unavailable via private message. Please run this command in a guild.");

        if (level < this.client.levelCache[cmd.conf.permLevel]) {
            if (systemNotice === "true") {
                return message.channel.send(`You do not have permission to use this command.
Your permission level is ${level} (${this.client.config.permLevels.find(l => l.level === level).name})
This command requires level ${this.client.levelCache[cmd.conf.permLevel]} (${cmd.conf.permLevel})`);
            } else {
                return;
            }
        }

        // To simplify message arguments, the author's level is now put on level (not member, so it is supported in DMs)
        // The "level" command module argument will be deprecated in the future.
        message.author.permLevel = level;

        message.flags = [];
        while (args[0] && args[0][0] === "-") {
            message.flags.push(args.shift().slice(1));
        }

        this.client.logger.cmd(`${this.client.config.permLevels.find(l => l.level === level).name} ${message.author.username} (${message.author.id}) ran command ${cmd.help.name}`);
        cmd.run(message, args, level);
    }
};
