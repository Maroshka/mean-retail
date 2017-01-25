/**
 * Created by muna on 25/01/17.
 */
var mongoose = require('mongoose');
var Category = require('./category');

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
            required: true
        },
        currency:{
            type: String,
            enum: ['USD', 'JD'],
            required: true
        },
        category: Category.categorySchema

    }
};

module.exports = new mongoose.Schema(productSchema);
module.exports.productSchema = productSchema;