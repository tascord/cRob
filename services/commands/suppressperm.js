exports.run = (client, message, args, send, createEmbed, config, fs, Discord) => {

    config.suppress.push(message.author.id);
    fs.writeFileSync('./config.json', JSON.stringify(config, null, 4));

    log(`Added ${message.author.id} to the permission suppress list`);
    send(createEmbed("I'll no longer bug you with permission error DM's"), 120);

}