const sm = require('../serverManager');

exports.run = (client, message, args, send, createEmbed, config, fs, Discord) => {

    console.log(sm.getServersByModify(message.author.id));
    //send(createEmbed("Bruh", [{title: "beans", data: "wazo"}]), 0);

}