const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatSchema = new Schema(
    {
        users: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'         
        }],
        body: {
            type: String
        },

        image: {
            type: String, 
        },
        product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product'
        }
        
    },{
            timestamp: true,
            toObject: {
                    virtuals: true
                },
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


chatSchema.pre('save', function (next) {
    next()
});


chatSchema.virtual('messages', {
    ref: 'Message',
    localField: '_id',
    foreignField: 'chat',
    justOne: false,    
});

chatSchema.virtual('likes', {
    ref: 'Likes',
    localField: '_id',
    foreignField: 'chat',
    justOne: false
});

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;