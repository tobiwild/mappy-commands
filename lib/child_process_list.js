'use strict';

var exec = require('child-process-promise').exec;

exports.ChildProcessList = {
    processes: {},

    exec: function(command) {
        var self = this;

        var process = null;
        return exec(command)
            .progress(function(p) {
                process = p;
                self.processes[process.pid] = p;
                return p;
            })
            .finally(function() {
                if (process) {
                    delete self.processes[process.pid];
                }
            });
    },

    killAll: function() {
        for (var pid in this.processes) {
            this.processes[pid].kill();
        }
    }
};