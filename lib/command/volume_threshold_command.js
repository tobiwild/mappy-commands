'use strict';

var Q = require('q');
var exec = require('child_process').exec;

var VolumeThresholdCommand = function() {
    this.process = null;
};

VolumeThresholdCommand.prototype = {
    run: function(params) {
        var deferred = Q.defer();
        params.deferred = deferred;

        if (this.process) {
            this.process.on('close', function() {
                this._runCommand(params);
            }.bind(this));
            this.process.kill('SIGKILL');
        } else {
            this._runCommand(params);
        }
        
        return deferred.promise;
    },

    _runCommand: function(params) {
        var command = 
            'AUDIODEV=hw:' + 
            parseInt(params.card) + 
            ' rec -n rate 16k silence 1 ' +
            parseFloat(params.duration) + ' ' +
            parseInt(params.threshold) + '% 1 0 100%';

        this.process = exec(command)
            .on('close', function(code, signal) {
                this.process = null;
                if (signal === 'SIGKILL') {
                    params.deferred.reject(new Error('process was killed'));
                } else {
                    params.deferred.resolve(false);
                }
            }.bind(this))
            .on('error', function(error) {
                params.deferred.reject(error);
            });
    }
};

exports.VolumeThresholdCommand = VolumeThresholdCommand;
