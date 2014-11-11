'use strict';

var exec = require('child-process-promise').exec;
var shellescape = require('shell-escape');

/* USBswitchCmd [-n device] [0 | 1] [-d]
 *           -n device   use device with this serial number
 *           0 | 1       turns switch off(0) or on(1)
 *           -d          print debug infos
 *           -w          make use of the watchdog
 *           -s          secure switching - wait and ask if switching was done
 *           -r          read the current setting
 *           -t          reseT the device
 *           -i nnn      interval test, turn endless on/off and wait nnn ms between state change
 *           -# switch#  select switch for multiple switch device, first=0
 *           -v          print version
 *           -h          print command usage
 */
var UsbSwitchCommand = function() {
};

UsbSwitchCommand.prototype = {
    run: function(params) {
        var commandParts = [
            'USBswitch',
            params.on,
            '-#', params.port
        ];

        return exec(shellescape(commandParts));
    },
};

exports.UsbSwitchCommand = UsbSwitchCommand;
