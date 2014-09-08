'use strict';

var exec = require('child-process-promise').exec;

var ListIpAddressesCommand = function() {
};

ListIpAddressesCommand.prototype = {
    run: function() {
        return exec('ip -o addr | awk \'$3 == "inet" {printf "%s:\\t%s\\n",$2,$4}\'').then(function(result) {
            return result.stdout;
        });
    }
};

exports.ListIpAddressesCommand = ListIpAddressesCommand;
