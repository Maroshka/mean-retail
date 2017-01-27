/**
 * Created by muna on 25/01/17.
 */
var assert     = require('assert');
var superagent = require('superagent');
var express    = require('express');
var wagner     = require('wagner-core');
// var models     = require('./models')(wagner);
var URL_ROOT   = 'http://localhost:3000';

// describe('Category API', function(){
//   var server;
//   var Category;
//   before(function(){
//     var app = express();
//
//     var models = require('./models')(wagner);
//     app.use(require('./api')(wagner));
//     server = app.listen(3000);
//
//     Category = models.Category;
//   });
//
//   after(function(){
//     server.close();
//   });
//
//   beforeEach(function(done){
//     Category.remove({}, function(error){
//         assert.ifError(error);
//         done();
//     });
//   });
//
//   it('tests the /category/id/:id subrouter', function(done){
//     Category.create({_id:'kuku'}, function(error, doc){
//       assert.ifError(error);
//       var url = URL_ROOT + '/category/id/kuku';
//       superagent.get(url, function(error, res){
//         assert.ifError(error);
//         var result;
//         // assert.equal(res.status, 200);
//         assert.doesNotThrow(function(){
//           result = JSON.parse(res.text);
//         });
//         assert.ok(result.category);
//         assert.equal(result.category._id, 'kuku');
//         done();
//         });
//     });
//   });
//
//   it('tests the subroute /category/parent/Electronics', function(done){
//     var categories = [
//       {_id:'Electronics'},
//       {_id:'Laptops', parent:'Electronics'},
//       {_id:'Phones', parent:'Electronics'},
//     ];
//     Category.create(categories, function(error, doc){
//       assert.ifError(error);
//     });
//     var url = URL_ROOT + '/category/parent/Electronics';
//     superagent.get(url, function(error, res){
//       assert.ifError(error);
//       var result;
//       assert.doesNotThrow(function(){
//         result = JSON.parse(res.text);
//       });
//       assert.ok(result.categories);
//       assert.equal(result.categories.length,2);
//       done();
//     });
//   });
// });

describe('Product API', function(){
  var server;
  var Product;
  before(function(){
    var app = express();
    models = require('./models')(wagner);
    app.use(require('./api')(wagner));
    server = app.listen(3000);
    Product = models.Product;
  });
  after(function(){
    server.close();
  });
  beforeEach(function(){
    Product.remove({}, function(error){
      assert.ifError(error);
    });
  });
  var PRODUCT_ID = '000001';
  var product = {
      name: 'LG G4',
      _id: PRODUCT_ID,
      price: {
        amount: 300,
        currency: 'USD'
      }
    };
  it('the /product/id/:id route works properly', function(done){
    Product.create(product, function(error, product){
      assert.ifError(error);
      var url = URL_ROOT + '/product/id/'+PRODUCT_ID;
      // superagent.get(url, function(error, res){
      //   assert.ifError(error);
      //   var result;
      //   assert.doesNotThrow(function(){
      //     result = JSON.parse(res.text);
      //   });
      //   assert.ok(result.product);
      //   assert.equal(result.product.name, 'kuku')
      // });
      done();
    });
  });
});
