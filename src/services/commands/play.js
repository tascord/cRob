const mm = require('../musicManager');

var opus = require('opusscript');
const ytdl = require('ytdl-core');

exports.run = (client, message, args, send, createEmbed, config, fs, Discord) => {

    if(!config.ytkey) return;

    if(!message.member.voiceChannel) return send(createEmbed("You need to be in a VoiceChannel to use Music Commands"));
    
    var songName = args.join(' ').trim();
    if(!songName) return send(createEmbed("Please provide a YouTube search term"));

    var song = mm.getSong(songName, processSong);

    function processSong(song) {

        if(song == false) return send(createEmbed("Sorry, I can't find a song by that name."));
    
        mm.addSong(message.guild.id, song);

        message.member.voiceChannel.join().then((connection) => {
            mm.joinChannel(message.guild.id, connection);
            playSong(connection, message.guild.id);
        });

    }

    function playSong(connection, serverID) {

        var queue = mm.getQueue(serverID);
        if(!queue[0]) return false;

        if(mm.getDispatcher(serverID) != false) return;

        var song = queue[0];

        var dispatcher = connection.playStream(ytdl('https://www.youtube.com/watch?v=b4efKHPueJ0', {filter: 'audioonly'}));
        mm.setDispatcher(serverID, dispatcher);
        mm.playingSong(serverID);

        ytdl('https://www.youtube.com/watch?v=b4efKHPueJ0', {filter: 'audioonly'});

        console.trace(song);
        
        dispatcher.on('end', (serverID) => {
            var queue = mm.getQueue(serverID);

            if(!queue[0]) return mm.setDispatcher('');
            else {
                var connection = mm.getConnection(serverID);
                
                if(connection == false) return;
                
                playSong(connection, serverID);
            }
        });
       

    }


}