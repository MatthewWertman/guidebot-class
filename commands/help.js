const {
    inlineCode,
    EmbedBuilder
} = require("discord.js");
const Command = require("../base/Command.js");


class Help extends Command {
    constructor (client) {
        super(client, {
            name: "help",
            description: "Displays all the available commands for you.",
            category: "System",
            usage: "help [command/alias]",
            aliases: ["h", "halp"]
        });
    }

    async run (message, args, level) {
        // Initialize help embed
        let embed;
        // If no specific command is called, show all filtered commands.
        if (!args[0]) {

            // Filter all commands by which are available for the user's level, using the <Collection>.filter() method.
            const myCommands = message.guild ? this.client.commands.filter(cmd => this.client.levelCache[cmd.conf.permLevel] <= level) : this.client.commands.filter(cmd => this.client.levelCache[cmd.conf.permLevel] <= level &&  cmd.conf.guildOnly !== true);

            // Here we have to get the command names only, and we use that array to get the longest name.
            // This make the help commands "aligned" in the output.
            const commandNames = [...myCommands.keys()];
            const longest = commandNames.reduce((long, str) => Math.max(long, str.length), 0);
            let currentCategory = "";
            embed = new EmbedBuilder()
                .setColor("#ff1511")
                .setTitle(`= Command List =\n\n[Use ${this.client.config.botSettings.prefix}help <commandname> for details]\n`);
            const sorted = [...myCommands.values()].sort((p, c) => p.help.category > c.help.category ? 1 :  p.help.name > c.help.name && p.help.category === c.help.category ? 1 : -1 );
            sorted.forEach( c => {
                const cat = c.help.category.toProperCase();
                if (currentCategory !== cat) {
                    embed.addFields([{name: `\u200b\n== ${cat} ==\n`, value: "\u200b"}]);
                    currentCategory = cat;
                }
                embed.addFields([{name: `${this.client.config.botSettings.prefix}${c.help.name}${" ".repeat(longest - c.help.name.length)}: ${c.help.description}\n`, value: "\u200b"}]);
            });
            message.author.send({embeds: [embed]});
        } else {
            // Show individual command's help.
            const command = this.client.commands.get(args[0]) || this.client.commands.get(this.client.aliases.get(args[0]));
            if (!command) return message.channel.send(`${args[0]} is not a known command or alias. USAGE: ${this.client.config.botSettings.prefix}${this.help.usage}`);
            if (level < this.client.levelCache[command.conf.permLevel]) return;
            embed = new EmbedBuilder()
                .setColor("#ff1511")
                .setTitle(`${command.help.name.toUpperCase()}`)
                .addFields([
                    {name: `${command.help.description}`, value: `aliases: ${command.conf.aliases.join(", ")}
                    usage: ${command.help.usage}
                    example: ${command.help.example ? inlineCode(`${this.client.config.botSettings.prefix}${command.help.example}`) : "None"}\
                    ${command.conf.guildOnly ? "\nguildOnly: true" : ""}`
                    }]);
            message.channel.send({embeds: [embed]});
        }
    }
}

module.exports = Help;
