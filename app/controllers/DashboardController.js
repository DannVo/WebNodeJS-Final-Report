const {validationResult} = require('../../routes/validator/checkInput')
const io = require('socket.io-client')
const socket = io('http://localhost:8000')
const MailContent = require('../models/MailContent')
const Account = require('../models/UserAccount')
const Draft = require('../models/DraftContent')
const localStorage = require('local-storage')
const {getMessage} = require('../../socket')
const {ID2Email} = require('../../routes/middlewares/convertID2Email')
const {getAllFiles, getFileBucket, dowloadFileBucket} = require('../../routes/middlewares/getFiles')
const {getAllDate} = require('../../routes/middlewares/convertAllDate')

const express = require('express')
const { ObjectId } = require('bson')
const app = express()

module.exports = () =>{
    async function index(req, res){
        if (!req.session.user) {
            return res.redirect('/account/login')
        }
        let avatar = ''
        if(req.session.avt){
            avatar = req.session.avt

        }
        let email = req.session.user
        console.log("Email - ",email)
        const mail_id = await Account.findOne({email: email}).select('_id')
        const mailReceiver = {
            $or: [
                { sender: mail_id._id },
                { receiver: { $in: [mail_id._id] } }
            ]
        };
        const mail_amount = await MailContent.find(mailReceiver).count() || 0
        const error = req.flash('error') || ''
        const all_users = await Account.find({email:{$ne:email}}).select('-_id -user_id -password -phoneNumber')
        const listUser = await Account.findOne({email:email}).select('-_id -user_id -password -phoneNumber')
        console.log(listUser)
        
        res.render('home',{email, activePage:"inbox", error,mail_amount, avatar, allUsers: all_users, block:listUser.blockList})
    }

    function stared_index(req, res){
        if (!req.session.user) {
            return res.redirect('/account/login')
        }
        let avatar = ''
        if(req.session.avt){
            avatar = req.session.avt

        }
        let email = req.session.user
        res.render('./dashboard/stared',{email, activePage:"stared", mailBox:'', avatar})
    }
    async function sent_index(req, res){
        if (!req.session.user) {
            return res.redirect('/account/login')
        }
        let avatar = ''
        if(req.session.avt){
            avatar = req.session.avt

        }
        let email = req.session.user
        const senderID = await Account.findOne({email:email}).select('_id')
        if(!senderID){
            return res.send('Lỗi! Không tìm thấy email người dùng')
        }
        const sentList = MailContent.find({sender: senderID._id}).sort({$natural:-1})
            .then(async (mail) => {
                if(mail){
                    const getMail = await ID2Email(mail)
                    const mailBox = getAllDate(getMail)
                    return res.render('./dashboard/sent_page',{email, activePage:"sent-page", mailBox, avatar})
                    
                }
                res.send("Không có thư đã gửi!")
            })
    }
    async function draft_index(req, res){
        if (!req.session.user) {
            return res.redirect('/account/login')
        }
        let avatar = ''
        if(req.session.avt){
            avatar = req.session.avt

        }
        let email = req.session.user
        const mailContent = await Draft.find({senderEmail:email}) || ''
        const mailBox = getAllDate(mailContent)
        res.render('./dashboard/draft',{email, activePage:"draft", mailBox, avatar}) 
    }
    function trash_index(req, res){
        if (!req.session.user) { 
            return res.redirect('/account/login')
        }
        let avatar = ''
        if(req.session.avt){
            avatar = req.session.avt

        }
        let email = req.session.user
        res.render('./dashboard/trash',{email, activePage:"trash", mailBox:'', avatar})
    }

    async function send_email(req, res){
        const {to_email, cc_email, bcc_email, title, text_message} = req.body
        const files = req.files
        const senderEmail = req.session.email
        let result = validationResult(req)
        let message = ''
        let text_msg = text_message ? text_message: ""

        console.log("Files: ",files)
        // [
        //     {
        //       fieldname: 'sentFile',
        //       originalname: 'readme.txt',
        //       encoding: '7bit',
        //       mimetype: 'text/plain',
        //       id: new ObjectId("644828629b4c3db4619a4e68"),
        //       filename: '02d94f080fcf3e5a34c78992c53d2bc9.txt',
        //       metadata: null,
        //       bucketName: 'george.mail',
        //       chunkSize: 261120,
        //       size: 1742,
        //       md5: undefined,
        //       uploadDate: 2023-04-25T19:22:10.705Z,
        //       contentType: 'text/plain'
        //     }
        //   ]
        // console.log("ID: ",req.params.receiverId)
        if(result.errors.length !== 0){
            result = result.mapped()
            for(let fields in result){
                message = result[fields].msg
                break;
            }
            // console.log(message)
            req.flash('error', message)
            return res.redirect('/dashboard')
            
        }else{
            
            // console.log(req.body) 
            try {
                const senderID = await Account.findOne({email: senderEmail}).select('_id')  
                // console.log("Sender ID: ",senderID)       
                Account.findOne({email: to_email})
                .then((user) => {
                    if(!user){
                        return res.send("Lỗi không tìm thấy người dùng")    
                    }
                    if(files !== null){
                        let fileList = []
                        files.forEach(file => {
                            fileList.push(file.id)
                        });
                        console.log(fileList)
                        const msgSender = new MailContent({
                            sender: senderID,
                            receiver: user._id,
                            sendType: 0,
                            title: title,
                            text: text_msg, 
                            file: fileList
                        });        
                        const msgReceiver = new MailContent({
                            sender: senderID,
                            receiver: user._id,
                            sendType: 0,
                            title: title,
                            text: text_msg, 
                            file: fileList
                        }); 
                        // Store message in database
                        msgSender.save();  
                        msgReceiver.save();

                    }else{
                        const msgSender = new MailContent({
                            sender: senderID,
                            receiver: user._id,
                            sendType: 0,
                            title: title,
                            text: text_message,
                        });   
                        const msgReceiver = new MailContent({
                            sender: senderID,
                            receiver: user._id,
                            sendType: 0,
                            title: title,
                            text: text_message,
                        });       
                        // Store message in database
                        msgSender.save();  
                        msgReceiver.save();  
                    }
                    localStorage.set('receiverEmail',to_email)

                    return res.redirect('/dashboard')
                }) 
                
            } catch (error) {
                console.log("Đã xảy ra lỗi: ", error.message)
                req.flash('error', error.message)
                return res.redirect('/dashboard')
            }
        }
    }
    function store_draft(req, res){
        const { to_email, cc_email, bcc_email, title, msg } = req.body;
        console.log("Draft: ", req.body);
        const sender = req.session.user
        console.log("Draft: ", sender);
        const new_draft = new Draft({
            senderEmail: sender,
            toEmail: to_email,
            ccEmail: cc_email,
            bccEmail: bcc_email,
            title: title,
            text: msg
        })
        new_draft.save()
    }
    
    async function detail_mail(req, res) {
        if (!req.session.user) {
            return res.redirect('/account/login')
        }
        let avatar = ''
        if(req.session.avt){
            avatar = req.session.avt

        }
        let email = req.session.user
        const mailID = req.params.id

        //Get content of mail, info sender
        const getContent = await MailContent.findOne({_id: new ObjectId(mailID)})
        console.log("-------- ", getContent.file)
        const getAccount = await Account.findOne({_id: getContent.sender}).select('email fullName -_id')

        //Get detail files
        const listFile = await getAllFiles(email, getContent.file)
        console.log("List: ",listFile)
        
        return res.render('detail-mail',{email, activePage:'', content: getContent, account: getAccount, files: listFile, avatar})
    }

    async function view_content_files(req, res) {
        if (!req.session.user) {
            return res.redirect('/account/login')
        }
        let email = req.session.user
        let id = req.params.id
        await getFileBucket(email, id, res)
    }

    async function download_content_files(req, res) {
        if (!req.session.user) {
            return res.redirect('/account/login')
        }
        let email = req.session.user
        let id = req.params.id
        await dowloadFileBucket(email, id, res)
    }

    async function block_friend(req, res){
        const email = req.session.user
        const mailBlock = req.params.mail
        //User1 chặn user2 thì blockList bên user1 và user2 đều có tên của đối phương
        //block list của người dùng
        const updateMailUser = await Account.findOneAndUpdate({email:email},{$push:{blockList: mailBlock}})
        //blocklist của người bị block
        const updateMailBlock = await Account.findOneAndUpdate({email:mailBlock},{$push:{blockList: email}})
        console.log("Thành công rồi ",updateMailBlock)
        res.redirect('home')
    }
    async function unblock_friend(req, res){
        const email = req.session.user
        const mailUnblock = req.params.mail
        //User1 chặn user2 thì blockList bên user1 và user2 đều có tên của đối phương
        const updateMailUser = await Account.findOneAndUpdate({email:email},{$pull:{blockList: mailUnblock}})
        console.log("Thành công unblock ",updateMailUser)
        res.redirect('home')
    }
    
    return {index, stared_index, sent_index, draft_index, trash_index,
        send_email, store_draft, detail_mail, view_content_files, download_content_files,
        block_friend, unblock_friend
    }
}