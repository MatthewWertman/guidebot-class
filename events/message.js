module.exports = class {
    constructor (client) {
        this.client = client;
    }

    async run (message) {
        if (message.author.bot) return;

        // Cancel any attempt to execute commands if the bot cannot respond to the user.
        if (message.guild && !message.channel.permissionsFor(message.guild.me).missing("SEND_MESSAGES")) return;

        // Checks if the bot was mentioned, with no message after it, returns the prefix.
        const prefixMention = new RegExp(`^<@!?${this.client.user.id}> ?$`);
        if (message.content.match(prefixMention)) {
            return message.reply(`My prefix on this guild is \`${this.client.config.botSettings.prefix}\``);
        }

        // Also good practice to ignore any message that does not start with our prefix,
        // which is set in the configuration file.
        if (message.content.indexOf(this.client.config.botSettings.prefix) !== 0) return;

        const args = message.content.slice(this.client.config.botSettings.prefix.length).trim().split(/ +/g);
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
            if (this.client.config.botSettings.systemNotice === "true") {
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

        console.log(`${this.client.config.permLevels.find(l => l.level === level).name} ${message.author.username} (${message.author.id}) ran command ${cmd.help.name}`, "cmd");
        cmd.run(message, args, level);
    }
};
