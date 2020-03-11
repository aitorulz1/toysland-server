const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const categories = require('../data/categories');

const productSchema = new Schema(
    {
        productPicture: {
            type: [String],
            // required: true,
            default: null
        },
        category: {
            type: String,
            required: true,
            enum: categories.map((c) => c.category),
            default: null
        },
         name: {
            type: String,
            required: true,
            maxlength: 30,
            default: null
        },
        description: {
            type: String,
            required: true,
            maxlength: 70,
            default: null
        },
        price: {
            type: Number,
            required: true,
            maxlength: 4,
            default: 0
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    },{
        timestamps: true,
        toObject: {virtuals: true },
        toJSON: {
            virtuals: true,
            transform: (doc, ret) => {
                ret.id = doc.id
                delete ret._id
                delete ret.__v
                return ret
            }
        }
    }
)


productSchema.pre('save', function (next) {
    next()
});

productSchema.virtual('chats', {
    ref: 'Chat',
    localField: '_id',
    foreignField: 'Product',
    justOne: false
});


productSchema.virtual('message', {
    ref: "Message",
    localField: '_id',
    foreignField: 'Product',
    justOne: false
});


productSchema.virtual('likes', {
    ref: "Like",
    localField: "_id",
    foreignField: 'product',
    justOne: false
});


const Product = mongoose.model('Product', productSchema);

module.exports = Product;