const config = require("../config.js");
const pino = require("pino");
let transport = pino.transport({
    target: "pino-pretty",
    options: {
        levelFirst: true
    }
});
if (config.botSettings.saveLogs === "true") {
    const { access, constants } = require("fs");
    const mkdir = require("fs/promises").mkdir;
    access("./logs", constants.F_OK, (err) => {
        const isExists = err ? false : true;
        if (!isExists) {
            mkdir("./logs");
        }
    });
    transport = pino.transport({
        targets: [{
            target: "pino-pretty",
            options: {
                levelFirst: true
            }
        }, {
            level: "debug",
            target: "pino/file",
            options: {
                destination: `logs/debug-rollbot[${process.pid}].log`
            }
        }]
    });
}
const logger = pino({
    level: "debug"
}, transport);
const { red, magenta, gray, yellow, white, green } = require("colorette");
const dayjs = require("dayjs");

module.exports = class Logger {
    static log (content, type="log") {
        const timestamp = `[${dayjs().format("YYYY-MM-DD HH:mm:ss")}]`;
        switch (type) {
            case "log": {
                return logger.info(`${timestamp} ${gray(type.toUpperCase())} ${content} `);
            }
            case "warn": {
                return logger.warn(`${timestamp} ${yellow(type.toUpperCase())} ${content} `);
            }
            case "error": {
                return logger.error(`${timestamp} ${red(type.toUpperCase())} ${content} `);
            }
            case "debug": {
                return logger.debug(`${timestamp} ${magenta(type.toUpperCase())} ${content} `);
            }
            case "cmd": {
                return logger.info(`${timestamp} ${white(type.toUpperCase())} ${content}`);
            }
            case "ready": {
                return logger.info(`${timestamp} ${green(type.toUpperCase())} ${content}`);
            }
            default: throw new TypeError("Logger type must be either warn, debug, log, ready, cmd or error.");
        }
    }

    static error (content) {
        return this.log(content, "error");
    }

    static warn (content) {
        return this.log(content, "warn");
    }

    static debug (content) {
        return this.log(content, "debug");
    }

    static cmd (content) {
        return this.log(content, "cmd");
    }
};
