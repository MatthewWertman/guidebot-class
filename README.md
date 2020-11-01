# DISCLAIMER
While some newer features are kept intact, A LOT of the base code has been changed. Please use the updated boilerplate from the Idiot's guide community as this is a considerably stripped down version. The modified boilerplate is essentially an recreation of an older version that I am more used to. This is not a replacement for the current boilerplate as it is mainly used for my personal projects. This will rarely be updated.

## boilerplate-class.js

A modified discord bot boilerplate. Forked from [An Idiot's Guide's guidebot-class repo](https://github.com/AnIdiotsGuide/guidebot-class)

### Changelog

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
