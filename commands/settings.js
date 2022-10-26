const Command = require("../base/Command.js");
const {
    EmbedBuilder
} = require("discord.js");
const fs = require("fs");
let guildConf = fs.readFileSync("./guildconfs.json", "utf-8");


class Settings extends Command {
    constructor (client) {
        super(client, {
            name: "settings",
            category: "Config",
            description: "Shows the current bot guild settings and allows the user to change them.",
            usage: "settings\nThe bot will listen for following messages. KEYWORDS: 'apply', 'cancel/revert all', 'quit/exit'.\nType the setting name shown in the embed to select, then respond with the value.\nThe bot will restart after you apply the changes.",
            aliases: ["set", "config"],
            permLevel: "Server Owner"
        });
    }

    async run (message, args, level) { // eslint-disable-line no-unused-vars
        if (args.length > 0) return message.channel.send(`Too many agruments! USAGE: ${this.help.usage}`);

        const foundGuild = this.client.guildConfs.find(guild => guild.id === message.guild.id);
        const configEmbed = new EmbedBuilder()
            .setTitle("Current Settings")
            .setColor("#ff1511")
            .setDescription("Here are the current guild settings for the bot.");

        // Building embed
        for (const [key, val] of Object.entries(foundGuild.guildSettings)) {
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
            guildConf = fs.readFileSync("./guildconfs.json", "utf-8");
            const setting = await this.client.awaitReply(message, "What setting do you want to change? Or type 'quit' to quit.");

            switch (setting) {
                case "cancel":
                case "revert all":
                {
                    message.channel.send("Reverting config to session start...");
                    await this.client.wait(1000);
                    for (var f = 0; f < embedJSON.fields.length; f++) {
                        for (const val of Object.values(foundGuild.guildSettings)) {
                            if (typeof val == "object") {
                                for (const sVal of Object.values(val)) {
                                    if (embedJSON.fields[f].value !== sVal[f]) {
                                        defValue = guildConf.replace(new RegExp(`"${embedJSON.fields[f].value}"`), `"${sVal}"`);
                                        fs.writeFileSync("./guildconfs.json", defValue);
                                    }
                                }
                            } else {
                                if (embedJSON.fields[f].value !== val[f]) {
                                    defValue = guildConf.replace(new RegExp(`"${embedJSON.fields[f].value}"`), `"${val}"`);
                                    fs.writeFileSync("./guildconfs.json", defValue);
                                }
                            }
                        }
                    }
                    shouldExit = true;
                    break;
                }
                case "apply":
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
                case "quit":
                case "exit":
                    shouldExit = true;
                    message.channel.send("Exiting settings...");
                    break;
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
                            newValue = guildConf.replace(line, `"${embedJSON.fields[i].name}": "${value}"`);
                            fs.writeFileSync("./guildconfs.json", newValue);
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
