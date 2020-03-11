const Chat = require('../models/chat.model')

module.exports.find = (req, res, next) => {
    const criteria = req.params.search 
    ? {
        body: new RegExp(req.query.search, 'i')
    } 
    : {}

    Chat.find(criteria)
        .limit(10)
        .sort({createdAt: 1})
        .populate('user')
        .populate('product')
        .populate('messages')
        .then(chats => {
            if(!chats){
                res.status(400).json({message: "Chat not found"})   
            }else{
            res.json(chats)
            }
        })
        .catch(next)
}

module.exports.findOne = (req, res, next) => {
    
    Chat.findOne({users: {$in: [req.currentUser.id]}}, {product: {itemId}})
        .populate('product')
        .populate({
            path: 'product',
            populate: {
                path: 'user'
            }
        })
        .populate('user')
        .populate('messages')
        .then(chat => {
            if(!chat) {
                Chat.create(chat)
            }else{
                res.json(chat)
            }         
        })
}



module.exports.show = (req, res, next) => {
    const id = req.params.id
   
    Chat.findOne({ users: { "$in" : [req.currentUser.id]}, product: id })
    .populate('product')
    .populate({
        path: 'product',
        populate: {
            path: 'user'
        }
    })
    .populate('users')
    .populate('messages')
    .populate('product')
    .populate({
        path: 'product',
        populate: {
            path: 'user'
        }
    })
    .then(chat => {
        console.log({ chat })
        if(chat) {
            res.json(chat)
        }else{
            res.json({message: 'Chat not found'})

            //lanzar un 404
        }
    })
    .catch(next)
}


//////////  CREATE CHAT //////////


module.exports.create = (req, res, next) => {
    const idUser = req.params.id
    const idObj = req.params.idObj
    const idProduct = req.params.idProduct


    const chat = new Chat({
        users: [idUser, idObj],
        product: idProduct,
        body: req.body.body,
        image: req.body.image
    })

    chat.save()
        .then((chat) => {
            res.json(chat)
        })
        .catch(next)
}



//////////  FIND ALL CHATS //////////


module.exports.find = (req, res, next) => {
    const id = req.currentUser.id

    Chat.find( { users: id } ) 
        .populate('product')
        .populate({
            path: 'product',
            populate: {
                path: 'user'
            }
        })
        .populate('users')
        .populate('messages')       
        .then(chats => {
            if(!chats || chats === null){
                res.json({message: 'Todvía no has iniciado ningún chat'})
            }else{                
            res.json(chats)
            }
        }) 
        .catch(next)
}