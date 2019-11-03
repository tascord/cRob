const fs = require('fs');
const app = require('express')();
const favicon = require('serve-favicon')

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

const http = require('http').Server(app);
const io = require('socket.io')(http);

app.set("view-engine", "ejs");

module.exports = (config) => {
    
    var port = process.env.PORT || config.port || 8080;
    
    app.use(favicon(__dirname + '/web/media/favicon.ico'));

    var lod = "Login";

    app.get('*', (req, res) => {
        
        if(req.session) {}

        switch(req.path) {
            case "/":
                res.render(page("index"),  {botName: config.name, ldUrl: lod.toLowerCase(), ldLabel: lod});
            break;

            case "/about": 
                res.render(page("about"),  {botName: config.name, ldUrl: lod.toLowerCase(), ldLabel: lod});
            break;

            case "/stats": 
                res.render(page("stats"),  {botName: config.name, ldUrl: lod.toLowerCase(), ldLabel: lod, times: times, pingData: pings, guildData: guilds});
            break;

            case "/login":
                res.render(page("login"),  {botName: config.name, ldUrl: lod.toLowerCase(), ldLabel: lod});
                break;
                
            case "/register":
                lod = "Register"
                res.render(page("register"),  {botName: config.name, ldUrl: lod.toLowerCase(), ldLabel: lod});
            break;    

            case "/main.css": 
                res.sendFile(media("css/main.css"));
            break;

            default: 
                res.render(page("404"),  {botName: config.name, ldUrl: lod.toLowerCase(), ldLabel: lod});
            break

        }


    });

    app.post('/*', (req, res) => {

        switch(req.path) {

            case "/login":
                console.log(req.body);

                res.redirect("/login");
            break;

        }

    });


    http.listen(port, () => {
        log("Web Server Online!");
    });
    

    function page(pageName) {
        return `${__dirname}/web/pages/${pageName}.ejs`;
    }

    function media(mediaPath) {
        return `${__dirname}/web/media/${mediaPath}`;
    }

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

// Database For User Criedentials
const bcrypt = require('bcryptjs');

