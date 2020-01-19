require('./console');

var config = require('../../config.json');

var YouTube = require('youtube-node');
var yt = new YouTube();

yt.setKey(config.ytkey);


/**
 * Data dosen't need to be permamnent,
 * as the bot restarting would break music anyways
**/

var servers = [];

// setInterval(() => {
//     console.log(servers);
// }, 5000)

module.exports = {

    addSong: function(serverID, song) {
        
        var server = getServer(serverID);
        server.queue.push(song);
        updateServer(server.id, server);
        
    },
    
    joinChannel: function(serverID, voiceChannel) {
        
        var server = getServer(serverID);
        server.connection = voiceChannel;
        
    },
    
    disconnect: function(serverID) {
        
        var server = getServer(serverID);
        if(!server.dispatcher) return false;
        
        ce.clientAction(server.dispatcher.leave());
        updateServer(server.id, server);

    },

    getSong: function(query, callback) {

        var index = 0;

        yt.search(query, 2, (err, result) => {

            if(!result) { warn("Unable to search YouTube with given API Key!"); return false; };
            if(!result.items[0]) return false;

            while (result.items[index].id.kind != "youtube#video") { 
                
                //Skip non videos
                index++;
                if(index > 20) return false;

            } 

            var hit = result.items[index];
            var song = {};

            song.id = `https://youtube.com/watch?v=${hit.id.videoId}`;
            song.name = hit.snippet.title;

            while(song.name.indexOf("&quot;") > -1 || song.name.indexOf("&#39;") > -1) {
                song.name = song.name.replace("&quot;", "\"");
                song.name = song.name.replace("&#39;", "'");
            }

            song.raw = hit;

            if(!callback) return song;
            return callback(song);

        });

    },

    getQueue: function(serverID) {
        var server = getServer(serverID);
        return server.queue;
    },

    playingSong: function(serverID) {
        var server = getServer(serverID);
        
        if(!server.queue[0]) return false;
        server.queue.shift();

        updateServer(server.id, server);
    },

    getDispatcher: function(serverID) {
        var server = getServer(serverID);

        if(!server.dispatcher) return false;
        return server.dispatcher;
    },

    setDispatcher: function(serverID, dispatcher) {
        var server = getServer(serverID);

        server.dispatcher = dispatcher;
        updateServer(server.id, server);

    },

    setNowPlaying: function(serverID, song) {
        var server = getServer(serverID);
        
        server.nowPlaying = song;
        updateServer(server.id, server);

    },

    getNowPlaying: function(serverID) {
        var server = getServer(serverID);

        

        if(!server.nowPlaying) return false;
        return server.nowPlaying;
    },

    getConnection: function(serverID) {
        var server = getServer(serverID);

        if(!server.connection) return false;
        return server.connection;
    }

}

function getServer(serverID) {
    
    for(var i = 0; i < servers.length; i++) {
        if(servers[i].id == serverID) return servers[i];
    }
    
    servers.push({id: serverID, queue: []});
    return {id: serverID, queue: []};
    
}

function updateServer(serverID, server) {
    
    var _servers = [];

    for(var i = 0; i < servers.length; i++) {
        if(servers[i].id != serverID) _servers.push(servers[i]);
        else _servers.push(server)
    }

    servers = _servers;

}