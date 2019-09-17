
/* Module Imports */
const Discord = require('discord.js');
const inquirer = require('inquirer');
const chalk = require('chalk');
const fs = require('fs');

/* Console Logging */
require('./services/console.js')(chalk);

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
            {type: 'password', name: 'token', message: 'What is my operating token?', validate: function(value) { if(value.length == 59) return true; else return 'That isn\'t a valid token, try again.'; }     }
        ]).then(answers => {
            var _answers = answers;
            
            if(_answers.activity_type == 'Watch') _answers.activity_type = "WATCHING";
            else if(_answers.activity_type == "Listen To") _answers.activity_type = "LISTENING";
            else _answers.activity_type = "PLAYING";
            
            fs.writeFileSync('./config.json', JSON.stringify(_answers, null, 4));
            init();
        });
    } else {
        log('Found config file, reading...');
        init();
    }
}

function init() {
    /* Load The Config File */
    const config = require('./config.json');
    log("Config file read & loaded!\n");

    /* Init & Login The Client */
    log('Logging in!\n\n')
    Client.login(config.token);
}

/* Client Events*/
const requireEvent = event => require(`./services/events/${event}.js`);
    
Client.on('ready', () => requireEvent('ready')(Client, chalk));
Client.on('reconnecting', () => requireEvent('reconnecting')(Client, chalk));
Client.on('disconnect', () => requireEvent('disconnect')(Client, chalk));
Client.on('message', requireEvent('message'));
Client.on('guildMemberAdd', requireEvent('guildMemberAdd'));
