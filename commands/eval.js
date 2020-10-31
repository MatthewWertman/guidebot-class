const Command = require("../base/Command.js");

class Eval extends Command {
    constructor (client) {
        super(client, {
            name: "eval",
            description: "Evaluates arbitrary Javascript.",
            category:"System",
            usage: "eval <expression>",
            aliases: ["ev"],
            permLevel: "Bot Owner"
        });
    }

    async run (message, args, level) { // eslint-disable-line no-unused-vars
        const code = args.join(" ");
        try {
            const evaled = eval(code);
            const clean = await this.client.clean(evaled);
            // sends evaled output as a file if it exceeds the maximum character limit
            // 6 graves, and 2 characters for "js"
            const MAX_CHARS = 3 + 2 + clean.length + 3;
            if (MAX_CHARS > 2000) {
                message.channel.send("Output exceeded 2000 characters. Sending as a file.", { files: [{ attachment: Buffer.from(clean), name: "output.txt" }] });
            }
            message.channel.send(`\`\`\`js\n${clean}\n\`\`\``);
        } catch (err) {
            message.channel.send(`\`ERROR\` \`\`\`xl\n${await this.client.clean(this.client, err)}\n\`\`\``);
        }
    }
}

module.exports = Eval;
