class Command {

    constructor (client, {
        name = null,
        description = "No description provided.",
        category = "Miscellaneous",
        enabled = true,
        slashBuilder = null,
        slashEnable = false,
        guildOnly = false,
        usage = "No usage provided.",
        aliases = new Array(),
        permLevel = "User"
    }) {
        this.client = client;
        this.slashBuilder = slashBuilder;
        this.conf = { enabled, slashEnable, guildOnly, aliases, permLevel };
        this.help = { name, description, category, usage };
    }
}
module.exports = Command;
