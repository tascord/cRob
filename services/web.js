const express = require('express');
const favicon = require('serve-favicon')
const bodyParser = require('body-parser');
const fs = require('fs');

module.exports = (app, config) => {

    app.use(favicon(__dirname + '/web/media/favicon.ico'));

    app.get('/', (req, res) => {
        res.render(__dirname + "/web/pages/index.ejs", {botName: config.name});
    });

    app.get('/about', (req, res) => {
        res.render(__dirname + "/web/pages/about.ejs", {botName: config.name});
    });

    app.get('/stats', (req, res) => {
        res.render(__dirname + "/web/pages/stats.ejs", {botName: config.name, times: times, pingData: pings, guildData: guilds});
    });

    app.get('/login', (req, res) => {
        res.render(__dirname + "/web/pages/login.ejs", {botName: config.name});
    });

    app.get('/main.css', (req, res) => {
        res.sendFile(__dirname + '/web/media/css/main.css');
    });

    app.listen(8080);
    
    log("Web Server Online!");

    var stats;
    var pings;
    var guilds;

    function refreshStats() {
        stats = JSON.parse(fs.readFileSync('./stats.json'));
        
        times = stats._times;
        pings = stats.ping; 
        guilds = stats.guilds;

        while (times.length > 1000) {
            pings.shift();
            guilds.shift();
            times.shift();
        }
    }

    refreshStats();
    setInterval(() => {refreshStats();}, 5000);

}