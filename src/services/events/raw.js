//Filesystem
const fs = require('fs');

//Custom Modules
require('../moduleHandler')(fs);

module.exports = event => {

    if(event.t == null) return;

    //Custom modules
    var module = getModuleFromEvent(event.t);
    if(module) {
        return require(`../../../modules${module.target}`).trigger(event);
    }

}