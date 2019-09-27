const config = require('../../config.json');
const pti = require('png-to-ico');
const fs = require('fs');

module.exports = (Client, chalk) => {

    if(Client.user.username != config.name) Client.user.setUsername(config.name)
        .then(user => log('I have aquired my specified name. [' + chalk.magenta(user.username) + ']'))
        .catch(() => {error("Failed to set bot's name. Remember that this can only be changed twice every hour!")});

    Client.user.setActivity(config.activity, {type: config.activity_type});

    /* Set Web Server's Favicon To Bot Icon */
    log("Getting favicon for web server")
    download(Client.user.avatarURL, './services/web/media/favicon.png', function(){
        log('Favicon Downloaded. Converting...');
        pti('./services/web/media/favicon.png')
            .then(buf => {fs.writeFileSync('./services/web/media/favicon.ico', buf); log("Converted!")})
            .catch(err => {error(`Error converting favicon:\n${err.stack}`)});
    });
}