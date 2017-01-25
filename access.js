/**
 * Created by muna on 25/01/17.
 */
var mongoose = require('mongoose');
var userSchema = require('./user');

var User = new mongoose.model('User', userSchema);
