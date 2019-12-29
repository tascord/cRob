const commands = require('./_commands.json');

exports.run = (client, message, args, send, createEmbed, config, fs, Discord) => {

    if(!message.member.permissions.has(["MANAGE_MESSAGES"])) return send(createEmbed("You don't have the required permissions. [`MANAGE_MESSAGES`]"));

    var text = args.join(' ').trim();
    if(text.length < 1) return send(createEmbed("Please provide a message to send!"));
    if(text.length >= 2000) return send(createEmbed("Messages are restricted to 2000 characters!"));

    var embed = new Discord.RichEmbed()
        .setColor(config.colour)
        .setAuthor(message.guild.name, message.guild.iconURL)
        .setDescription(text);

    send(embed, 0);

}