/**
 * Created by muna on 25/01/17.
 */
var assert     = require('assert');
var superagent = require('superagent');
var express    = require('express');
var wagner     = require('wagner-core');
// var models     = require('./models')(wagner);
var URL_ROOT   = 'http://localhost:3000';

describe('Category API', function(){
  var server;
  var Category;
  var Product;
  before(function(){
    var app = express();

    var models = require('./models')(wagner);
    app.use(require('./api')(wagner));
    server = app.listen(3000);

    Category = models.Category;
    Product = models.Product;
  });

  after(function(){
    server.close();
  });

  beforeEach(function(done){
    Category.remove({}, function(error){
        assert.ifError(error);
        Product.remove({}, function(error){
          assert.ifError(error);
          done();
        });
    });
  });

  it('tests the /category/id/:id subrouter', function(done){
    Category.create({_id:'kuku'}, function(error, doc){
      assert.ifError(error);
      var url = URL_ROOT + '/category/id/kuku';
      superagent.get(url, function(error, res){
        assert.ifError(error);
        var result;
        // assert.equal(res.status, 200);
        assert.doesNotThrow(function(){
          result = JSON.parse(res.text);
        });
        assert.ok(result.category);
        assert.equal(result.category._id, 'kuku');
        done();
        });
    });
  });

  it('tests the subroute /category/parent/Electronics', function(done){
    var categories = [
      {_id:'Electronics'},
      {_id:'Laptops', parent:'Electronics'},
      {_id:'Phones', parent:'Electronics'},
    ];
    Category.create(categories, function(error, doc){
      assert.ifError(error);
    });
    var url = URL_ROOT + '/category/parent/Electronics';
    superagent.get(url, function(error, res){
      assert.ifError(error);
      var result;
      assert.doesNotThrow(function(){
        result = JSON.parse(res.text);
      });
      assert.ok(result.categories);
      assert.equal(result.categories.length,2);
      done();
    });
  });

  it('the /product/id/:id route works properly', function(done){
    var PRODUCT_ID = '000000000000000000000001';
    var product = {
        name: 'LG G4',
        _id: PRODUCT_ID,
        price: {
          amount: 300,
          currency: 'USD'
        }
      };
    Product.create(product, function(error, product){
      assert.ifError(error);
      var url = URL_ROOT + '/product/id/'+PRODUCT_ID;
      superagent.get(url, function(error, res){
        assert.ifError(error);
        var result;
        assert.doesNotThrow(function(){
          result = JSON.parse(res.text);
        });
        assert.ok(result.product);
        assert.equal(result.product.name, 'LG G4')
        done();
      });
    });
  });

  it('checks if the route /product/category/:id works properlys', function(done){
    var products = [
      {
        name: 'LG G4',
        category: { _id: 'Phones', ancestors: ['Electronics', 'Phones'] },
        price: {
          amount: 300,
          currency: 'USD'
        }
      },
      {
        name: 'Asus Zenbook Prime',
        category: { _id: 'Laptops', ancestors: ['Electronics', 'Laptops'] },
        price: {
          amount: 2000,
          currency: 'USD'
        }
      },
      {
        name: 'Flying Pigs Farm Pasture Raised Pork Bacon',
        category: { _id: 'Bacon', ancestors: ['Bacon'] },
        price: {
          amount: 20,
          currency: 'USD'
        }
      }
    ];

    Product.create(products, function(error, products){
      assert.ifError(error);
      var url = URL_ROOT + '/product/category/Laptops';
      superagent.get(url, function(req, res){
        var result;
        assert.doesNotThrow(function(){
          result = JSON.parse(res.text);
        });
        assert.equal(result.products.length,1);
        assert.equal(result.products[0].name, 'Asus Zenbook Prime');
        done();
      });
    });
  });
});
