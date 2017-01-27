/**
 * Created by muna on 25/01/17.
 */
var express = require('express');
var wagner = require('wagner-core');

module.exports = function(wagner){
  var app = express();

    app.get('/',function(req, res){
        res.send('Hello, world!');
    });
    app.get('/user/:user', function(req, res){
        res.send('Page for user '+req.params.user+' with option '+ req.query.option);
    });

    app.use(require('./api')(wagner));

    return app;
};
