module.exports = (chalk) => {
    
    log = function(text, nl) {

        if(nl == true) nl = '\n';
        else nl = '';
        
        console.log(nl + chalk.cyan('[+] ' + text));
    }

    error = function(text) {
        console.log(chalk.red('\n[!] ' + text + '\n'));
    }

    warn = function(text) {
        console.log(chalk.magenta('[️~] ' + text));
    }

    clear = function() {
        console.log("\033[2J")
    }

}