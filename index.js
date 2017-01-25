/**
 * Created by muna on 25/01/17.
 */
var mongoose = require('mongoose');
var server = require('./server');
//mongoose.connect('mongodb://localhost:27017/mean-retail');
server().listen(3000);
console.log('Listening on port 3000...');