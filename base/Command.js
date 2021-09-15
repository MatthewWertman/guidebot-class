class Command {

    constructor (client, {
        name = null,
        description = "No description provided.",
        category = "Miscellaneous",
        data = null,
        enabled = true,
        slashEnable = false,
        guildOnly = false,
        usage = "No usage provided.",
        aliases = new Array(),
        permLevel = "User"
    }) {
        this.client = client;
        this.data = data;
        this.conf = { enabled, slashEnable, guildOnly, aliases, permLevel };
        this.help = { name, description, category, usage };
    }
}
module.exports = Command;
