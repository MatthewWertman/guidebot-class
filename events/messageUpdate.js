module.exports = class {
    constructor (client) {
        this.client = client;
    }
    async run (oldMessage, newMessage) {
        if (oldMessage.content === newMessage.content) return;

        const messageCreate = new(require("./messageCreate.js"))(this.client);
        // manually call messageCreate event.
        messageCreate.run(newMessage);
    }
}
