const commands = require('./_commands.json');

exports.run = (client, message, args, send, createEmbed, config, fs, Discord) => {

    var text = [];

    if(message.deletable) message.delete();

    for(var i in commands) {
        text.push('\n**' + i.charAt(0).toUpperCase() + i.slice(1) + " Commands**");
        for(var j in commands[i]) {
            text.push(`**${commands[i][j].name}** - ${commands[i][j].description}. Usage: *${commands[i][j].usage}*`);
        }
    }

    send(createEmbed('', '', '', `Pong! ${Math.trunc(client.ping * 10) / 10}ms`));

}