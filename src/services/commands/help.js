// Get commands list
const commands = require('./_commands.json');

// Module Handler
const mh = require('../moduleHandler');

exports.run = (client, message, args, send, createEmbed, config, fs, Discord) => {

    if(message.deletable) message.delete();

    var text = [];

    for(var i in commands) {
        text.push(`\n**${i.charAt(0).toUpperCase() + i.slice(1)} Commands**`);
        for(var j in commands[i]) {
            text.push(`**${commands[i][j].name}** - ${commands[i][j].description}. Usage: *${commands[i][j].usage}*`);
        }
    }

    var modules = mh.getCommands();
    if(modules) {
        text.push(`\n**Custom Commands**`);
        for(var i in modules) {
            text.push(`**${modules[i].command}** - ${modules[i].description != undefined ? modules[i].description : "No description provided, who knows what this does"}. Usage: *${modules[i].usage}*`);
        }
    }

    send(createEmbed(
        "Command List & Help",
        [
            {
                title: "**Commands**\nKey: <mandatory> [optional]",
                data: text.join('\n')
            },
            {
                title: "**Bugs, Hanging & Crashing**",
                data: "If a command you're running is behaving unexpectedly, hanging or crashing the bot, please report it [here](https://tascord.ai/bots/issues)."
            }
        ]
    ), 30);


}