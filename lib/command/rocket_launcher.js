'use strict';

var shellescape = require('shell-escape');
var Q = require('q');
var exec = require('child_process').exec;
var fs = require('fs');

var RocketLauncherCommand = function() {
    this.process = null;
    this.paramsList = [];
    this.configFile = './rocketlauncher.json';
    this.config = null;

    this._loadConfig();
    fs.watch(this.configFile, {persistent: false}, function(ev) {
        if (ev === 'change') {
            this._loadConfig();
        }
    }.bind(this));
};

RocketLauncherCommand.prototype = {
    run: function(params) {
        var deferred = Q.defer();

        params.deferred = deferred;

        if (this.process || !this.config) {
            this.paramsList.push(params);
        } else {
            this._startProcess(params);
        }

        return deferred.promise;
    },

    stop: function() {
        if (this.process) {
            this.process.kill();
        }
    },

    _loadConfig: function() {
        fs.readFile(this.configFile, function(err, data) {
            this.config = JSON.parse(data);

            if (!this.process && this.paramsList.length) {
                this._startProcess(this.paramsList.shift());
            }
        }.bind(this));
    },

    _startProcess: function(params) {
        var commandParts = [
            'dcthunder'
        ];

        var commands = this._getCommandsFromParams(params);

        if (!commands) {
            return;
        }

        commandParts = commandParts.concat(commands.split(/\s+/));

        var command = shellescape(commandParts);

        this.process = exec(command)
            .on('close', function() {
                this.process = null;

                if (this.paramsList.length) {
                    this._startProcess(this.paramsList.shift());
                    params.deferred.reject(new Error('killed by other command'));
                } else {
                    params.deferred.resolve(false);
                }
            }.bind(this));
    },

    _getCommandsFromParams: function(params) {
        var commands = '';

        if ('target' in params) {
            if (params.target in this.config.targets) {
                commands = this.config.targets[params.target];
            } else {
                params.deferred.reject(new Error('target '+params.target+' is not defined'));
                return '';
            }
        }

        if ('commands' in params) {
            commands += ' ' + params.commands;
        }

        return commands.trim();
    }
};

exports.RocketLauncherCommand = RocketLauncherCommand;