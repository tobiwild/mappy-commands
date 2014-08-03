'use strict';

var Q = require('q');
var exec = require('child_process').exec;
var shellescape = require('shell-escape');

var ToggleUsbPowerCommand = function() {
    this.paramList = {};
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

            var paramKey = this._getParamKey(params);
            
            if (paramKey in this.paramList && 'timeout' in this.paramList[paramKey]) {
                clearTimeout(this.paramList[paramKey].timeout);
            }

            this.paramList[paramKey] = {
                busdev: busdev,
                port: params.port,
                deferred: deferred,
                loop: params.mode === 'loop'
            };

            var mode = params.mode === 'loop' ? 'on' : params.mode;
            this._runCommand(paramKey, mode);
        }.bind(this));

        return deferred.promise;
    },

    _getParamKey: function(params) {
        return params.id + '|' + params.port;
    },

    _runCommand: function(paramKey, mode) {
        var params = this.paramList[paramKey];

        var command = shellescape([
            'hubpower', params.busdev, 'power', params.port, mode
        ]);

        exec(command)
            .on('close', function() {
                if (params.loop) {
                    params.timeout = setTimeout(function() {
                        this._runCommand(paramKey, mode === 'on' ? 'off' : 'on');
                    }.bind(this), 1000);
                } else {
                    params.deferred.resolve(false);
                }
            }.bind(this))
            .on('error', function(error) {
                params.deferred.reject(error);
            });
    }
};

exports.ToggleUsbPowerCommand = ToggleUsbPowerCommand;
