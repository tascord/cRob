const emojiRegex = require('emoji-regex');
const sm = require('../serverManager');
require('../download');

exports.run = (client, message, args, send, createEmbed, config, fs, Discord) => {

    // Permissions Wise
    
    /**
     * Change ModLog Channel - Manage Channels
     * Change Welcome Channel - Manage Channels
     * Change Welcome Picture - Manage Channels
     * Role Picker - Manage Roles
     */

    var server = sm.getServer(message.guild.id);
   
    if(server.ownerID == '000000000000000') server.ownerID == message.guild.ownerID;
    server.modifyUsers = message.guild.members.filter(m => m.permissions.has('MANAGE_GUILD')).map(m => m.id);
    
    server.icon = message.guild.iconURL;
    server.name = message.guild.name;
    server.ownerID = message.guild.owner.id;

    server.rolepicker = server.rolepicker ? server.rolepicker : [];

    var roles = [];
    var channels = [];

    message.guild.roles.forEach(role => {
        roles.push({name: role.name, id: role.id});
    });

    message.guild.channels.forEach(channel => {
        if(channel.type == 'text') channels.push({name: channel.name, id: channel.id});
    });

    server.roles = roles;
    server.channels = channels;

    sm.modifyServer(message.guild.id, server);

    if(!args[0]) {

        var rolePickerContent = "";
        
        for(var i = 0; i < server.rolepicker.length; i++) {
            rolePickerContent += `${server.rolepicker[i].emoji} | ${message.guild.rolepicker.get(server.rolepicker[i].role) ? message.guild.rolepicker.get(server.rolepicker[i].role) : "An invalid role :("}\n`;
        }

        if(rolePickerContent == "") rolePickerContent = "The server dosen't have any roles set up yet!"; 

        var welcomeChannel;
        if(!server.welcome.channel) welcomeChannel = "Not Set!";
        else {
            if(!message.guild.channels.get(server.welcome.channel)) welcomeChannel = "A channel that no longer exists!";
            else welcomeChannel = message.guild.channels.get(server.welcome.channel);
        }

        var modLog;
        if(!server.modLog) modLog = "Not Set!";
        else {
            if(!message.guild.channels.get(server.modLog)) modLog = "A channel that no longer exists!";
            else modLog = message.guild.channels.get(server.modLog);
        }

        return send(createEmbed(`Your Server Settings`, [{title: "Server ID", data: server.id}, {title: "Owner ID", data: server.ownerID}, {title: "Welcome Channel", data: welcomeChannel}, {title: "Welcome Image", data: server.welcome.image ? server.welcome.image : "Not Set!"}, {title: "ModLog Channel", data: modLog}, {title: "Role Picker Roles", data: rolePickerContent}]), 10);
    
    }

    var command = args.shift();

    switch(command) {

        case "modlog":

            if(!message.member.permissions.has(["MANAGE_CHANNELS"])) return send(createEmbed("You don't have the required permissions. [`MANAGE_CHANNELS`]"), 10);

            if(!args[0]) return send(createEmbed("You haven't provided me a channel!"), 10);
            if(args[0].match(/^<#[0-9]{18}>$/g) == null) return send(createEmbed("You haven't provided me a valid channel!!"), 10);

            var channelID = args[0].slice(2).slice(0, -1);
            console.log(args);
            console.log(channelID);
            
            if(!message.guild.channels.get(channelID)) return send(createEmbed("You haven't provided me a valid channel!"), 10);

            try { message.guild.channels.get(channelID).send(createEmbed(`The new 'ModLog' channel is here! [#${message.guild.channels.get(channelID).name}].`, [], `This change was made by ${message.author}`)); } catch (err) { return send(createEmbed("I couldn't send a message in that channel. Please make sure it still exists, and that I have permission to talk there!"), 10); } 

            server.modLog = channelID;
            sm.modifyServer(message.guild.id, server);
            
            send(createEmbed(`Set the ModLog channel!`), 10);
            
            sm.sendModMessage(client, server.id, `Set the ModLog channel, (now here)!\nThis change was made by: ${message.author}`);

        break;

        case "welcome":
        
             if(!message.member.permissions.has(["MANAGE_CHANNELS"])) return send(createEmbed("You don't have the required permissions. [`MANAGE_CHANNELS`]"), 10);
            if(!server.welcome) server.welcome = {};

            command = args.shift();

            switch(command) {

                case "channel":

                    if(!args[0]) {

                        server.welcome.channel = false;
                        sm.modifyServer(message.guild.id, server);

                         send(createEmbed("Removed welcome channel!"), 10);
                        return sm.sendModMessage(client, server.id, `Removed the welcome channel, disabling the welcome message\nThis change was made by: ${message.author}`);

                    }

                     if(args[0].match(/^<#[0-9]{18}>$/g) == null) return send(createEmbed("You haven't provided me a valid channel!"), 10);
        
                    var channelID = args[0].slice(2).slice(0, -1);
                    
                     if(!message.guild.channels.get(channelID)) return send(createEmbed("You haven't provided me a valid channel!"), 10);
        
                    sm.sendWelcomeMessage(client, message.guild.id, "New Welcome Channel (Here)!", "This Change Was Made By:", message.member.displayName, '', '', '', [2.85, 1.85, 1.4]);
                    
                    server.welcome.channel = channelID;
                    sm.modifyServer(message.guild.id, server);

                     send(createEmbed(`Set the welcome channel!`), 10);

                    sm.sendModMessage(client, server.id, `Set the welcome channel (now ${message.guild.channels.get(channelID)})\nThis change was made by: ${message.author}`);

                break;
                
                case "image":

                    if(!args[0]) {

                        server.welcome.image = false;
                        sm.modifyServer(message.guild.id, server);
                        
                         send(createEmbed("Removed welcome image!"), 10);
                        return sm.sendModMessage(client, server.id, `Removed the welcome image\nThis change was made by: ${message.author}`);
                        
                    }

                     send(createEmbed("Please keep in mind the welcome image is designed for a [1092 : 468] resolution.", [], "If any problems arise (messages not sending, cropping issues etc) please make your image the above resolution."), 10);
                    
                     if(args[0].indexOf('http://') <= -1 && args[0].indexOf('https://') <= -1) return send(createEmbed("You haven't provided me a link to an image!"), 10);
                    
                    var prefix = "";
                    
                    if(args[0].indexOf('png') > -1)       prefix = "png";
                    else if(args[0].indexOf('jpg') > -1)  prefix = "jpg";
                    else if(args[0].indexOf('jpeg') > -1) prefix = "jpg";
                    else if(args[0].indexOf('gif') > -1)  prefix = "gif";
                     else return send(createEmbed("Your image isn't a supported file type!", [], "- png,\n- jpg / jpeg,\n- gif"), 10);
                    
                    server.welcome.image = args[0];
                    sm.modifyServer(message.guild.id, server);
                    
                     send(createEmbed(`Set the welcome image!`), 10);

                    sm.sendWelcomeMessage(client, message.guild.id, "New Welcome Image!", "This Change Was Made By:", message.member.displayName, '', '', '', [2.85, 1.85, 1.4]);
                    sm.sendModMessage(client, server.id, `Changed the welcome image (now ${server.welcome.image})\nThis change was made by: ${message.author}`);

                    
                break;
                    
                default:
                     send(createEmbed("That's not a valid argument.", [], "- Channel,\n- Image"), 10);
                break;
            
            }

        break;

        case "roles":

             if(!message.member.permissions.has(["MANAGE_ROLES"])) return send(createEmbed("You don't have the required permissions. [`MANAGE_ROLES`]"), 10);

            command = args.shift();

            switch (command) {

                    case "add":

                         if(!args[0] || !args[1]) return send(createEmbed("You haven't provided a role and an emoji!"), 10);
                        
                         if(args[0].match(/^<@&[0-9]{18}>$/g) == null) return send(createEmbed("You haven't tagged a valid role!"), 10);
                        
                        var role = args[0].slice(3).slice(0, -1);
                         if(!message.guild.rolepicker.get(role)) return send(createEmbed("You haven't tagged a valid role!"), 10);
            
                        const ereg = emojiRegex();
                        
                        var match,
                        emojis = [];

                        while (match = ereg.exec(args[1])) {
                        emojis.push(match[0]);
                        }

                         if(emojis.length != 1) return send(createEmbed("You haven't provided a base (not custom) emoji!"), 10);
                        var emoji = emojis[0];

                        if(!server.rolepicker) server.rolepicker = [];
                         if(server.rolepicker.length > 11) return send(createEmbed("You can't have more than 12 roles in the role picker!"), 10);

                        for(var i = 0; i < server.rolepicker.length; i++) {
                             if(server.rolepicker[i].role == role) return send(createEmbed("An option with that role already exists!"), 10);
                             if(server.rolepicker[i].emoji == emoji) return send(createEmbed("An option with that emoji already exists!"), 10);
                        }

                        server.rolepicker.push({role: role, emoji: emoji});
                        sm.modifyServer(server.id, server);
                        
                         send(createEmbed(`Added a role to the role picker! [${server.rolepicker.length}/12]`, [], `${message.guild.rolepicker.get(role)} : ${emoji}`), 10);
                        sm.sendModMessage(client, server.id, `Added a role to the role picker (${message.guild.rolepicker.get(role)})\nThis change was made by: ${message.author}`);
                        
                    break;
                    
                    case "remove":
                        
                         if(!args[0]) return send(createEmbed("You haven't provided a role!"), 10);
                        
                         if(args[0].match(/^<@&[0-9]{18}>$/g) == null) return send(createEmbed("You haven't tagged a valid role!"), 10);
                        
                        var role = args[0].slice(3).slice(0, -1);
                         if(!message.guild.rolepicker.get(role)) return send(createEmbed("You haven't tagged a valid role!"), 10);

                         if(!server.rolepicker) return send(createEmbed("You don't have any roles to remove!"), 10);
                         if(!server.rolepicker[0]) return send(createEmbed("You don't have any roles to remove!"), 10);

                        var _roles = [];
                        
                        for(var i = 0; i < server.rolepicker.length; i++) {
                            if(server.rolepicker[i].role != role) _roles.push(server.rolepicker[i].role);
                        }
                        
                        server.rolepicker = _roles;

                        sm.modifyServer(server.id, server);
                         send(createEmbed(`Removed a role from the role picker! [${server.rolepicker.length}/12]`), 10);
                        
                        sm.sendModMessage(client, server.id, `Removed a role to the role picker ($${role})\nThis change was made by: ${message.author}`);
                break;

                case "list":

                break;

                default:
                     send(createEmbed("That's not a valid argument.", [], "- Add,\n- Remove,\n- List"), 10);
                break;

            }

        break;

        default:
             send(createEmbed("That's not a valid argument.", [], "- Modlog,\n- Welcome, \n- Roles"), 10);
        break;

    }

}
