const sm = require('../serverManager');

exports.run = (client, message, args, send, createEmbed, config, fs, Discord) => {

    var server = sm.getServer(message.guild.id);
    if(server == false) return send(createEmbed("This server dosen't have any roles yet!"));
    if(!server.rolepicker) return send(createEmbed("This server dosen't have any roles yet!"));
    if(!server.rolepicker[0]) return send(createEmbed("This server dosen't have any roles yet!"));

    var content = "";

    var _roles = [];

    for(var i = 0; i < server.rolepicker.length; i++) {

        if(!message.guild.rolepicker.get(server.rolepicker[i].role)) continue;
        
        _roles.push(server.rolepicker[i]);
        content += `\n${server.rolepicker[i].emoji} | ${message.guild.rolepicker.get(server.rolepicker[i].role)}`;

    }

    if(server.rolepicker != _roles) server.rolepicker = _roles;

    var persistent = false;
    if(args[0] === "persistent") persistent = true;
    
    if(persistent === true && !message.member.permissions.has(["MANAGE_ROLES"])) return send(createEmbed("You don't have the required permissions. [`MANAGE_ROLES`]"));
    
    message.channel.send(createEmbed('Role Pallette', [], `Select a role to toggle having it!\n${content}`)).then((message) => {   

        for(var i = 0; i < server.rolepicker.length; i++) {
            message.react(server.rolepicker[i].emoji);
        }

        if(!server.pallettes) server.pallettes = [];

        server.pallettes.push(message.id);
        sm.modifyServer(server.id, server);
        
        if(persistent) return;
                
        setTimeout(() => {

            var server = sm.getServer(message.guild.id);
            if(!server.pallettes[0]) return;

            var _pallettes = [];

            for(var i = 0; i < server.pallettes.length; i++) {
                if(server.pallettes[i] != message.id) _pallettes.push(server.pallettes[i]);
            }

            server.pallettes = _pallettes;

            sm.modifyServer(server.id, server);

            message.delete();

        }, 10000);
        
    })

};