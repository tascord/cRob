const sm = require('../serverManager');

exports.run = (client, message, args, send, createEmbed, config, fs, Discord) => {

    if(!message.member.permissions.has(["KICK_MEMBERS"])) return send(createEmbed("You don't have the required permissions. [`KICK_MEMBERS`]"));

    var target = message.mentions.members.first();
    var reason = args.slice(1).join(' ') || `The kick foot has kicked? 🦶`;
    
    if(!target) return send(createEmbed("Please mention a user to kick!"));
    if(args[0] != `<@!${target.id}>`) return send(createEmbed("Bad usage, <user> [reason]"));
    
    if(!target.kickable) return send(createEmbed("Sorry, I can't kick that user."));

    target.kick(`${reason}\n[Kick By: ${message.author.tag}]`);
    send(createEmbed(`Kicked '${target.user.tag}' for '${reason}'`));
    
    sm.sendModMessage(client, message.guild.id, `**User Kicked**\n\nUser: '${target.user.tag}' / ${target.id}\nReason: '${reason}\nKicked By: ${message.author}'`);

}