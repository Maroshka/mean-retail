var express = require('express');
var status  = require('http-status');

module.exports = function(wagner){
  var api = express.Router();

  api.get('/', function(req, res){
    res.status(200).json({status:200, text:"Hello, world!"});
  });
  api.get('/category/id/:id', wagner.invoke(function(Category){
    return function(req, res){
      Category.findOne({ _id : req.params.id}, handleRes.bind(null,'category', res));
    };
  }));
  api.get('/category/parent/:id', wagner.invoke(function(Category){
    return function(req, res){
      Category.find({ parent:req.params.id}).sort({_id:1}).exec(handleRes.bind(null, 'categories',res));
    };
  }));

  api.get('/product/id/:id', wagner.invoke(function(Product){
    return function(req, res){
      Product.findOne({_id: req.params.id}, handleRes.bind(null, 'product', res));
    };
  }));

  api.get('/product/category/:id', wagner.invoke(function(Product){
    return function(req, res){
      var sort = {name:1};
      Product.find({'category.ancestors':req.params.id}).sort(sort).exec(handleRes.bind(null, 'products', res));
    };
  }));
  return api;
};

function handleRes(key, res, error, result){
  if(error){
    return res.status(status.INTERNAL_SERVER_ERROR).json({error:error.toString()});
  }
  if(!result){
    return res.status(status.NOT_FOUND).json({error:key+' not found!'});
  }
  var json = {};
  json[key] = result;
  res.json(json);
}
