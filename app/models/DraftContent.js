const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Draft = new Schema({
    senderEmail:{type: String, maxlength:255, default:""},
    toEmail:{type: String, maxlength:255, default:""},
    ccEmail:{type: String, maxlength:255, default:""},
    bccEmail:{type: String, maxlength:255, default:""},
    title: {type:String, maxlength:255, default:""},
    text: {type:String, maxlength:255, default:""},
    file: [{
        source:{
            file: {type: Buffer, maxlength:255},
            filename: { type: String, maxlength:255},
            mimetype: { type: String, maxlength:255}
        }
    }],
    isDraft:{type:Boolean, default: true},
    isTrash:{type:Boolean, default:false}
    
}, {timestamps:true})

module.exports = mongoose.model('Draft', Draft)