const mongoose = require('mongoose')
const User = require('../models/user.model')
const Product = require('../models/product.model')
const Chat = require('../models/chat.model')
const Message = require('../models/message.model')


//////////  CREATE MESSAGE  //////////

module.exports.create = (req, res, next) => {
    const idChat = req.params.idChat
    const id = req.currentUser.id

    console.log(req.body)
    const message = new Message({
        message: req.body.message,
        user: id,
        chat: idChat
    })

    message.save()
        .then(() => {
            res.json(message)
        })
        .catch(next)
}



//////////  FIND ALL MESSAGE  //////////

module.exports.find = (req, res, next) => {
    const id = req.params.id

    Message.find({ user: id })
        .populate('message')
        .populate({
            path: 'message',
            populate: {
                path: 'user'
            }
        })
        then(messages => {
            res.json(messages)
        })
        .catch(next)
    }