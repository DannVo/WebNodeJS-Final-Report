const Account = require('../models/UserAccount')
const {ObjectId} = require('mongodb')
const bcrypt = require('bcrypt')

const fileCollection = 'fs.file'

class SettingController{
    index(req, res){
        if (!req.session.user) { 
            console.log('quay lại lần xxy')
            return res.redirect('/account/login')
        }
        console.log('quay lại lần xxx')
        let userId = req.session.userId
        const success = req.flash('updateSuccess') || ''
        const error = req.flash('updateError') || ''

        Account.findOne({user_id: userId}).then(user =>{
            if(!user){
                return res.send('Trang web đã xảy ra lỗi. Vui lòng đăng nhập để thử lại')
            }
            let email = user.email
            let phone = user.phoneNumber
            let username = user.email.split('@fmail.com')[0]
            let gender = user.gender
            let fullName = ""
            if(user.fullName.fullName.length > 0){
                fullName = user.fullName.fullName
            }else{
                fullName = user["fullName"]["firstName"]  +
                    " " + user["fullName"]["lastName"]

            }
            let avatar = ''
            if(req.session.avt){
                avatar = req.session.avt

            }
            console.log(avatar)
            console.log(username, fullName)
            return res.render('setting-layout',{email, phone, username, fullName, gender, avatar, success, error})
        })
    }
    async update(req, res){
        let {fullName, gender, phoneNum} = req.body
        // const db = req.app.locals.db
        // const {_id} = await Account.insert(req.file)
        console.log(req.file)
        console.log(fullName, gender, phoneNum)
        let updateField = {
            "fullName.fullName": fullName, 
            phoneNumber: phoneNum, 
            gender: gender
        }
        if(req.file){
            updateField.avatar = req.file.id    
            req.session.avatar = req.file.id
        }

        Account.findOneAndUpdate({user_id: req.session.userId},
            { $set: updateField}, {new: true})
        .then(result => {
            console.log("result ",result)
            if(result){
                req.flash('updateSuccess','Cập nhật thành công')
                return res.redirect('/setting-mail') 
            }
            return res.send('Cannot update information')
        })
       

        
        
    }

    async update_password(req, res){
        let {password, new_password, confirm_password} = req.body
        let saltRounds = 10
        let hash_password = ''
        console.log(req.body)

        bcrypt.genSalt(saltRounds, (err, salt) => {
            if(err){
                return res.send('Lỗi mật khẩu!')
            }
            bcrypt.hash(new_password, salt, (err, hash_pw) => {
                if(err){
                    return res.send('Lỗi mã hóa mật khẩu')
                }
                hash_password = hash_pw
            })
        })
        console.log(hash_password)
        Account.findOne({user_id: req.session.userId})
        .then(user => {
            console.log("result1: ",user)
            if(!user){
                return res.send("Cannot find user")
            }
            bcrypt.compare(password, user.password, (err, result) => {
                if(!result){
                    req.flash('updateError', 'Mật khẩu không chính xác')
                    return res.redirect('/setting-mail')
                    
                }
                let updateField = {
                    password: hash_password, 
                }
                Account.updateOne({user_id: req.session.userId},
                    { $set: updateField}, {new: true})
                .then(check => {
                    if(check){
                        req.flash('updateSuccess','Cập nhật mật khẩu thành công!')
                    }else{
                        req.flash('updateError', 'Lỗi cập nhật mật khẩu')
                        
                    }
                    return res.redirect('/setting-mail')
                })
            })
            
        })
    }
}

module.exports = new SettingController