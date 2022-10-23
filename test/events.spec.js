/*eslint no-undef: 0 */ // -> OFF
const assert = require("assert");
const {
    Client
} = require("discord.js");
const client = new Client({
    intents: []
});
const {promisify} = require("util");
const readdir = promisify(require("fs").readdir);

describe("Event", function () {
    describe("require(event)", function () {
        it("ensure all eventf files can be loaded", async function () {

            const evtFiles = await readdir("./events/");
            evtFiles.forEach(f => {
                const eventName = f.split(".")[0];
                console.log(`Loading Event: ${eventName}`);
                new(require(`../events/${f}`))(client);
                assert.ok(require.cache[require.resolve(`../events/${f}`)]);
            });

            client.destroy();
        });
    });
});
