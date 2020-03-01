// Get commands list
const commands = require('./_commands.json');

// Module Handler
const mh = require('../moduleHandler');

exports.run = (client, message, args, send, createEmbed, config, fs, Discord) => {

    if(message.deletable) message.delete();

    var fields = [];

    for(var i in commands) {
        if(!fields[i]) fields[i] = {title: `${i.charAt(0).toUpperCase()}${i.slice(1)} Commands`, data: ""};
        for(var j in commands[i]) {
            var command = commands[i][j];
            fields[i].data += (`**${command.name}** - ${command.description}. Usage: *${command.usage}*\n`);
        }
    }

    var modules = mh.getCommands();
    if(modules) {
        
        fields[fields.length] = {title: "Custom Commands", data: ""};
        
        for(var i in modules) {
            fields[fields.length - 1].data += `**${modules[i].command}** - ${modules[i].description != undefined ? modules[i].description : "No description provided, who knows what this does"}. Usage: *${modules[i].usage}*\n`;
        }
    }

    fields.unshift({
        title: "**Bugs, Hanging & Crashing**",
        data: "If a command you're running is behaving unexpectedly, hanging or crashing the bot, please report it [here](https://github.com/tascord/cRob)."
    })

    send(createEmbed(
        "Command List & Help",
        fields,
        "Key: <mandatory> [optional] (permissions needed)"
    ), 30);


}
