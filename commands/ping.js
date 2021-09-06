const Command = require("../base/Command.js");

class Ping extends Command {
    constructor (client) {
        super(client, {
            name: "ping",
            description: "Latency and API response times.",
            category: "System",
            usage: "ping",
            aliases: ["pong"]
        });
    }

    async run (message, args, level) { // eslint-disable-line no-unused-vars
        try {
            const msg = await message.channel.send("🏓 Ping!");
            msg.edit(`🏓 Pong! (Roundtrip took: ${msg.createdTimestamp - message.createdTimestamp}ms. 💙: ${Math.round(this.client.ws.ping)}ms.)`);
        } catch (e) {
            console.log(e);
        }
    }
}

module.exports = Ping;
