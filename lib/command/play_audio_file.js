'use strict';

var fs           = require('fs');
var Q            = require('q');
var shellescape  = require('shell-escape');
var url          = require('url');

var ChildProcessList = require('../child_process_list').ChildProcessList;

var PlayAudioFileCommand = function() {
    this.path = './audio/';
};

PlayAudioFileCommand.prototype = {
    run: function(message) {
        var readdir = Q.denodeify(fs.readdir);
        var self    = this;

        return readdir(this.path).then(function(files) {
            if (files.indexOf(message.file) >= 0) {
                return self._playFile(self.path+message.file);
            } else {
                var urlParts = url.parse(message.file);

                if (urlParts.protocol) {
                    return self._playFile(message.file);
                }
            }

            return 'Datei nicht gefunden';
        });
    },

    _playFile: function(file) {
        var command = shellescape(['play', file]);

        return ChildProcessList.exec(command).then(function() {
            return false;
        }, function() {
            return 'Konnte Datei nicht abspielen';
        });
    }
};

exports.PlayAudioFileCommand = PlayAudioFileCommand;