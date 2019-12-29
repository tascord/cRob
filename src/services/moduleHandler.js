const fs = require('fs');

var events = [];
var commands = [];

module.exports = {

    loadModules: function(client, clientConfig) {

        if(!fs.existsSync('./modules')) return info('No modules installed, skipping!');

        var modulesContents = fs.readdirSync('./modules');
        const ce = require('./extentions/constantExtentions');

        for(var i in modulesContents) {

            if(fs.lstatSync(`./modules/${modulesContents[i]}`).isDirectory()) {
                
                if(!fs.existsSync(`./modules/${modulesContents[i]}/${modulesContents[i]}.json`)) {warn(`Module '${modulesContents[i]}' dosen't have a json file attached. Skipping load.`); continue;}
                try{var moduleConfig = JSON.parse(fs.readFileSync(`./modules/${modulesContents[i]}/${modulesContents[i]}.json`).toString()); } catch (err) {warn(`Module '${modulesContents[i]}' dosen't have a valid json file. Skipping load. (${err.message})`); continue;}
            
                if(!moduleConfig.name || !moduleConfig.type || !moduleConfig.target) {warn(`Module '${modulesContents[i]}' dosen't have a valid json file. Skipping load. (Missing name, type or target)`); continue;}
                else if(moduleConfig.type != "constant" && !moduleConfig.command && !moduleConfig.event) {warn(`Module '${modulesContents[i]}' dosen't have a valid json file. Skipping load. (Missing module type)`); continue;}
                else if(moduleConfig.type != "command" && moduleConfig.type != "event" && moduleConfig.type != "constant") {warn(`Module '${modulesContents[i]}' dosen't have a valid json file. Skipping load. (Invalid module type)`); continue;}
                else if(moduleConfig.type == "command" && !moduleConfig.usage) {warn(`Module '${modulesContents[i]}' dosen't have a valid json file. Skipping load. (Missing command usage)`); continue;}
                else if(!fs.existsSync(`./modules/${modulesContents[i]}/${moduleConfig.target}`)) {warn(`Module '${modulesContents[i]}' target ('${moduleConfig.target}') dosen't exist`); continue;}

                try {
                    if(moduleConfig.type == "command") {
                        var module = require(`../../modules/${modulesContents[i]}/${moduleConfig.target}`);
                        commands.push({name: moduleConfig.name, target: `/${modulesContents[i]}/${moduleConfig.target}`, command: moduleConfig.command, description: moduleConfig.description, usage: moduleConfig.usage});
                        module.load(moduleConfig);
                    }
                    
                    else if(moduleConfig.type == "event") {
                        var module = require(`../../modules/${modulesContents[i]}/${moduleConfig.target}`);
                        events.push({name: moduleConfig.name, target: `/${modulesContents[i]}/${moduleConfig.target}`, event: moduleConfig.event});
                        module.load(moduleConfig);
                    } 

                    else if(moduleConfig.type == "constant") {
                        var module = require(`../../modules/${modulesContents[i]}/${moduleConfig.target}`);
                        module.load(moduleConfig, clientConfig, client, ce);
                    }
                                       
                 } catch (err) {
                    return warn(`Error instantiating module '${modulesContents[i]}':\n${err.stack}`);
                }

            }
        }

    },

    getModuleFromCommand: function(command) {
        for(var i in commands) {
            if(commands[i].command == command) return commands[i];
        }
        return false;
    },

    getModuleFromEvent: function(event) {
        for(var i in events) {
            if(events[i].event == event) return events[i];
        }
        return false;
    },

    getCommands: function() {
        if(!commands[0]) return false;
        else return commands;
    },

    getEvents: function() {
        if(!events[0]) return false;
        else return events;
    }

}