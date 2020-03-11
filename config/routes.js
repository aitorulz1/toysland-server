const express = require('express');
const router = express.Router();
const userRoutes = require('../controllers/user.controller')
const productRoutes = require('../controllers/product.controller')
const chatRoutes = require('../controllers/chat.controller')
const messageRoutes = require('../controllers/message.controller')
const controller = require('../controllers/base.controller')

const uploadCloud = require('../config/cloudinary.config')
const authMiddleware = require ('../middlewares/auth.middleware')



router.get('/') // Home

router.get('/results', authMiddleware.isAuthenticated, controller.results);

// User Login
router.post('/login', userRoutes.login)

// User New
router.post('/register', uploadCloud.single('profilePicture'), userRoutes.create) 

// User Profile
router.get('/users', authMiddleware.isAuthenticated, userRoutes.profile) 

// Get User Profile & UpDate 
router.patch('/users/:id', authMiddleware.isAuthenticated, uploadCloud.single('profilePicture'), userRoutes.updateUser) 


// Find All User
router.get('/allusers', userRoutes.findAll)



// Product New
router.post('/items/new', uploadCloud.array('productPicture', 6), productRoutes.create) 
router.patch('/items/:id', uploadCloud.single('productPicture'), productRoutes.updateProduct) 

// Products All
router.get('/items', productRoutes.find) 

// Products By Category
router.get('/categories', productRoutes.listCategories)
router.get('/categories/:category', productRoutes.listByCategory) 

// Product Get One By Click
router.get('/items/:id', productRoutes.show) 

// All Categories


// Like
router.get('/user/likes/:id', productRoutes.showLike)
router.post('/user/:idUser/like/:idProduct', productRoutes.createLike)


// Chat
router.post('/chats/user/:id/:idObj/:idProduct', chatRoutes.create)
router.get('/chats/:id', chatRoutes.show)
router.get('/chats/all/:id', chatRoutes.find)


// Message New
router.post('/messages/:idChat', messageRoutes.create)
router.get('/messages/:id', messageRoutes.find)



// LogOut
router.post('/logout', userRoutes.logout)


module.exports = router