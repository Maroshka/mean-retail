/**
 * Created by muna on 25/01/17.
 */
var mongoose = require('mongoose');
var Category = require('./category');
var fx       = require('./fx');

var productSchema = {
    name: {
        type: String,
        required: true
    },
    pictures: [
        {
            type:String,
            match: /^http:\/\//i
        }
    ],
    price: {
        amount:{
            type: Number,
            required: true,
            set: function(v){
                this.internal.approximatePriceUSD =
                    v / (fx()[this.price.currency] || 1);
                return v;
            }
        },
        currency:{
            type: String,
            enum: ['USD', 'JD'],
            required: true,
            set: function(v){
                this.internal.approximatePriceUSD =
                    this.price.amount/ (fx()[v] || 1);
                return v;
            }
        },
        category: Category.categorySchema,
        internal: {
            approximatePriceUSD: Number
        }

    }
};

var schema = new mongoose.Schema(productSchema);
var currencySymbols = {
    'USD': '$',
    'JD': 'JD'
};

schema.virtual('displayPrice').get(function(){
    return currencySymbols[this.price.currency]+' '+this.price.amount;
});

module.exports = new mongoose.Schema(productSchema);
module.exports.productSchema = productSchema;