module.exports = (chalk) => {
    
    info = function(text, nl) {

        if(nl == true) nl = '\n';
        else nl = '';
        
        console.info(nl + chalk.cyan('[+] ' + text));
    }

    error = function(text) {
        console.info(chalk.red('\n[!] ' + text + '\n'));
    }

    warn = function(text) {
        console.info(chalk.magenta('\n[️~] ' + text));
    }

    clear = function() {
        console.info("\033[2J")
    }

}