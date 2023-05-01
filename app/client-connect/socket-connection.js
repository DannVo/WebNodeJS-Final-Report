const localStorage = require('local-storage')
const MailContent = require('../models/MailContent')
const Account = require('../models/UserAccount')
const {getMessage} = require('../../socket')

async function connectServer(io) {
    let users = new Map()
    io.on('connection', async(socket) => {
        
        console.log('Socket connected: ',socket.id)

        getMessage(socket,io,users)
 
        socket.on('disconnect', () => {
            console.log('Client disconnected')
        })
    
         
    })
    
     
}
module.exports = {connectServer}