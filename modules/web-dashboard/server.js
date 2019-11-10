const fs = require('fs');
const app = require('express')();
const favicon = require('serve-favicon')

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

const session = require('express-session');

const passport = require('passport');
const localStrategy = require('passport-local').Strategy;

const http = require('http').Server(app);
const io = require('socket.io')(http);

app.set("view-engine", "ejs");

module.exports = (config) => {

    //This is probably a terrible idea, but ill fix it later
    app.use(session({
        secret: config.token,
        saveUninitialized: true,
        resave: true
    }))
    
    var port = process.env.PORT || config.port || 8080;
    
    app.use(favicon(__dirname + '/media/favicon.ico'));

    var lod = "Login";

    app.get('*', (req, res) => {
        
        if(req.session) {}

        if(req.path.indexOf('/p/') > -1) {
            if(!fs.existsSync(`${__dirname}/media/${req.path.split('/')[2]}`)) return res.render(page("404"),  {botName: config.name, ldUrl: lod.toLowerCase(), ldLabel: lod});
            return res.sendFile(media('/css/main.css'));
        }

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
                lod = "Login"
                res.render(page("login"),  {botName: config.name, ldUrl: lod.toLowerCase(), ldLabel: lod});
                break;
                
            case "/register":
                lod = "Register"
                res.render(page("register"),  {botName: config.name, ldUrl: lod.toLowerCase(), ldLabel: lod});
            break;    

            default: 
                res.render(page("404"),  {botName: config.name, ldUrl: lod.toLowerCase(), ldLabel: lod});
            break

        }


    });

    app.post('/*', (req, res) => {

        switch(req.path) {

            case "/register":
                console.log(req.body);
                res.redirect("/login");
            break;

        }

    });


    http.listen(port, () => {
        log("Web Server Online!");
    });
    

    function page(pageName) {
        return `${__dirname}/pages/${pageName}.ejs`;
    }

    function media(mediaPath) {
        return `${__dirname}/media/${mediaPath}`;
    }

    var stats;
    var pings;
    var guilds;

    function refreshStats() {
        stats = JSON.parse(fs.readFileSync(`${__dirname}/stats.json`));
        
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

