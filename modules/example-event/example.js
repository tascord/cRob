config = {}; // Store an unpopulted version of the config object for use later.

/** 
 
 > Logging Tools 
 
 * info()   - Log data to console     - [+] (Cyan) 
 * Warn()  - Send warning to console - [~] (Magenta)
 * Error() - Send error to console   - [!] (Red)
   
**/


module.exports = {

    load: function(_config) {

        /**
        
        > Load Function

        This function runs when the module
        loads. It also runs when the module
        is reloaded, if there is no reload
        function. The module's .json file
        is the only variable that gets
        parsed throught the function.
        
        **/

        config = _config;
        info(`${config.name} v${config.version} loaded!`);
    },

    reload: function(_config) {

        /**
         
        > Reload Function

        Similar to the load function, this
        runs when a module gets reloaded.
        This means that there is no need to
        reload the entire bot to restart this
        module. Again, .json is parsed.

        **/

        config = _config;
        info(`${config.name} reloaded!`);
    },

    trigger: function(event) {

        /**
        
        > Trigger Function

        This function activates when the
        event or command specified in the
        .json is triggered. Event data is
        parsed through
        
        **/

        // warn('Hello World!');
    }

}