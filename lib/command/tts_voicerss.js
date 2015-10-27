'use strict';

var querystring = require('querystring'),
    shellescape = require('shell-escape'),
    util = require('util');

var ChildProcessList = require('../child_process_list').ChildProcessList;

var TextToSpeechVoiceRssCommand = function(defaults) {
    this.defaults = defaults;
};

TextToSpeechVoiceRssCommand.prototype = {
    run: function(message) {
        message = util._extend(this.defaults, message);
        var url = 'http://api.voicerss.org?'+querystring.stringify({
            key: message.key,
            f: '44khz_16bit_mono',
            src: message.text,
            hl: message.language
        });

        var args = ['play', '-t', 'mp3', url];

        if ('options' in message) {
            args = args.concat(message.options.split(/\s+/));
        }

        var command = shellescape(args);

        return ChildProcessList.exec(command).then(function() {
            return false;
        }, function() {
            return 'Das konnte ich nicht sagen';
        });
    }
};

exports.TextToSpeechVoiceRssCommand = TextToSpeechVoiceRssCommand;
