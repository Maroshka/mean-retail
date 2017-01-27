var mongoose = require('mongoose');

module.exports = function(wagner){

  mongoose.connect('mongodb://localhost:27017/mean-retail');
  var Category = mongoose.model('Category', require('./category'), 'categories');

  wagner.factory('Category',function(){
    return Category;
  });

  // var User = mongoose.model('User', require('./user'), 'users');
  //
  // wagner.factory('User',function(){
  //   return User;
  // });

    // var Product = mongoose.model('Product', require('./product'), 'products');
    //
    // wagner.factory('Product',function(){
    //   return Product;
    // });

  return {
    Category:Category,
  };
};
