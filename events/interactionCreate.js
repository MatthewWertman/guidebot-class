module.exports = class {
    constructor (client) {
        this.client = client;
    }

    async run (interaction) {
        console.log(`${interaction.user.tag} in #${interaction.channel.name} triggered an interaction.`);
        if (!interaction.isCommand()) return;

        const command = this.client.commands.get(interaction.commandName);

        if (!command) return;

        try {
            await command.interact(interaction);
        } catch (err) {
            console.error(err);
            await interaction.reply({ content: "There was an error while executing this command!", ephemeral: true });
        }
    }
};
