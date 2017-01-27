/**
 * Created by muna on 25/01/17.
 */
var mongoose = require('mongoose');
var wagner = require('wagner-core');
var models = require('./models')(wagner);

var app = require('./server')(wagner);
app.listen(3000);

console.log('Listening on port 3000...');
