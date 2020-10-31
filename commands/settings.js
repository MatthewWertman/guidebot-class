const Command = require("../base/Command.js");
const {MessageEmbed} = require("discord.js");
const fs = require("fs");

var configFile = fs.readFileSync("./config.js", "utf-8");


class Settings extends Command {
    constructor (client) {
        super(client, {
            name: "settings",
            category: "Config",
            description: "Shows the default settings and allows you to change them.",
            usage: "settings [numberOfChanges]",
            aliases: ["set", "config"],
            permLevel: "Server Owner"
        });
    }

    async run (client, message, args) {
        const configEmbed = new MessageEmbed()
            .setTitle("Current Settings")
            .setColor("#d64027")
            .setDescription("There are the current settings for bot.")
            .addField("prefix", this.client.config.botSettings.prefix)
            .addField("systemNotice", this.client.config.botSettings.systemNotice)
            .addField("welcomeEnabled", this.client.config.botSettings.welcomeEnabled)
            .addField("welcomeChannel", this.client.config.botSettings.welcomeChannel)
            .addField("welcomeMessage", this.client.config.botSettings.welcomeMessage);

        message.channel.send(configEmbed);
        var configEmbedJSON = configEmbed.toJSON();
        var times = 0;
        var numOfChanges = Number(args[0]);
        let newValue;

        if (args.length > 1) {
            return message.channel.send(`Too many agruments! USAGE: ${exports.help.usage}`);
        } else if (!args[0] && args.length === 0) {
            numOfChanges = 1;
        }
        while (times < numOfChanges) {
            const setting = await client.awaitReply(message, "What setting do you want to change?");
            for (var i = 0; i < configEmbedJSON.fields.length; i++) {
                if (setting === configEmbedJSON.fields[i].name || setting === configEmbedJSON.fields[i].name.toLowerCase()) {
                    var value = await client.awaitReply(message, `What value should ${setting} be? NOTE: bot will restart afterwards`);
                    if (value === false) {
                        const retry = await client.awaitReply(message, "It seems that something went wrong or you took too long to respond. Do you want to retry? (y/n)");
                        if (retry === "y") {
                            value = await client.awaitReply(message, `What value should ${setting} be?`);
                            newValue = configFile.replace(new RegExp(`"${configEmbedJSON.fields[i].value}"`), `"${value}"`);
                            fs.writeFileSync("./config.js", newValue);
                            console.log("Updated config file");
                        } else {
                            return message.channel.send(`Alright. ${setting} set back to default.`);
                        }
                    } else {
                        newValue = configFile.replace(new RegExp(`"${configEmbedJSON.fields[i].value}"`), `"${value}"`);
                        fs.writeFileSync("./config.js", newValue);
                        console.log("Updated config file");
                    }
                }
            }
            times++;
        }
        client.commands.forEach(async cmd => {
            await client.unloadCommand(cmd);
        });
        process.exit(1);
    }
}

module.exports = Settings;
