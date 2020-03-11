const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('../models/user.model');
const Product = require('../models/product.model');

const likeSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: Product,
        required: true        
    }
}
);

const Like = mongoose.model('Like', likeSchema);

module.exports = Like;