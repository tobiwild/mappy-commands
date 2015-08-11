'use strict';

var querystring = require('querystring');
var shellescape = require('shell-escape');

var ChildProcessList = require('../child_process_list').ChildProcessList;

var TextToSpeechCommand = function() {
};

TextToSpeechCommand.prototype = {
    run: function(message) {
        var command = shellescape([
            'curl',
            '--user-agent',
            'Mozilla/5.0 (X11; Linux i686) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.107 Safari/537.36',
            'http://translate.google.com/translate_tts?ie=utf-8&total=1&idx=0&client=t&'+querystring.stringify({
                q: message.text,
                tl: message.language
            })
        ]);

        var args = ['play', '-t', 'mp3', '-'];

        ['speed', 'pitch', 'tempo'].forEach(function(opt) {
            if (opt in message) {
                args.push(opt, String(message[opt]));
            }
        });

        command += ' | ' + shellescape(args);

        return ChildProcessList.exec(command).then(function() {
            return false;
        }, function() {
            return 'Das konnte ich nicht sagen';
        });
    }
};

exports.TextToSpeechCommand = TextToSpeechCommand;
