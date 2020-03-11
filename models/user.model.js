const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const SALT_FACTOR = 10
const Product = require('./product.model')
const Message = require('./message.model')

const EMAIL_PATTERN = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

const userSchema = new Schema(
    {   
        name: {
            type: String,
            required: true,
            minlength: 3,
            default: null
        },

        email: {
            type: String,
            required: true,
            minlength: 5,
            default: null,
            match: EMAIL_PATTERN
        },
        username: {
            type: String,
            required: true,
            minlength: 5,
            default: null
        },
        age: {
            type: Number,
            min: 18,
            default: null
        },
        profilePicture: {
            type: String,
            default: 'https://res.cloudinary.com/aitorcloud/image/upload/v1582561602/toys-land/mrsmile_mmrkxx.png'
        },
        password: {
            type: String,
            required: true,
            minlength: 5,
            default: null
        },
        cp: {
            type: String,
            minlength: 5,
            maxlength: 5,
            default: null
        },
        city: {
            type: String,
            default: null
        },
        country: {
            type: String,
            default: null
        }
    },{
        timestamps: true,
        toObject: {virtuals: true },
        toJSON: {
            virtuals: true,
            transform: (doc, ret) => {
                ret.id = doc.id;
                delete ret._id;
                delete ret.__v;
                delete ret.password;
                return ret;
            }
        }
    }
);

userSchema.virtual('product', {
    ref: Product.modelName,
    localField: '_id',
    foreignField: 'user',
    justOne: false
});

userSchema.virtual('chats', {
    ref: 'Chat',
    localField: '_id',
    foreignField: 'users',
    justOne: false
});

userSchema.virtual('message', {
    ref: Message.modelName,
    localField: '_id',
    foreignField: 'User',
    justOne: false
});


userSchema.virtual('likes', {
    ref: "Like",
    localField: "_id",
    foreignField: 'user',
    justOne: false
});







userSchema.pre('save', function (next){
    const user = this

    if(user.isModified('password')){
        bcrypt.genSalt(SALT_FACTOR)
        .then(salt => {
            return bcrypt.hash(user .password, salt)
            .then(hash => {
                user.password = hash
                next()
            })
        }).catch(next)
    }
})



userSchema.methods.checkPassword = function(password) {
    return bcrypt.compare(password, this.password)
}

const User = mongoose.model('User', userSchema);

module.exports = User

// 1. Llamo las dependencias que me harán falta: mongoose, SCHEMA, bcrypt para el password y SALT_FACTOR para complicar a este grado el password
// 2. Creo el modelo de user: name, username, password, profilePic, edad y email. Declaro todos en null por defecto y cuáles son requeridos y su tipo
// 3. timestamps: true -> Me pintará en el jason la hora a la que fue creado y actualizado
// 4. toJSON -> Modifico el campo "_id" por "id" y declaro lo que no quiero que me muestre en el json: "__v" y password
// 5. userSchema.pre('save', function (next) -> Middleware que hace que una función se ejecute (save), después de realizar ciertas comprobaciones
// 6. hacemos checkPasswrod del hasheado con el q corresponde al password que ha insertado el usuario
// 7. Exportamos el modelo User