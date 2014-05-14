'use strict';

var Q = require('q');
var exec = require('child-process-promise').exec;
var shellescape = require('shell-escape');

var ToggleUsbPowerCommand = function() {
};

ToggleUsbPowerCommand.prototype = {
    run: function(params) {
        var command = shellescape(['lsusb', '-d', params.id]);

        var deferred = Q.defer();

        exec(command).done(function(p) {
            var m = p.stdout.match(/^Bus (\d+) Device (\d+)/);

            if (!m) {
                throw new Error('device not found');
            }

            var busdev = Number(m[1]) + ':' + Number(m[2]);
            var command = shellescape([
                'sudo', 'hubpower', busdev, 'power', params.port, params.mode
            ]);

            exec(command).done(function() {
                deferred.resolve(false);
            }, deferred.reject);
        }, deferred.reject);

        return deferred.promise;
    }
};

exports.ToggleUsbPowerCommand = ToggleUsbPowerCommand;