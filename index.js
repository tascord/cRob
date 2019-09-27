//NTAzNDYxNjIyMjI1MDQzNDU2.XX9CXw.zEnF72AGYy_AAaY4-SUL6-nmsA0

/* Module Imports */
const Discord = require('discord.js');
const inquirer = require('inquirer');
const express = require('express');
const bcrypt = require('bcrypt');
const chalk = require('chalk');
const fs = require('fs');

/* Console Logging */
require('./services/console.js')(chalk);

/* Downloading Files */
require('./services/download.js')(fs);

/* Error Handling */
require('./services/errorhandler.js')();


/* Start The Program */
clear();
log('Welcome to cRob :]\n');
const Client = new Discord.Client();
preInit();

function preInit() {
    if(!fs.existsSync('./config.json')) {
        warn("No config file found, opening generation prompt...\n");
        inquirer.prompt([
            {name: 'name', message: 'What is my name?'},
            {name: 'prefix', message: 'What is my command prefix?'},
            {type: 'list', name: 'activity_type', message: 'My purpose is to ' + chalk.cyan('>... ') + '...', choices: ['Play', 'Listen To', 'Watch']},
            {name: 'activity', message: 'My purpose is to ... ' + chalk.cyan('>...')},
            {name: 'colour', message: 'What is my favourite '  + chalk.bold('HEX FORMATTED') + ' colour? (leave blank to default to blurple)'},
            {type: 'password', name: 'token', message: 'What is my operating token?', validate: function(value) { if(value.length == 59) return true; else return 'That isn\'t a valid token, try again.'; }     }
        ]).then(answers => {
            var _answers = answers;
            
            if(_answers.activity_type == 'Watch') _answers.activity_type = "WATCHING";
            else if(_answers.activity_type == "Listen To") _answers.activity_type = "LISTENING";
            else _answers.activity_type = "PLAYING";

            if(!_answers.colour) _answers.colour = '0x7289da';
            else(_answers.colour) = '0x' + _answers.colour;

            _answers.suppress = [];
            
            fs.writeFileSync('./config.json', JSON.stringify(_answers, null, 4));
            console.log('\n');
            log('Config file Generated!');
            init();
        });
    } else {
        log('Found config file, reading...');
        init();
    }
}

function init() {
    /* Load The Config File */
    const config = JSON.parse(fs.readFileSync('./config.json'));
    log("Config file read & loaded!\n");

    events();
    log('Loaded events!')

    /* Init & Login The Client */
    log('Logging in...\n')
    Client.login(config.token)
        .then(() => {log(`Logged in! [${chalk.magenta(Client.user.tag)}]`)})
        .catch(() => {error("Error logging in! Make sure the token is correct, and that you have a stable internet connection"); process.exit(1);});

    /* Start Web Server */
    log("Starting Web Server On Port 8080...");
    const app = express();
    app.set("view-engine", "ejs");
    require("./services/web.js")(app, config);
}

/* Client Events */
function events() {
    const requireEvent = event => require(`./services/events/${event}.js`);
        
    Client.on('ready', () => requireEvent('ready')(Client, chalk));
    Client.on('reconnecting', () => requireEvent('reconnecting')(Client, chalk));
    Client.on('disconnect', () => requireEvent('disconnect')(Client, chalk));
    Client.on('message', requireEvent('message'));
    Client.on('guildMemberAdd', requireEvent('guildMemberAdd'));
}