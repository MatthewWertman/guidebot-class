const {
    Client,
    Collection
} = require("discord.js");
const client = new Client({
    intents: []
})
const {promisify} = require("util");
const readdir = promisify(require("fs").readdir);
require("../modules/functions.js")(client);

describe("Testing command files...", () => {
    it("loads existing command files", function () {
        client.commands = new Collection();
        client.aliases = new Collection();

        readdir("./commands/", (err, files) => {
            if (err) console.error(err);
            files.forEach(f => {
                const res = client.loadCommand(f);
                if (res) console.error(res);
            });
        });

        client.destroy();
    });
});
