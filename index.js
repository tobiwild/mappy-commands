'use strict';

var commandMap = require('require-all')(__dirname + '/lib/command');

var commands = {};

for (var file in commandMap) {
    for (var commandName in commandMap[file]) {
        commands[commandName] = commandMap[file][commandName];
    }
}

var commandInstances = {};

module.exports = {
    commands: commands,
    get: function(name) {
        if (! (name in commandInstances)) {
            commandInstances[name] = new commands[name]();
        }

        return commandInstances[name];
    }
};
