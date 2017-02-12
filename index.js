/**
 * Created by muna on 25/01/17.
 */
var mongoose = require('mongoose');
var wagner = require('wagner-core');
require('./dependencies')(wagner);
var app = require('./server')(wagner);
// wagner.invoke(require('./auth'), {app:app});
app.listen(3000);

console.log('Listening on port 3000...');
