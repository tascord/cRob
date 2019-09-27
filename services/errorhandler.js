module.exports = () => {

    process.on('uncaughtException', function(err) {

        switch (err.errno) {

            default: 
                error(`I didn't anticipate this!\nAn error (${err.name}) occoured without a handler. The error is as follows:\n${err.stack}`);
            break;

            case 'EADDRINUSE': 
                error("Error starting web server:\nSomething is already running on the port.");
            break;
        }

        process.exit(1);

    });   

}