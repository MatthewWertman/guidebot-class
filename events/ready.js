const { REST, Routes } = require("discord.js");

module.exports = class {
    constructor (client) {
        this.client = client;
    }

    async run () {

        // Why await here? Because the ready event isn't actually ready, sometimes
        // guild information will come in *after* ready. 1s is plenty, generally,
        // for all of them to be loaded.
        await this.client.wait(1000);

        if (this.client.config.botSettings.updateGlobalSlashes === "true") {
            const rest = new REST({ version: "10" }).setToken(this.client.config.token);

            try {
                this.client.logger.log("Started refreshing application (/) commands.");
                await rest.put(
                    Routes.applicationCommands(this.client.user.id),
                    { body: this.client.slashCommands },
                );

                this.client.logger.log("Successfully registered application commands.");
            } catch (error) {
                this.client.logger.error(error);
            }
        } else {
            this.client.logger.warn("Skipping to refresh application (/) commands.");
        }


        // This loop ensures that client.appInfo always contains up to date data
        // about the app's status. This includes whether the bot is public or not,
        // its description, owner, etc. Used for the dashboard amongs other things.
        this.client.appInfo = await this.client.application.fetch();
        setInterval(async () => {
            this.client.appInfo = await this.client.application.fetch();
        }, 60000);

        // Set the game as the default help command + guild count.
        // NOTE: This is also set in the guildCreate and guildDelete events!
        this.client.user.setActivity(`${this.client.config.botSettings.prefix}help | ${this.client.guilds.cache.size} Servers`);

        // Log that we're ready to serve, so we know the bot accepts commands.
        this.client.logger.log(`${this.client.user.tag}, ready to serve ${this.client.users.cache.size} users in ${this.client.guilds.cache.size} servers.`, "ready");
    }
};
