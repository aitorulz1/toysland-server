
const mongoose = require('mongoose');
const data = require('../data/categories');
const User = require('../models/user.model')

module.exports.base = (req, res, next) => {
    const users = req.params.id

    User.find().limit(3)
        .then(users => {
            res.json('index', { 
                title: 'Toys Land',
                categories: data,
                users
            });
        })
};

module.exports.results = (req, res, next) => {

    const criteria = req.params.search 
    ? {
        body: new RegExp(req.query.search, 'i')
    } 
    : {}
    
Product.find(criteria)
        .limit(10)
        .sort({createdAt: 1})
        .populate('user')
        .populate('product')
        .populate('messages')
        .then(products => {
            if(!products){
                res.status(400).json({message: "Chat not found"})   
            }else{
            res.json(products)
            }
        })
        .catch(next)
    }