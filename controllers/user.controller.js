const User = require('../models/user.model')

module.exports.base = (req, res, next) => {
    res.json({});
}




//////////  REGISTER  //////////


module.exports.create = (req, res, next) => { 
    const {name, username, email, password, cp, product } = req.body // Destructuring. Extraigo de un objeto constantes -> req.body.name

    const user = { // Debe tener los campos required = true del modelo user o no, pero los required seguro
        name,      // name: req.body.name
        username,  // username: req.body.username
        email,     // email: req.body.email
        password,  // ...
        profilePicture: req.file ? req.file.url : 'https://res.cloudinary.com/aitorcloud/image/upload/v1582561602/toys-land/mrsmile_mmrkxx.png',
        cp,
        product: []

    }

    User.create(user)
        .then(user => {
            res.json({message: "User created"})
        })
        .catch(next)
}




//////////  LOGIN  //////////


module.exports.login = (req, res, next) => {
    const {email, password} = req.body

    if(!email || !password){
        return res.status(400).json({message: 'email and password required'})
    }

    User.findOne({email})
        .populate('product')
        .then(user => {
            if(!user) {
                res.status(404).json({message: 'User not found'})
            }else{
               return user.checkPassword(password)
                .then(match => {
                    if(match){
                        req.session.user = user
                        res.status(200).json(user)
                }else{
                    res.status(400).json({message: 'User not found'})
                }
                })
            }

        }).catch(next)
}




//////////  EDIT  //////////


module.exports.updateUser = (req, res, next) => {
    
    const id = req.currentUser.id
    const user = { ...req.body, profilePicture: req.file ? req.file.url : req.currentUser.profilePicture }
 
    User.findByIdAndUpdate(id, user, {new: true})
        .populate({
            path: 'product', // Mi producto
            populate: {
                path: 'user' // Siendo mi producto le meto mi ID de user para que se sepa los productos que me pertenece (relacionarlos)
            }
        })
        .then(user => {
            if(!user) {
                res.status(400).json({message: "User not found"})
            }else{
                req.session.user = user
                res.status(200).json(user)
            }
        }).catch(next)

    }




//////////  USERS PROFILE  //////////

module.exports.profile = (req, res, next) => {
    const id = req.currentUser.id

    User.findById(id)
        .populate('product')
        .populate({
            path: 'product', // Mi producto
            populate: {
                path: 'user', // Siendo mi producto le meto mi ID de user para que se sepa los productos que me pertenece (relacionarlos)
            }
        })
        .populate('likes')
        .populate({
            path: 'likes',
            populate: {
                path: 'product'
            }
        })
        .populate('chats') // Esto solo imprime los ids de users, el id de product y el id del propio chat
        .populate({         // Esto dentro de chat mete user
            path: 'chats',
            populate: {
                path: 'users'
            }
        })
        .populate({         // Esto dentro de chat mete product
            path: 'chats',
            populate: {
                path: 'product'
            }
        })
        .populate({
            path: 'chats',
            populate: {
                path: 'message'
            }
        })
        .then(user => {
            console.log('entra')
            res.json(user)
        })
        .catch(next)
    
}




//////////  CURRENTUSER  //////////


module.exports.find = (req, res, next) => {
    const user = req.params.id

    User.find( {user} )
    .populate('product')
    .populate({
        path: 'product', // Mi producto
        populate: {
            path: 'user' // Siendo mi producto le meto mi ID de user para que se sepa los productos que me pertenece (relacionarlos)
        }
    })
    .populate('likes')
    .populate({
        path: 'likes',
        populate: {
            path: 'product'
        }
    })
    .populate('chats') // Esto solo imprime los ids de users, el id de product y el id del propio chat
    .populate({         // Esto dentro de chat mete user
        path: 'chats',
        populate: {
            path: 'users'
        }
    })
    .populate({         // Esto dentro de chat mete product
        path: 'chats',
        populate: {
            path: 'product'
        }
    })
    .populate({
        path: 'chats',
        populate: {
            path: 'message'
        }
    })
        .then(user => {
            res.json(user)
        })
        .catch(next)

}



//////////  USERS ALL  //////////


module.exports.findAll = (req, res, next) => {

    User.find()
    .populate('product')
    .populate({
        path: 'product', // Mi producto
        populate: {
            path: 'user' // Siendo mi producto le meto mi ID de user para que se sepa los productos que me pertenece (relacionarlos)
        }
    })
    .populate('likes')
    .populate({
        path: 'likes',
        populate: {
            path: 'product'
        }
    })
    .populate('chats') // Esto solo imprime los ids de users, el id de product y el id del propio chat
    .populate({         // Esto dentro de chat mete user
        path: 'chats',
        populate: {
            path: 'users'
        }
    })
    .populate({         // Esto dentro de chat mete product
        path: 'chats',
        populate: {
            path: 'product'
        }
    })
    .populate({
        path: 'chats',
        populate: {
            path: 'message'
        }
    })
        .then(users => {
            res.json(users)
        })
        .catch(next)

}




//////////  LOGOUT  //////////


module.exports.logout = (req, res) => { 
    req.session.destroy();
    res.clearCookie('connect.sid') // Distroy cookie now
    res.json('You made it madafakaaa')
    res.redirect('/')
  }
