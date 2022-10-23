const Command = require("../base/Command.js");
const { EmbedBuilder } = require("discord.js");
const fs = require("fs");
let configFile = fs.readFileSync("./config.js", "utf-8");


class Settings extends Command {
    constructor (client) {
        super(client, {
            name: "settings",
            category: "Config",
            description: "Shows the default settings and allows you to change them.",
            usage: "settings",
            aliases: ["set", "config"],
            permLevel: "Bot Admin"
        });
    }

    async run (message, args, level) { // eslint-disable-line no-unused-vars
        if (args.length > 0) return message.channel.send(`Too many agruments! USAGE: ${this.help.usage}`);

        const configEmbed = new EmbedBuilder()
            .setTitle("Current Settings")
            .setColor("#ff1511")
            .setDescription("Here are the current settings for the bot.");

        // Building embed
        for (const [key, val] of Object.entries(this.client.config.botSettings)) {
            if (typeof val == "object") {
                configEmbed.addFields([{ name: `== ${key.toProperCase()} ==`, value: "\u200b"}]);
                for (const [sKey, sVal] of Object.entries(val)) {
                    configEmbed.addFields([{name: `${sKey}`, value: `${sVal}`}]);
                }
            } else {
                configEmbed.addFields([{name: `${key}`, value: `${val}`}]);
            }
        }
        var embedJSON = configEmbed.toJSON();
        message.channel.send({embeds: [configEmbed]});

        let newValue;
        let defValue;
        let shouldExit = false;
        while (!shouldExit) {
            configFile = fs.readFileSync("./config.js", "utf-8");
            const setting = await this.client.awaitReply(message, "What setting do you want to change?");
            // console.log(setting);

            switch (setting) {
                case "cancel":
                case "revert all":
                {
                    message.channel.send("Reverting config to session start...");
                    await this.client.wait(1000);
                    for (var f = 0; f < embedJSON.fields.length; f++) {
                        for (const val of Object.values(this.client.config.botSettings)) {
                            if (typeof val == "object") {
                                for (const sVal of Object.values(val)) {
                                    if (embedJSON.fields[f].value !== sVal[f]) {
                                        defValue = configFile.replace(new RegExp(`"${embedJSON.fields[f].value}"`), `"${sVal}"`);
                                        fs.writeFileSync("./config.js", defValue);
                                    }
                                }
                            } else {
                                if (embedJSON.fields[f].value !== val[f]) {
                                    defValue = configFile.replace(new RegExp(`"${embedJSON.fields[f].value}"`), `"${val}"`);
                                    fs.writeFileSync("./config.js", defValue);
                                }
                            }
                        }
                    }
                    shouldExit = true;
                    break;
                }
                case "restart":
                case "quit":
                {
                    message.channel.send("Restarting bot...");
                    await this.client.wait(1000);
                    this.client.commands.forEach(async cmd => {
                        await this.client.unloadCommand(cmd);
                    });
                    process.exit(1);
                    shouldExit = true;
                    break;
                }
                default:
                {
                    for (var i = 0; i < embedJSON.fields.length; i++) {
                        if (setting === embedJSON.fields[i].name || setting === embedJSON.fields[i].name.toLowerCase()) {
                            var value = await this.client.awaitReply(message, `What value should ${setting} be?`);
                            if (typeof value != "string") {
                                message.channel.send("Timeout or something else occurred. Exiting...");
                                shouldExit = true;
                                break;
                            }
                            const line = `"${embedJSON.fields[i].name}": "${embedJSON.fields[i].value}"`;
                            newValue = configFile.replace(line, `"${setting}": "${value}"`);
                            fs.writeFileSync("./config.js", newValue);
                            this.client.logger.log(`${message.author.username} (${message.author.id}) wrote new changes to config file!`);
                            message.channel.send(`Updated ${setting} to new value ${value}.`);
                        }
                    }
                }
            }
        }
    }
}

module.exports = Settings;
