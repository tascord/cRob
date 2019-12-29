const sm = require('../serverManager');

exports.run = (client, message, args, send, createEmbed, config, fs, Discord) => {

    var server = sm.getServer(message.guild.id);
    if(server == false) return send(createEmbed("This server dosen't have any roles yet!"));
    if(!server.roles) return send(createEmbed("This server dosen't have any roles yet!"));
    if(!server.roles[0]) return send(createEmbed("This server dosen't have any roles yet!"));

    var content = "";

    var _roles = [];

    for(var i = 0; i < server.roles.length; i++) {

        if(!message.guild.roles.get(server.roles[i].role)) continue;
        
        _roles.push(server.roles[i]);
        content += `\n${server.roles[i].emoji} | ${message.guild.roles.get(server.roles[i].role)}`;

    }

    if(server.roles != _roles) server.roles = _roles;

    var persistent = false;
    if(args[0] === "persistent") persistent = true;
    
    if(persistent === true && !message.member.permissions.has(["MANAGE_ROLES"])) return send(createEmbed("You don't have the required permissions. [`MANAGE_ROLES`]"));
    
    message.channel.send(createEmbed('Role Pallette', [], `Select a role to toggle having it!\n${content}`)).then((message) => {   

        for(var i = 0; i < server.roles.length; i++) {
            message.react(server.roles[i].emoji);
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