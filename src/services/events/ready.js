const config = require('../../../config.json');

const pti = require('png-to-ico');
const fs = require('fs');

const moment = require('moment');

module.exports = (Client, chalk) => {

    if(Client.user.username != config.name) Client.user.setUsername(config.name)
        .then(user => log('I have aquired my specified name. [' + chalk.magenta(user.username) + ']'))
        .catch(() => {error("Failed to set bot's name. Remember that this can only be changed twice every hour!")});

    Client.user.setActivity(config.activity, {type: config.activity_type});

    log("Loading custom modules...", true);
    loadModules();

    /* Set Web Server's Favicon To Bot Icon */
    log("Getting favicon for web server", true)
    download(Client.user.avatarURL, './src/services/web/media/favicon.png', function(){
        log('Favicon Downloaded. Converting...');
        pti('./src/services/web/media/favicon.png')
            .then(buf => {fs.writeFileSync('./src/services/web/media/favicon.ico', buf); log("Converted!")})
            .catch(err => {error(`Error converting favicon:\n${err.stack}`)});
    });

    /* Generate Personalized CSS */
    var colour = config.colour.replace("0x", "#");
    var newCSS = fs.readFileSync('./src/services/web/media/css/main-source.css').toString();

    if(colour != "#7289da") {
        while(newCSS.indexOf('#7289da') > -1) {
            newCSS = newCSS.replace("#7289da", colour);
        }
    }
    
    fs.writeFileSync('./src/services/web/media/css/main.css', newCSS);
    
    var stats;

    /* Stat Pushing */

    const pingStat = setInterval(() => {
        stats = JSON.parse(fs.readFileSync('./src/stats.json'));
        
        stats._times.push(moment().format("MMM Do HH:mm"));
        
        stats.ping.push(Math.trunc(Client.ping * 10) / 10);
        stats.guilds.push(Client.guilds.size);


        fs.writeFileSync('./src/stats.json', JSON.stringify(stats, null, 4));
    }, 5000);
    

}
