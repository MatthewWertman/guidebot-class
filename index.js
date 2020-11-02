if (Number(process.version.slice(1).split(".")[0]) < 12) throw new Error("Node 12.0.0 or higher is required. Update Node on your system.");

const {
    Client,
    Collection
} = require("discord.js");
const {
    promisify
} = require("util");
const readdir = promisify(require("fs").readdir);
const moment = require("moment");
const log = message => {
    console.log(`[${moment().format("YYYY-MM-DD HH:mm:ss")}] ${message}`);
};


class BoilerPlate extends Client {
    constructor (options) {
        super(options);

        this.config = require("./config.js");

        this.commands = new Collection();
        this.aliases = new Collection();

        this.wait = require("util").promisify(setTimeout);
    }
}

const intents = ["GUILDS", "GUILD_MESSAGES", "DIRECT_MESSAGES"];
const client = new BoilerPlate({
    ws: {
        intents: intents
    }
});

// functions
require("./modules/functions.js")(client);

const init = async () => {

    // Commands
    const cmdFiles = await readdir("./commands/");
    log(`Loading a total of ${cmdFiles.length} commands.`);
    cmdFiles.forEach(f => {
        const res = client.loadCommand(f);
        if (res) console.error(res);
    });

    // Events
    const evtFiles = await readdir("./events/");
    log(`Loading a total of ${evtFiles.length} events.`);
    evtFiles.forEach(file => {
        const eventName = file.split(".")[0];
        console.log(`Loading Event: ${eventName}`);
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

client.on("disconnect", () => console.warn("Bot is disconnecting..."))
    .on("reconnecting", () => console.log("Bot reconnecting..."))
    .on("error", e => console.error(e))
    .on("warn", info => console.warn(info));
