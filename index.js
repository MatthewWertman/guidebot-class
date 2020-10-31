if (Number(process.version.slice(1).split(".")[0]) < 12) throw new Error("Node 12.0.0 or higher is required. Update Node on your system.");

const {
    Client,
    Collection
} = require("discord.js");
const {
    promisify
} = require("util");
const readdir = promisify(require("fs").readdir);


class GuideBot extends Client {
    constructor (options) {
        super(options);

        this.config = require("./config.js");

        this.commands = new Collection();
        this.aliases = new Collection();

        this.wait = require("util").promisify(setTimeout);
    }
}

const intents = ["GUILDS", "GUILD_MESSAGES", "DIRECT_MESSAGES"];
const client = new GuideBot({
    ws: {
        intents: intents
    }
});

// functions
require("./modules/functions.js")(client);

const init = async () => {

    // Here we load **commands** into memory, as a collection, so they're accessible
    // here and everywhere else.
    // klaw("./commands").on("data", (item) => {
    //   const cmdFile = path.parse(item.path);
    //   if (!cmdFile.ext || cmdFile.ext !== ".js") return;
    //   const response = client.loadCommand(cmdFile.dir, `${cmdFile.name}${cmdFile.ext}`);
    //   if (response) client.logger.error(response);
    // });

    // Then we load events, which will include our message and ready event.
    const evtFiles = await readdir("./events/");
    client.logger.log(`Loading a total of ${evtFiles.length} events.`, "log");
    evtFiles.forEach(file => {
        const eventName = file.split(".")[0];
        client.logger.log(`Loading Event: ${eventName}`);
        const event = new(require(`./events/${file}`))(client);
        // This line is awesome by the way. Just sayin'.
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

client.on("disconnect", () => client.logger.warn("Bot is disconnecting..."))
    .on("reconnecting", () => client.logger.log("Bot reconnecting...", "log"))
    .on("error", e => client.logger.error(e))
    .on("warn", info => client.logger.warn(info));
