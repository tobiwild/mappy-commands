Mappy commands
==============

## Usage

Mappy is an awesome sheep. It can do so many things.
Run a command like so:

```
$ node run.js --command=ToggleUsbPowerCommand --id=05e3:0608 --port=4 --mode=off
```

Or include the commands in your JavaScript as a module:

```javascript
var commands = require('mappy-commands');
var toggleUsbPowerCommand = new commands.ToggleUsbPowerCommand();
toggleUsbPowerCommand.run({
    id: '05e3:0608',
    port: 4,
    mode: 'off'
});

The return value of run() is always a promise.
```
## Commands

### KillProcessesCommand
When Mappy talks too much, run this. Mappy can talk all day long and it can be very annoying.

### LedTextCommand
Mappy can show some cool scolling text on a led device. You need this:
* http://www.dreamcheeky.com/led-message-board
* http://www.jeffrika.com/~malakai/dcled/index.html
* make sure `dcled` command is in `PATH`

### ListAudioFilesCommand
List files in folder `./audio`

### PlayAudioFileCommand
Mappy plays audio files/streams. You need this:
* http://sox.sourceforge.net/

### RocketLauncherCommand
* http://www.dreamcheeky.com/thunder-missile-launcher

### RunSerialCommand
Sometimes it's better mappy does things serial

### TextToSpeechCommand
Let mappy baa. Uses google's translation webservice.
* *text* - what should mappy say
* *language* - (en, de, fr, ...)
* *speed* - 1.0 is normal speed
* *tempo* - 1.0 is normal tempo
* *pitch* - 0 ist normal pitch

### ToggleUsbPowerCommand
Mappy can control USB devices. How about switching some usb lamp? You need this:
* some usb hub with _per port power switching_
* https://github.com/tobiwild/hubpower
* compile `hubpower.c` and make sure `hubpower` is in `PATH`
