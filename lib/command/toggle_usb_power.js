'use strict';

var Q = require('q');
var exec = require('child_process').exec;
var shellescape = require('shell-escape');

var ToggleUsbPowerCommand = function() {
    this.processes = {};
};

ToggleUsbPowerCommand.prototype = {
    run: function(params) {
        var command = shellescape(['lsusb', '-d', params.id]);

        var deferred = Q.defer();

        exec(command, function(error, stdout) {
            var m = stdout.match(/^Bus (\d+) Device (\d+)/);

            if (!m) {
                deferred.reject(new Error('device not found'));
                return;
            }

            var busdev = Number(m[1]) + ':' + Number(m[2]);

            params.busdev   = busdev;
            params.deferred = deferred;
            params.key      = busdev + params.port;

            if (params.key in this.processes) {
                this.processes[params.key].on('close', function() {
                    this._runCommand(params);
                }.bind(this));
                this.processes[params.key].kill();
            } else {
                this._runCommand(params);
            }
        }.bind(this));

        return deferred.promise;
    },

    _runCommand: function(params) {
        var command = shellescape([
            'hubpower', params.busdev, 'power', params.port, params.mode
        ]);

        this.processes[params.key] = exec(command)
            .on('close', function() {
                delete this.processes[params.key];
                params.deferred.resolve(false);
            }.bind(this))
            .on('error', function(error) {
                params.deferred.reject(error);
            });
    }
};

exports.ToggleUsbPowerCommand = ToggleUsbPowerCommand;
