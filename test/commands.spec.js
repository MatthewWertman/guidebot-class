/*eslint no-undef: 0 */ // -> OFF
const assert = require("assert");
const {promisify} = require("util");
const readdir = promisify(require("fs").readdir);
const {
    Client,
    Collection
} = require("discord.js");
const client = new Client({
    intents: []
});
require("../modules/functions.js")(client);

describe("Command", function () {
    describe("loadCommand()", function () {
        it("ensure all command files can be loaded", async function () {
            client.commands = new Collection();
            client.aliases = new Collection();

            const cmdFiles = await readdir("./commands/");
            cmdFiles.forEach(f => {
                const cmdName = f.split(".")[0];
                console.log(`${cmdName}`);
                const err = client.loadCommand(f);
                assert.equal(err, false);
            });

            client.destroy();
        });
    });
});
