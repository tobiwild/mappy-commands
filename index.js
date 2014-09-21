'use strict';

var commandMap = require('require-all')(__dirname + '/lib/command');

var commands = {};

for (var file in commandMap) {
    for (var commandName in commandMap[file]) {
        commands[commandName] = commandMap[file][commandName];
    }
}

var MappyCommands = function(commands) {
    this.commands = commands;
    this.commandInstances = {};
};

MappyCommands.prototype.get = function(name) {
    if (! (name in this.commandInstances)) {
        this.commandInstances[name] = new this.commands[name]();
    }

    return this.commandInstances[name];
};

MappyCommands.prototype.runSerial = function(command, params) {
    params.command = command;

    this.get('RunSerialCommand').run(params);
};

MappyCommands.prototype.say = function(text) {
    this.runSerial('TextToSpeechCommand', {
        language: 'de',
        pitch: 400,
        text: text
    });
};

MappyCommands.prototype.play = function(file) {
    this.runSerial('PlayAudioFileCommand', {
        file: file
    });
};

module.exports = new MappyCommands(commands);
