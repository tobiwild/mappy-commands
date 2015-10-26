'use strict';

var querystring = require('querystring');
var shellescape = require('shell-escape');

var ChildProcessList = require('../child_process_list').ChildProcessList;

var TextToSpeechVoiceRssCommand = function(config) {
    this.config = config;
};

TextToSpeechVoiceRssCommand.prototype = {
    run: function(message) {
        var url = 'http://api.voicerss.org?'+querystring.stringify({
            key: this.config.key,
            f: '44khz_16bit_mono',
            src: message.text,
            hl: message.language
        });

        var args = ['play', '-t', 'mp3', url];

        ['speed', 'pitch', 'tempo'].forEach(function(opt) {
            if (opt in message) {
                args.push(opt, String(message[opt]));
            }
        });

        var command = shellescape(args);

        return ChildProcessList.exec(command).then(function() {
            return false;
        }, function() {
            return 'Das konnte ich nicht sagen';
        });
    }
};

exports.TextToSpeechVoiceRssCommand = TextToSpeechVoiceRssCommand;
