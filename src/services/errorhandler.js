module.exports = (statsJson, fs) => {

    process.on('uncaughtException', function(err) {

        console.log(err.message)

        if      (eHas('src/stats.json'))        {warn('No stats file found, creating..'); fs.writeFileSync('./src/stats.json', JSON.stringify(statsJson, null, 4)); log('Stats file created, please restart\n', true);}
        else if (eHas('Cannot find module'))    error(`Sorry, you appear to not have all the modules installed.\nPlease run 'npm i' to make sure all your modules are up to date!\n\n[Missing Module: '${err.message.split('\'')[0]}']`)
        else if (eHas('EADDRINUSE'))            error(`Error starting web server:\nSomething is already running on the port.`);
        else                                    error(`I didn't anticipate this!\nAn error occoured without a handler. The error is as follows:\n${err.stack}`);
        
        process.exit(1);

        function eHas(errorName) {
            if(err.message.indexOf(errorName) > -1) return true;
            else return false;
        }

    });   


}