'use strict';

var shellescape = require('shell-escape');
var ChildProcessList = require('../child_process_list').ChildProcessList;

//     --brightness  -b   How bright, 0-2
//     --clock       -c   Show the time
//     --clock24h    -C   Show the 24h time
//     --bcdclock    -B   Show the time in binary
//     --debug       -d   Mostly useless
//     --echo        -e   Send copy to stdout
//     --help        -h   Show this message
//     --message     -m   A single line message to scroll
//     --nodev       -n   Don't use the device
//     --preamble    -p   Send a graphic before the text.
//     --repeat      -r   Keep scrolling forever
//     --fastprint   -f   Jump to end of message.
//     --speed       -s   General delay in ms
//     --test        -t   Output a test pattern
//     --font        -g   Select a font
//     --fontdir     -G   Select a font directory

// Available preamble graphics:

//      1 - dots       - A string of random dots
//      2 - static     - Warms up like an old TV
//      3 - squiggle   - A squiggly line
//      4 - clock24    - Shows the 24 hour time
//      5 - clock      - Shows the time
//      6 - spiral     - Draws a spiral
//      7 - fire       - A nice warm hearth
//      8 - bcdclock   - Shows the time in binary
var LedTextCommand = function() {
    this.process = null;
    this.timeout = null;
};

var validOptions = {
    brightness: 'b',
    clock: 'c',
    clock24h: 'C',
    bcdclock: 'B',
    message: 'm',
    preamble: 'p',
    repeat: 'r',
    fastprint: 'f',
    speed: 's',
    test: 't',
    font: 'g',
    fontdir: 'G'
};

LedTextCommand.prototype = {
    run: function(params) {
        var commandParts = [
            'dcled',
        ];

        for (var key in params) {
            if (! (key in validOptions)) {
                continue;
            }

            if (params[key] === false) {
                continue;
            }

            commandParts.push('-' + validOptions[key]);

            if (typeof params[key] === 'string' || typeof params[key] === 'number') {
                commandParts.push(params[key]);
            }
        }

        var command = shellescape(commandParts);

        this.stop();

        return ChildProcessList.exec(command)
            .then(function(process, stdout, stderr) {
                if (stderr) {
                    return stderr;
                }

                return false;
            })
            .progress(function(process) {
                this.process = process;

                if (params.timeout) {
                    this.timeout = setTimeout(function() {
                        this.timeout = null;
                        this.stop();
                    }.bind(this), params.timeout);
                }
            }.bind(this))
            .finally(function() {
                if (this.timeout) {
                    clearTimeout(this.timeout);
                    this.timeout = null;
                }

                this.process = null;
            }.bind(this));
    },

    stop: function() {
        if (this.process) {
            this.process.kill();
        }
    }
};

exports.LedTextCommand = LedTextCommand;