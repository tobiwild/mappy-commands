'use strict';

var ChildProcessList = require('../child_process_list').ChildProcessList;

var KillProcessesCommand = function() {
};

KillProcessesCommand.prototype = {
    run: function() {
        ChildProcessList.killAll();
    }
};

exports.KillProcessesCommand = KillProcessesCommand;