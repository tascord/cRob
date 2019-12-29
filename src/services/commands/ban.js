const sm = require('../serverManager');

exports.run = (client, message, args, send, createEmbed, config, fs, Discord) => {

    if(!message.member.permissions.has(["BAN_MEMBERS"])) return send(createEmbed("You don't have the required permissions. [`BAN_MEMBERS`]"));

    var target = message.mentions.members.first();
    var reason = args.slice(1).join(' ') || `The ban hammer has spoken! 🔨`;
    
    if(!target) return send(createEmbed("Please mention a user to ban!"));
    if(args[0] != `<@!${target.id}>`) return send(createEmbed("Bad usage, <user> [reason]"));
    
    if(!target.bannable) return send(createEmbed("Sorry, I can't ban that user."));

    target.ban(`${reason}\n[Ban By: ${message.author.tag}]`);
    send(createEmbed(`Banned '${target.user.tag}' for '${reason}'`));
    
    sm.sendModMessage(client, message.guild.id, `**User Banned**\n\nUser: '${target.user.tag}' / ${target.id}\nReason: '${reason}\nBanned By: ${message.author}'`);

}