'use strict';

var commands = require('./index');

var argv = require('minimist')(process.argv.slice(2));

function printHelp() {
    console.log('');
    console.log('Please specity one of these:');
    console.log('');
    console.log(Object.keys(commands.commands).join('\n'));
}

if (! ('command' in argv)) {
    console.log('Option --command is missing.');
    printHelp();
    return;
}

if (! (argv.command in commands.commands)) {
    console.log('Command %s is not defined.', argv.command);
    printHelp();
    return;
}

var command = commands.get(argv.command);

command.run(argv).then(function(result) {
    if (false !== result) {
        console.log(result);
    }
}, function(result) {
    console.log('error');
    if (false !== result) {
        console.log(result);
    }

    process.exit(1);
});
