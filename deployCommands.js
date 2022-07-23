const { REST } = require("@discordjs/rest");
const {
    Client,
    Routes,
    GatewayIntentBits 
} = require("discord.js");
const fs = require("fs");

class commandRegister extends Client {
    constructor (options) {
        super(options);

        this.config = require("./config.js");
        this.commands = [];
    }
}

const client = new commandRegister({
    intents: [GatewayIntentBits.Guilds]
});

const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
    const command = new (require(`./commands/${file}`))(client);
    if (command.conf.slashEnable) {
        client.commands.push(command.data.toJSON());
    }
}

const rest = new REST({ version: "10" }).setToken(client.config.token);

(async () => {
    try {
        console.log("Started refreshing application (/) commands.");
        await rest.put(
            Routes.applicationGuildCommands(client.config.botSettings.clientId, client.config.botSettings.defaultGuildId),
            { body: client.commands },
        );

        console.log("Successfully registered application commands.");
    } catch (error) {
        console.error(error);
    }
})();
