'use strict';

var exec = require('child-process-promise').exec;

var ShowHostnameCommand = function() {
};

ShowHostnameCommand.prototype = {
    run: function() {
        return exec('hostname --fqdn').then(function(result) {
            return result.stdout;
        });
    }
};

exports.ShowHostnameCommand = ShowHostnameCommand;
