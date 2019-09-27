const commands = require('./_commands.json');

exports.run = (client, message, args, send, createEmbed, config, fs, Discord) => {

    if(!message.guild.me.permissions.has(["MANAGE_MESSAGES"])) return send(createEmbed("I don't have the permission required. [`MANAGE_MESSAGES`]"));
    
    if(!args[0]) args[0] = 25;
    if(isNaN(args[0])) return send(createEmbed(`'${args[0]}' isn't a valid number`));
    if(args[0] > 100 || args[0] < 1) return send(createEmbed(`'${args[0]}' isnt within range [1 - 100]`));
    
    if(!message.member.permissions.has(["MANAGE_MESSAGES"])) return send(createEmbed("You don't have the required permissions. [`MANAGE_MESSAGES`]"))

    message.delete();
    message.channel.bulkDelete(args[0]).then(() => {
        send(createEmbed(`Deleted ${args[0]} messages`), 10);
    }).catch(err => {
        if(err.stack.indexOf("14 days old.") > -1) return send(createEmbed("I can only delete messages newer than 14 days old. Try lowering your message count."), 20);
    });

}