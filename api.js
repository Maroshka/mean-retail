var express = require('express');
var status  = require('http-status');

module.exports = function(wagner){
  var api = express.Router();

  api.get('/', function(req, res){
    res.status(200).json({status:200, text:"Hello, world!"});
  });
  api.get('/category/id/:id', wagner.invoke(function(Category){
    return function(req, res){
      Category.findOne({ _id : req.params.id}, function(error, category){
        if(error){
          return res.status(status.INTERNAL_SERVER_ERROR).json({error:error.toString()});
        }
        if(!category){
          return res.status(status.NOT_FOUND).json({error:'Not Found!'});
        }
        res.json({category:category});
      });
    };
  }));
  api.get('/category/parent/:id', wagner.invoke(function(Category){
    return function(req, res){
      Category.find({ parent:req.params.id}).sort({_id:1}).exec(function(error, categories){
        if(error){
          return res.status(status.INTERNAL_SERVER_ERROR).json({error:error.toString()});
        }
        if(!categories){
          return res.status(status.NOT_FOUND).json({error:'Not Found!'});
        }
        res.json({categories:categories});
      });
    };
  }));

  api.get('/product/id/:id', wagner.invoke(function(Product){
    return function(req, res){
      Product.findOne({name: req.params.id}, function(error, product){
        if(error){
          return res.status(status.INTERNAL_SERVER_ERROR).json({error:error});
        }
        if(!product){
          return res.status(status.NOT_FOUND).json({error:'Product not found!'});
        }
        res.json({product:product});
      });
    };
  }));

  api.get('/product/category/:id', wagner.invoke(function(Product){
    return function(req, res){
      var sort = {name:1};
      Product.find({'category.ancestors':req.params.id}).sort(sort).exec(function(error, products){
        if(error){
          return res.status(status.INTERNAL_SERVER_ERROR).json({error:error});
        }
        if(!products){
          return res.status(status.NOT_FOUND).json({error:'Products of the terget category were not found!'});
        }
        res.json({products:products});
      });
    };
  }));
  return api;
};
