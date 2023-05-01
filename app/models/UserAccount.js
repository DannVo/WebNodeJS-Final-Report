const { ObjectId } = require('bson');
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserAccount = new Schema({
    user_id: {type: String, maxLength:255, required: true},
    fullName:{
        firstName:{
            type: String, maxlength:255, required: true
        },
        lastName:{
            type: String, maxlength:255, required:true
        },
        fullName:{
            type: String, maxlength:255, default:''
        }
    },
    email: { type: String, maxLength:255, required: true},
    password: { type: String, maxLength:255, required: true},
    phoneNumber: {type: String, required: true},
    gender: { type: String, maxLength:255, default:''},
    avatar: {type: ObjectId, default:null, required:false},
    blockList: [{ type: String, maxLength:255}],
    idBlocked: [{ type: String, maxLength:255}],
    createAt: { type: Date, default: function () {
        const isoDate = new Date().toISOString()
        const formattedDate = isoDate.replace('T',' ').replace('Z',' ')
        return new Date(formattedDate)
    }, required: true
    },
})

module.exports = mongoose.model('UserAccount', UserAccount)