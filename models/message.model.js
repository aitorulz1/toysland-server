const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        chat: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Chat'
        },
        message: {
            type: String, 
            required: true        
        },
        date: {
            type: Date, 
            default: Date.now
        },
    }, {
        timestamps: true,
        toObject: { virtuals: true },
        toJSON: {
            virtuals: true,
            transform: (doc, ret) => {
                ret.id = doc.id
                delete ret._id
                delete ret.__v
                return ret
            }
        }
    });

    messageSchema.pre('save', function(next){
        next()
    })

  
    const Message = mongoose.model('Message', messageSchema);

    module.exports = Message;