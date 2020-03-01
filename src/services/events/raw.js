//Filesystem
const fs = require('fs');

//Custom Modules
const mh = require('../moduleHandler');
const sm = require('../serverManager');

//ClientExtentions
const ce = require('../extentions/clientExtentions');

module.exports = (client, event) => {

    if(event.t == null) return;

    // warn(event.t)

    // Custom modules
    var module = mh.getModuleFromEvent(event.t);
    if(module) {
        return require(`../../../modules${module.target}`).trigger(event);
    }
    
    if(event.t === "MESSAGE_DELETE") {

        if(!event.d.guild_id) return;

        var server = sm.getServer(event.d.guild_id);
        
        if(server == false) return;
        if(!server.pallettes[0]) return;

        var _pallettes = [];
        
        for(var i = 0; i < server.pallettes.length; i++) {
            if(server.pallettes[i] != event.d.id) _pallettes.push(server.pallettes[i]);
        }

        server.pallettes = _pallettes;
        sm.modifyServer(server.id, server);

    }

    if(event.t === "MESSAGE_REACTION_ADD" || event.t === "MESSAGE_REACTION_REMOVE") {

        var server = sm.getServer(event.d.guild_id);

        if(server === false) return;
        if(!server.pallettes[0]) return;
        
        var roleID;
        for(var i = 0; i < server.roles.length; i++) {
            if(server.roles[i].emoji == event.d.emoji.name) roleID = server.roles[i].role;
        }
        
        if(!roleID) return;
        var guild  = client.guilds.get(event.d.guild_id);
        var member = guild.members.get(event.d.user_id);
        var role   = guild.roles.get(roleID);

        if(!guild || !role || !member) return;

        if(!guild.me.permissions.has(['MANAGE_ROLES'])) return sm.sendModMessage("I don't have permission to apply roles, therefore my role picker is useless. Please either remove all the roles from the role picker or give me permissions!");

        if(event.t === "MESSAGE_REACTION_ADD") member.addRole(role);
        else member.removeRole(role);

    }

    if(event.t === "GUILD_MEMBER_UPDATE") {

        var guild = client.guilds.find(g => g.id === event.d.guild_id);
        var server = sm.getServer(guild.id);

        server.modifyUsers = guild.members.filter(m => m.permissions.has('MANAGE_GUILD')).map(m => m.id)
        
        sm.modifyServer(guild.id, server);
    

    }

    if(event.t === "GUILD_UPDATE") {

        var guild = client.guilds.find(g => g.id === event.d.guild_id);
        var server = sm.getServer(guild.id);

        //console.log(guild.roles, guild.channels);
        
        server.ownerID = guild.owner.id;
        server.icon = guild.iconURL;
        server.name = guild.name;

        var roles = [];
        var channels = [];

        guild.roles.forEach(role => {
            roles.push({name: role.name, id: role.id});
        });

        guild.channels.forEach(channel => {
            if(channel.type == 'text') channels.push({name: channel.name, id: channel.id});
        });

        server.roles = roles;
        server.channels = channels;

        sm.modifyServer(guild.id, server);    

    }

    if(event.t === "GUILD_DELETE") {

        sm.deleteServer(event.d.id);

    }

    

}