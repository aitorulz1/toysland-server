const Product = require('../models/product.model');
const categories = require('../data/categories')
const Like = require('../models/like.model')

module.exports.base = (req, res, next) => {
    res.json({});
}


////////// SEARCH A PRODUCT //////////


module.exports.index = (req, res, next) => {

    const criteria = req.query.search ? { 
        product: new RegExp(req.query.search, "i")
    } : {}

    Product.find(criteria)
        .sort({createdAt: 1})
        .then(products => {
            res.json({message: "Estos son los productos", products})
        })
        .catch(next)
}


////////// CREATE A PRODUCT //////////


module.exports.create = (req, res, next) => {
    const {category, name, price, coin, description, user} = req.body
    // console.log('EL PUTOOOO BOYYYYYYYYY', req.body)

    const product = {
        category,
        name,
        price,
        coin,
        description,
        user, 
        productPicture: req.files ? req.files.map(file => file.url) : undefined,
    }

    Product.create(product)
        .then(product => {
            res.json(product)
        })
        .catch(next)
}



//////////  EDIT PRODUCT  //////////

module.exports.update = (req, res, next) => {
    const cardData = {
      title: req.body.title,
      position: req.body.position,
      description:  req.body.description,
      label: req.body.label
  }
    Card.findByIdAndUpdate(req.params.id, {
      $set: cardData
    }, {
      safe: true,
      upset: true,
      new: true
    })
    .then(card => {
      if (!card) {
        next(createError(404, 'Card not found'));
      } else {
        res.status(200).json(card)
      }
    })
    .catch(error => next(error));
  }


//////////  UPDATE PRODUCT  //////////


module.exports.updateProduct = (req, res, next) => {
    
    const id = req.params.id
    Product.findById(id)
        .then(product => {
            const newProduct = {...req.body, productPicture: req.file ? req.file.url : product.productPicture} // Los campos que hagopost. Todos.

            Product.findByIdAndUpdate(id, { $set: newProduct }, {
                safe: true,
                upset: true,
                new: true
              })
                .then(product => {
                    if(!product) {
                        res.status(400).json({message: "Product not found"})
                    }else{
                        console.log(product)
                        res.status(200).json(product)
                    }
                })
                .catch(next)
            })
            .catch(error => console.log(error))

            
}
       
    
//////////  FIND ALL PRODUCTS //////////


module.exports.find = (req, res, next) => {
    const product = req.params.id

    Product.find( { product } )
        .populate('likes')
        .then(product => {
            if(!product || product === null){
                res.redirect('/product/new')
            }else{
            res.status(200).json(product)
            }
        }) 
        .catch(next)
}



//////////  FIND A PRODUCT BY CATEGORY //////////


module.exports.listByCategory = (req, res, next) => {
    const category = req.params.category

    Product.find({ category: category })
 
        .then(productByCategory => {
            if(!category || category === null){
                res.status(400).json({message:"No products on this category"})
            }else{
            res.json(productByCategory)
            }
        }) 
        .catch(next)
}



//////////  FIND ONE PRODUCT BY ID //////////

module.exports.show = (req, res, next) => {
    const id = req.params.id

    Product.findById(id)
        .populate('user')
        .then(product => {
            res.json( product )
        }) 
        .catch(next)
}



//////////  FIND ALL CATEGORIES //////////

module.exports.listCategories = (req, res, next) => {
   res.json(categories)
}



//////////   LIKE  //////////

module.exports.like = (req, res, next) => {
    const params = ({product: req.params.id, user: req.currentUser.id})

    Like.findOne(params)
        .then(like => {
            if(like) {
                Like.findByIdAndRemove(like.id)
                .then(() => {
                    res.json({likes: -1})
                })
                .catch(next)
            } else {

                const like = new Like(params)

                like.save()
                    .then(() => {
                        res.json({likes: 1})
                    })
                    .catch(next)
            }
        })
        .catch(next)
}



//////////  CREATE LIKE  //////////


module.exports.createLike = (req, res, next) => {
    const idUser = req.params.idUser;
    const idProduct = req.params.idProduct;

    const like = {
        user: idUser,
        product: idProduct
    }

    Like.create(like)
        .then(like => {
            res.json(like)
        })
        .catch(next)
}


//////////  SHOW LIKE  //////////



module.exports.showLike = (req, res, next) => {
    const id = req.params.id


    Like.find({ user: id })
    .populate('product')
    .populate({
        path: 'product',
        populate: {
            path: 'user'
        }
    })
    .then(likes => {
        res.json(likes)
    })
    .catch(next)
}