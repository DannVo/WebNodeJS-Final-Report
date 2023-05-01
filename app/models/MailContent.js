const { ObjectId } = require('bson');
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Message = new Schema({
    sender:{type: ObjectId, required: true},
    receiver:[{type: ObjectId, required: true}],
    sendType:{type:Number, required:true}, //send one person, use cc, use bcc
    title: {type:String, maxlength:255, required:true},
    text: {type:String, maxlength:255},
    file: [{
        type: ObjectId,
    }],
    isDraft:{type:Boolean, default: false},
    isTrash:{type:Boolean, default:false}
    
}, {timestamps:true})

const clients = {}

Message.post('save', (doc) => {
    Object.keys(clients).forEach((receiverID) => {
      if(receiverID === doc.receiver){
        const socketId = clients[receiverID]
        const io = require('../../socket').getIO().to(socketId)
        io.emit('message', doc)
      }  
    })
})

Message.static.connectClient = (socket, receiverID) => {
    clients[receiverID] = socket.id
    console.log(`Client connected with receiver ID ${receiverID}`)
}
module.exports = mongoose.model('Message', Message)