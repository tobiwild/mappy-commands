'use strict';

var querystring = require('querystring');
var shellescape = require('shell-escape');
var util = require('util');

var ChildProcessList = require('../child_process_list').ChildProcessList;

var TextToSpeechCommand = function(defaults) {
    this.defaults = defaults;
};

TextToSpeechCommand.prototype = {
    run: function(message) {
        message = util._extend(
            util._extend({}, this.defaults), message);

        var command = shellescape([
            'curl',
            '--user-agent',
            'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1',
            'http://translate.googleapis.com/translate_tts?ie=UTF-8&client=gtx&'+querystring.stringify({
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
