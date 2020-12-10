const Discord = require("discord.js");
const client = new Discord.Client();
const {promisify} = require("util");
const readdir = promisify(require("fs").readdir);

describe("Testing events files...", () => {
    it("loads existing event files", function () {

        readdir("./events/", (err, files) => {
            if (err) console.error(err);
            files.forEach(f => {
                const eventName = f.split(".")[0];
                console.log(`Loading Event: ${eventName}`);
                const event = new(require(`../events/${f}`))(client);
                client.on(eventName, (...args) => event.run(...args));
                delete require.cache[require.resolve(`../events/${f}`)];
            });
        });

        client.destroy();
    });
});
