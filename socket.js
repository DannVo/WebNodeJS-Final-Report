const localStorage = require('local-storage')
const MailContent = require('./app/models/MailContent')
const Account = require('./app/models/UserAccount');
const { ObjectId } = require('bson');
const {ID2Email} = require('./routes/middlewares/convertID2Email')
const {getAllDate} = require('./routes/middlewares/convertAllDate')


function getRoomName(email1, email2) {
    const sortedEmails = [email1, email2].sort();
    return sortedEmails.join('-');
}

async function getMessage(socket,io,users) {
    try{
        const { email } = socket.handshake.query;
        users.set(email, socket.id);   
        socket.on('fetch-msg', async (email) => {        
            const receiverEmail = localStorage.get('receiverEmail') || ''
            const getID = await Account.findOne({email: email}).select('_id');
            const sendReceiver = {
                $or: [
                    { sender: getID._id },
                    { receiver: { $in: [getID._id] } }
                ]
            };
            
            const messages = await MailContent.find(sendReceiver).sort({$natural:-1})
            const getMess = await ID2Email(messages)
            const convertMess = getAllDate(getMess)
            socket.emit('get-messages', convertMess);  
            if(receiverEmail != '' ){
                const getId = await Account.findOne({email: receiverEmail}).select('_id');
                const mailReceiver = {
                    $or: [
                        { sender: getId._id },
                        { receiver: { $in: [getId._id] } }
                    ]
                };
                const msg = await MailContent.find(mailReceiver).sort({$natural:-1})
                const getMail = await ID2Email(msg)
                const convertMsg = getAllDate(getMail)
                // const msg = await MailContent.findOne({ receiver: { $in: [getId._id] } }).sort({$natural:-1})
                // console.log("New Message ",convertMsg)
                const receiveSocketID = users.get(receiverEmail)
                socket.to(receiveSocketID).emit('new-messages', convertMsg); 
            }
            
            
        });
    } catch (error) {
        console.log('Error fetching messages:', error);
    }
    
}
module.exports = {getMessage}




// socket.on('send-message', async ({sender, receiver}) => {
// //     const roomName = getRoomName(sender, receiver)
// //     // const room = io.sockets.in(roomName)
//     const receiverIDSocket = users.get(receiver)
// //     const addSocket = (io.sockets.sockets).get(receiverIDSocket)
    
// //     console.log("check - ",users)
// //     console.log("check - ",receiverIDSocket)
// //     // console.log("check - ",addSocket)
// //     // await socket.join(roomName) 
// //     // addSocket.join(roomName)
// //     // if(addSocket){
// //     //     room.add(addSocket)
// //     //     socket.join(roomName)

// //     // }
    
// //     console.log(sender+' --- '+ receiver)
     
// //     const rooms = socket.adapter.rooms;
// //     // const hasJoinedRoom = rooms[roomName] && rooms[roomName].sockets[socket.id];
// //     console.log("Rooms: ",rooms)
// //     // console.log(`Socket ${socket.id} has joined room ${roomName}: ${hasJoinedRoom}`);
//     const getID = await Account.findOne({email: receiver}).select('_id');
//     const msg = await MailContent.find({ receiver: { $in: [getID._id] } })
//     console.log(msg)
//     if(msg){
//         // console.log("senddd - ", roomName)
//         socket.emit('get-messages', msg);  
//         socket.to(receiverIDSocket).emit('new-messages',msg)

//     }
// //         console.log(`Could not find recipient with email ${receiver}`);
// //       }
// })
// console.log("---- "+"----"+receiverID)     
// if(receiverID !== null && receiverID !== ''){
//     socket.join(receiverID)
//     console.log('join room - ',typeof receiverID)
//     const msg = MailContent.find({ receiver: { $in: [new ObjectId(receiverID)] } })
//     .then(mess => {
//         if(mess){
//             socket.to(receiverID).emit('new-message', mess);

//         }
//     })

// }

// if(receiverID != null){
//     socket.join(`${receiverID}`);
//     const msg = await MailContent.find({ receiver: { $in: [new ObjectId(receiverID)] } });
//     console.log("Msg -- ",msg)
//     socket.to(`${receiverID}`).emit('new-message', msg);
//     // localStorage.clear()

// }
// emit the 'new-message' event to the receiver only
// socket.to(`${receiverID}`).emit('new-message', messages);
// console.log("Sender ID: ", senderID)
// const getMail = await Account.findOne({_id: new ObjectId(senderID)}).select('email')
// emit the 'new-message' event to the receiver only
// socket.join(`${email}`);

// socket.on('send-message', async (senderId, receiverId) => {
// })
// socket.broadcast.emit('new-messages',messages)   