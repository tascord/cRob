const config = require('../../config.json');

module.exports = (Client, chalk) => {
    log('Logged in! [' + chalk.magenta(Client.user.tag) + ']');

    if(Client.user.username != config.name) Client.user.setUsername(config.name)
        .then(user => log('I have aquired my specified name. [' + chalk.magenta(user.username) + ']'))
        .catch(error("Failed to set bot's name. Remember that this can only be changed twice every hour!"));
}