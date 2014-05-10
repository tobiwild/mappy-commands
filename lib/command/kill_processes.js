'use strict';

var Q  = require('q');
var ChildProcessList = require('../child_process_list').ChildProcessList;

var KillProcessesCommand = function() {
};

KillProcessesCommand.prototype = {
    run: function() {
        return Q.fcall(function() {
            ChildProcessList.killAll();
        }).then(function() {
            return false;
        });
    }
};

exports.KillProcessesCommand = KillProcessesCommand;