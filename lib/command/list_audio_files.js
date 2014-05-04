'use strict';

var fs = require('fs');
var Q  = require('q');

var ListAudioFilesCommand = function() {
    this.path = './audio/';
};

ListAudioFilesCommand.prototype = {
    run: function() {
        return this.getFiles().then(function(files) {
            if (files.length === 0) {
                return 'Keine Dateien gefunden';
            } else {
                return 'Folgende Dateien sind vorhanden:\n' + files.join('\n');
            }
        });
    },
    getFiles: function() {
        var readdir = Q.denodeify(fs.readdir);

        return readdir(this.path);
    }
};

exports.ListAudioFilesCommand = ListAudioFilesCommand;
