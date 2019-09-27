const express = require('express');
const favicon = require('serve-favicon')
const bodyParser = require('body-parser');

module.exports = (app, config) => {

    app.use(favicon(__dirname + '/web/media/favicon.ico'));

    app.get('/', (req, res) => {
        res.render(__dirname + "/web/pages/index.ejs", {botName: config.name});
    });

    app.get('/main.css', (req, res) => {
        res.render('/web/media/css/main.css')
    })

    app.listen(8080);
    
    log("Web Server Online!");

}