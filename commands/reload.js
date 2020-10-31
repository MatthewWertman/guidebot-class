const Command = require("../base/Command.js");

class Reload extends Command {
    constructor (client) {
        super(client, {
            name: "reload",
            description: "Reloads a command that has been modified.",
            category: "System",
            usage: "reload [command]",
            permLevel: "Bot Admin"
        });
    }

    async run (message, args, level) { // eslint-disable-line no-unused-vars
        let command;
        if (!args || args.size < 1) return message.reply("Must provide a command to reload.");
        if (this.client.commands.has(args[0])) {
            command = args[0];
        } else if (this.client.aliases.has(args[0])) {
            command = this.client.aliases.get(args[0]);
        }
        if (!command) {
            return message.channel.send(`I cannot find the command: ${args[0]}`);
        } else {
            message.channel.send(`Reloading ${command}`)
                .then(m => {
                    this.client.reload(command)
                        .then(() => {
                            m.edit(`Successfully reloaded: ${command}`);
                        })
                        .catch(e => {
                            m.edit(`Command reload failed: ${command}\n\`\`\`${e.stack}\`\`\``);
                        });
                });
        }
    }
}
module.exports = Reload;
