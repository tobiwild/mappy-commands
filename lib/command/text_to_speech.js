'use strict';

var querystring = require('querystring');
var shellescape = require('shell-escape');

var ChildProcessList = require('../child_process_list').ChildProcessList;

var TextToSpeechCommand = function() {
};

TextToSpeechCommand.prototype = {
    run: function(message) {
        var command = shellescape(['play', 'http://tobiwild.de/tts.php?'+querystring.stringify(message)]);

        return ChildProcessList.exec(command).then(function() {
            return false;
        }, function() {
            return 'Das konnte ich nicht sagen';
        });
    }
};

exports.TextToSpeechCommand = TextToSpeechCommand;