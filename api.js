var express = require('express');
var status  = require('http-status');
var bodyparser = require('body-parser');
var _ = require('underscore');

module.exports = function(wagner){
  var api = express.Router();
  api.use(bodyparser.json());

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
  api.put('/me/cart',wagner.invoke(function(User){
    return function(req, res){
      try {
        var cart = req.body.data.cart;
      } catch (e) {
        return res.status(status.BAD_REQUEST).json({error:'No cart specified!'});
      }
      req.user.data.cart = cart;
      req.user.save(function(error, user){
        if(error){
          return res.status(status.INTERNAL_SERVER_ERROR).json({error:error.toString()});
        }
        res.json({usr:user});
      });
    };
  }));

  api.post('/checkout', wagner.invoke(function(User, Stripe){
    return function(req, res){
      if(!req.user){
        return res.status(status.UNAUTHORIZED).json({error:"You're un authorized to perform this action!"});
      }
      req.user.populate({path:'data.cart.product', model:'Product'}, function(error, user){
        var total = 0;
        _.each(user.data.cart, function(item){
          total += item.product.internal.approximatePriceUSD * item.quantity;
        });
        Stripe.charges.create({
          amount:Math.ceil(total*100),
          currency:'usd',
          source:req.body.stripeToken,
          description:"Example"
        },function(err, charge){
          if(err && err.type === 'StripeCardError'){
            return res.status(status.BAD_REQUEST).json({error:err.toString()});
          }

      if(err){
        return res.status(status.INTERNAL_SERVER_ERROR).json({error:err.toString()});
      }
      req.user.data.cart = [];
      req.user.save(function(){
        return res.json({id: charge.id});
      }
    );
  });

      });
    };
  }));

  api.get('/product/text/:query', wagner.invoke(function(Product){
    return function(req, res){
      Product.find({
        $text :{$search : req.params.query},
        score: {$meta : 'textScore'}
      }).sort({score : {$meta : 'textScore'}}). limit(10).exec(handleRes.bind(null, 'product', res))
    }
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
