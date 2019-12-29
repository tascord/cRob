module.exports = fs => {

    process.on('uncaughtException', function(err) {

        console.info(err.message)

        if (eHas('Cannot find module'))         error(`Sorry, you appear to not have all the modules installed.\nPlease run 'npm i' to make sure all your modules are up to date!\n\n[Missing Module: '${err.message.split('\'')[0]}']`)
        else                                    error(`I didn't anticipate this!\nAn error occoured without a handler. The error is as follows:\n${err.stack}`);
        
        process.exit(1);

        function eHas(errorName) {
            if(err.message.indexOf(errorName) > -1) return true;
            else return false;
        }

    });   


}