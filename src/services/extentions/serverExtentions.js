const sm = require('../serverManager');

module.exports = {

    getServerData: function(serverID) {
        return sm.getServer(serverID);
    }, 

    modifyServer: function(serverID, server) {
        sm.modifyServer(serverID, server);
    },

    getServersByModUser: function(userID) {
        return sm.getServersByModify(userID);
    },

}