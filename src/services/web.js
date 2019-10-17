const fs = require('fs');
const app = require('express')();
const favicon = require('serve-favicon')
const bodyParser = require('body-parser');

const http = require('http').Server(app);
const io = require('socket.io')(http);

app.set("view-engine", "ejs");

module.exports = (config) => {
    
    var port = process.env.PORT || config.port || 8080;
    
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

    http.listen(port, () => {
        log("Web Server Online!");
    });
    

    var stats;
    var pings;
    var guilds;

    function refreshStats() {
        stats = JSON.parse(fs.readFileSync('./src/stats.json'));
        
        times = stats._times;
        pings = stats.ping; 
        guilds = stats.guilds;

        while (times.length > 1000) {
            pings.shift();
            guilds.shift();
            times.shift();
        }

        io.emit('stats', [times, pings, guilds]);
    }

    setInterval(() => {refreshStats();}, 2500);
    refreshStats();

}