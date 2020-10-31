module.exports = class {
    constructor (client) {
        this.client = client;
    }

    async run () {

        // Why await here? Because the ready event isn't actually ready, sometimes
        // guild information will come in *after* ready. 1s is plenty, generally,
        // for all of them to be loaded.
        await this.client.wait(1000);

        // This loop ensures that client.appInfo always contains up to date data
        // about the app's status. This includes whether the bot is public or not,
        // its description, owner, etc. Used for the dashboard amongs other things.
        this.client.appInfo = await this.client.fetchApplication();
        setInterval(async () => {
            this.client.appInfo = await this.client.fetchApplication();
        }, 60000);

        // Set the game as the default help command + guild count.
        // NOTE: This is also set in the guildCreate and guildDelete events!
        this.client.user.setActivity(`${this.client.config.botSettings.prefix}help | ${this.client.guilds.cache.size} Servers`);

        // Log that we're ready to serve, so we know the bot accepts commands.
        console.log(`${this.client.user.tag}, ready to serve ${this.client.users.cache.size} users in ${this.client.guilds.cache.size} servers.`, "ready");
    }
};
