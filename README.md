# DISCLAIMER
While some newer features are kept intact, A LOT of the base code has been changed. Please use the updated boilerplate from the Idiot's guide community as this is a considerably stripped down version. The modified boilerplate is essentially an recreation of an older version that I am more used to. This is not a replacement for the current boilerplate as it is mainly used for my personal projects. This will rarely be updated.

## boilerplate-class.js

A modified discord bot boilerplate. Forked from [An Idiot's Guide's guidebot-class repo](https://github.com/AnIdiotsGuide/guidebot-class)

### Changelog

NOTE: make sure to check the releases for an updated changelog

Major Changes:

* Updated to Discord.js 12.4.1
* Removed `better-sqlite3`, `chalk`, `enmap`, `klaw`, `readline-sync` as dependencies
* Moved functions to modules/functions.js
* Removed Logger module (replaced with console.log())
* Removed conf and set command files
* Removed 'setup.js' and npm preinstall script
* Added `setactivity`, `setstatus`, `info`, `pfp`, `settings` and `echo` commands


Minor Changes:

* Removed perm levels 2 and 3 from config example
* Changed intents to 4 spaces
* Removed most comments

### Prerequisites
* [Node.js v12](https://nodejs.org/en/download/) or higher

### Installation

Git:

Run the following commands:

```bash
$ git clone https://github.com/MatthewWertman/guidebot-class.git
$ cd guidebot-class
$ npm install --save
```

Non-Git:

- Download the latest release from the [Releases](https://github.com/MatthewWertman/guidebot-class/releases) and extract to desired location
- Follow the steps from the Git Section, starting at `npm install --save`. Make sure you are in the right directory!


### Initial Setup

1. Rename 'config.js.example' to 'config.js' by running this in the termial:
```bash
$ mv config.js.example config.js
```
2. Add personal Discord ID and bot token to the config.js file. For more details on how to obtain a bot token, click [here](https://github.com/reactiflux/discord-irc/wiki/Creating-a-discord-bot-&-getting-a-token).

3. To finalize the necessary settings, you can either run: !settings or edit in the config.js file directly.

### Running the bot

You can either run:
```bash
$ node index.js
```
or
```bash
$ npm start
```
