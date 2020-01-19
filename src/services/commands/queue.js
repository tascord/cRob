const mm = require('../musicManager');

exports.run = (client, message, args, send, createEmbed, config, fs, Discord) => {

    var queue = mm.getQueue(message.guild.id);
    var nowPlaying = mm.getNowPlaying(message.guild.id);

    if(!queue[0] && nowPlaying == false) return send(createEmbed("There are currently no songs queued!"));

    var songs = [];

    for(var i = 0; i < queue.length; i++) {

        songs.push(`[${i + 1}] - [${queue[i].name}](${queue[i].id})`);

    }

    var embed = new Discord.RichEmbed()
        .setColor(config.colour)
        .setAuthor(`${message.guild.name}'s Queue`, message.guild.iconURL)
        .addField("Now Playing", `[${nowPlaying.name}](${nowPlaying.id})`)
        .addField("Up Next", !queue[0] ? "Nothing's queued!" : songs.join('\n\n'));

    send(embed);

}