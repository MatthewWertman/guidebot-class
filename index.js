const nVersionArr = process.version.slice(1).split(".").map((x) => +x);
if (nVersionArr[0] < 16 && nVersionArr[1] < 9) {
    throw new Error("Node 16.9.0 or higher is required. Update Node on your system.");
}

const {
    Client,
    Collection,
    GatewayIntentBits
} = require("discord.js");
const {
    promisify
} = require("util");
const readdir = promisify(require("fs").readdir);


class BoilerPlate extends Client {
    constructor (options) {
        super(options);

        this.config = require("./config.js");
        this.guildConfs = require("./guildconfs.json").guilds;
        
        this.commands = new Collection();
        this.slashCommands = [];
        this.aliases = new Collection();

        this.logger = require("./modules/logger.js");

        this.wait = require("util").promisify(setTimeout);
    }
}

const intents = [
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages
];
const client = new BoilerPlate({
    intents: intents
});

// functions
require("./modules/functions.js")(client);

const init = async () => {

    // Commands
    const cmdFiles = await readdir("./commands/");
    client.logger.log(`Loading a total of ${cmdFiles.length} commands.`);
    cmdFiles.forEach(f => {
        const res = client.loadCommand(f);
        if (res) client.logger.error(res);
    });

    // Slash commands
    if (client.config.botSettings.disableSlashes === "false") {
        for (const file of cmdFiles) {
            const cmdName = file.split(".")[0];
            const command = new (require(`./commands/${file}`))(client);
            if (command.conf.slashEnable) {
                client.logger.log(`Loading ${cmdName} as slash command.`);
                client.slashCommands.push(command.slashBuilder.toJSON());
            }
        }
    }

    // Events
    const evtFiles = await readdir("./events/");
    client.logger.log(`Loading a total of ${evtFiles.length} events.`);
    evtFiles.forEach(file => {
        const eventName = file.split(".")[0];
        client.logger.log(`Loading Event: ${eventName}`);
        const event = new(require(`./events/${file}`))(client);
        client.on(eventName, (...args) => event.run(...args));
        delete require.cache[require.resolve(`./events/${file}`)];
    });

    client.levelCache = {};
    for (let i = 0; i < client.config.permLevels.length; i++) {
        const thisLevel = client.config.permLevels[i];
        client.levelCache[thisLevel.name] = thisLevel.level;
    }

    client.login(client.config.token);

    // End top-level async/await function.
};

init();

// rateLimit event
client.rest.on("rateLimited", (rateLimitData) => {
    client.logger.warn(
        `Client has reached rate limit of ${rateLimitData.limit}, timed out for ${rateLimitData.timeToReset} ms!`
    );
});

client.on("disconnect", () => client.logger.warn("Bot is disconnecting..."))
    .on("reconnecting", () => client.logger.log("Bot reconnecting..."))
    .on("error", e => client.logger.error(e))
    .on("warn", info => client.logger.warn(info));
