module.exports = class {
    constructor (client) {
        this.client = client;
    }
    
    async run (oldGuild, newGuild) {
        this.client.logger.log(`${oldGuild.name}(${oldGuild.id}) has been updated.`);
        if (oldGuild.owner.id !== newGuild.owner.id) {
            const newOwnerObj = newGuild.fetchOwner();
            this.client.logger.log(`${oldGuild.name}(${oldGuild.id}) has changed owners to ${newOwnerObj.name}(${newOwnerObj.id}).`);
        }
        if (oldGuild.name !== newGuild.name) {
            this.client.logger.log(`${oldGuild.name} has been renamed to "${newGuild.name}".`);
        }
    }
};
