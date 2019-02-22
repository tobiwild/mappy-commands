'use strict';

var commandMap = require('require-all')(__dirname + '/lib/command'),
    config = require('./config.json');

var commands = {};

for (var file in commandMap) {
    for (var commandName in commandMap[file]) {
        commands[commandName] = commandMap[file][commandName];
    }
}

var MappyCommands = function(commands) {
    this.commands = commands;
    this.instances = {};
};

MappyCommands.prototype.get = function(name) {
    if (! (name in this.instances)) {
        if (name in config) {
            this.instances[name] = new this.commands[name](config[name]);
        } else {
            this.instances[name] = new this.commands[name]();
        }
    }

    return this.instances[name];
};

MappyCommands.prototype.runSerial = function(command, params) {
    params.command = this.get(command);

    this.get('RunSerialCommand').run(params);
};

MappyCommands.prototype.say = function(text) {
    this.runSerial('TextToSpeechCommand', {
        text: text
    });
};

MappyCommands.prototype.play = function(file) {
    this.runSerial('PlayAudioFileCommand', {
        file: file
    });
};

module.exports = new MappyCommands(commands);
