/* Module Import */
const fs = require('fs');
const moment = require('moment');
const pti = require('png-to-ico');

/* Unpopulated Objects */
var config = {};
var client = {};
var stats  = [];

module.exports = {
    load: function(moduleConfig, botConfig, botClient) {
        config = botConfig;
        client = botClient;
        runServer();
    }
}

function runServer() {
    createCss();
    startStats();
    createFavicon();
}

function createFavicon() {
    /* Download The Bots Icon, Then Make It The Dashboard's Favicon */
    download(client.user.avatarURL, `${__dirname}/media/favicon.png`, function(){
        pti(`${__dirname}/media/favicon.png`)
            .then(buf => {fs.writeFileSync(`${__dirname}/media/favicon.ico`, buf); startServer();})
            .catch(err => {warn(`Error converting favicon for web server:\n${err.stack}`)});
    });
}

function createCss() {
    /* Generate Personalized CSS */
    var colour = config.colour.replace("0x", "#");
    var newCSS = fs.readFileSync(`${__dirname}/media/css/main-source.css`).toString();

    if(colour != "#7289da") {
        while(newCSS.indexOf('#7289da') > -1) {
            newCSS = newCSS.replace("#7289da", colour);
        }
    }
}

function startStats() {
    /* Make A Stats File If None Exists */
    if(!fs.existsSync(`${__dirname}/stats.json`)) fs.writeFileSync(`${__dirname}/stats.json`, JSON.stringify(`{"_times": [], "guilds": [], "ping": [] }`, null, 4));

    /* Stat Pushing Stats */
    setInterval(() => {
        stats = JSON.parse(fs.readFileSync(`${__dirname}/stats.json`));
        
        stats._times.push(moment().format("MMM Do HH:mm"));
        
        stats.ping.push(Math.trunc(client.ping * 10) / 10);
        stats.guilds.push(client.guilds.size);


        fs.writeFileSync('./src/stats.json', JSON.stringify(stats, null, 4));
    }, 5000);
}

function startServer() {
    //Start The Server
    require('./server')(config);
}