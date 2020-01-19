const mm = require('../musicManager');

exports.run = (client, message, args, send, createEmbed, config, fs, Discord) => {

    mm.getDispatcher(message.guild.id).end();
    mm.setDispatcher(message.guild.id, false);

    send(createEmbed("Skipped!"));

}