const config = require('../../config.json');
const fs = require('fs');

module.exports = message => {

    message.content = message.content.trim();

    /* If The Message Author Is A Bot, Sends An Embed Or Dosen't Use The Prefix, Ignore It */
    if(message.author.bot || !message.content || !message.content.startsWith(config.prefix)) return;

    const args = message.content.slice(config.prefix.length).split(' ');
    const command = args.shift().toLowerCase();

    try {
        
        if(!fs.existsSync(`./services/commands/${command}.js`)) return;
        let commandFile = require(`../commands/${command}`);
        commandFile.run(client, message, args, config, chalk, fs, Discord);
        
    } catch (err) {error('Error running command \'' + command + '\': \n' + error.stack);}

    log(`${message.author.username}: [Command: ${command}] [Args: ${args.join(', ')}]`);
}