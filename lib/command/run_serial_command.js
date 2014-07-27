'use strict';

var RunSerialCommand = function() {
    this.activePromise = null;
    this.paramsList = [];
};

RunSerialCommand.prototype = {
    run: function(params) {
        if (! this.activePromise || ! this.activePromise.isPending()) {
            this._runCommand(params);
        } else {
            this.paramsList.push(params);
        }
    },

    _runCommand: function(params) {
        this.activePromise = params.command.run(params).finally(function() {
            if (this.paramsList.length) {
                this._runCommand(this.paramsList.shift());
            }
        }.bind(this));
    }
};

exports.RunSerialCommand = RunSerialCommand;