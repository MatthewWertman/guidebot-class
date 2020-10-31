const {MessageEmbed} = require("discord.js");
const Command = require("../base/Command.js");


class Help extends Command {
    constructor (client) {
        super(client, {
            name: "help",
            description: "Displays all the available commands for you.",
            category: "System",
            usage: "help [command]",
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
            const commandNames = myCommands.keyArray();
            const longest = commandNames.reduce((long, str) => Math.max(long, str.length), 0);
            let currentCategory = "";
            embed = new MessageEmbed()
                .setColor(0xff0000)
                .setTitle(`= Command List =\n\n[Use ${this.client.config.defaultSettings.prefix}help <commandname> for details]\n`);
            const sorted = myCommands.array().sort((p, c) => p.help.category > c.help.category ? 1 :  p.help.name > c.help.name && p.help.category === c.help.category ? 1 : -1 );
            sorted.forEach( c => {
                const cat = c.help.category.toProperCase();
                if (currentCategory !== cat) {
                    embed.addField(`\u200b\n== ${cat} ==\n`, "\u200b");
                    currentCategory = cat;
                }
                embed.addField(`${this.client.config.defaultSettings.prefix}${c.help.name}${" ".repeat(longest - c.help.name.length)} :: ${c.help.description}\n`);
            });
            message.author.send(embed);
        } else {
            // Show individual command's help.
            let command = args[0];
            if (this.client.commands.has(command)) {
                command = this.client.commands.get(command);
                if (level < this.client.levelCache[command.conf.permLevel]) return;
                embed = new MessageEmbed()
                    .setColor(0xff0000)
                    .setTitle(`${command.help.name.toUpperCase()}`)
                    .addField(`${command.help.description}`, `alises: ${command.conf.aliases.join(", ")}\nusage: ${command.help.usage}`);
                message.channel.send(embed);
            }
        }
    }
}

module.exports = Help;
