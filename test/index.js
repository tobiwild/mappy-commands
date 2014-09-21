'use strict';

require('should');

describe('package export', function() {

    var exports;

    before(function() {
        exports = require('../index');
    });

    it('should have only commands included', function() {
        for (var exportName in exports.commands) {
            exportName.should.endWith('Command');
            exports.commands[exportName].prototype.run.should.be.type('function');
        }
    });
});
