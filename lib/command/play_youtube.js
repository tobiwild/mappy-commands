'use strict';

var shellescape = require('shell-escape');

var ChildProcessList = require('../child_process_list').ChildProcessList;

var PlayYoutubeCommand = function() {
};

PlayYoutubeCommand.prototype = {
    run: function(message) {
        var args1 = [
            'youtube-dl',
            '-q',
            '-o',
            '-',
            message.link
        ];

        var args2 = [
            'mplayer',
            '-quiet',
            '-novideo',
            '-'
        ];

        var command = shellescape(args1) + ' | ' + shellescape(args2);

        return ChildProcessList.exec(command).then(function() {
            return false;
        }, function() {
            return 'Konnte das Youtube-Video nicht abspielen';
        });
    }
};

exports.PlayYoutubeCommand = PlayYoutubeCommand;
