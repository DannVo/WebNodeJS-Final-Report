const express = require('express')
const expressLayout = require('express-ejs-layouts')
const session = require('express-session')
const flash = require('express-flash')
const firebaseAdmin = require('firebase-admin')
const firebase = require('firebase/compat/app')
// const credentials = require('./flair-mail-firebase-adminsdk-lepdk-2958929555.json')
const methodOverride = require('method-override')
const cookieParser = require('cookie-parser')
const http = require('http')
const multer = require('multer')
const dotenv = require('dotenv').config()
const route = require('./routes')
const db = require('./config/db')
const app = express()
const socketio = require('socket.io')
const port = process.env.PORT || 3000
const {getAuth, signInWithPhoneNumber} = require('firebase/auth')
const {initializeApp} = require('firebase/app')


const MailContent = require('./app/models/MailContent')
const Account = require('./app/models/UserAccount')
const {getMessage}= require('./socket')

 
app.set('view engine', 'ejs')
app.use(express.urlencoded({extended: false}))
app.use(expressLayout)
app.use(cookieParser())
app.use(flash());
app.use(methodOverride('_method'))
// app.use('/uploads', express.static('uploads'))
app.use(session({
    secret: 'donvnhtyoa',
    resave: false,
    saveUninitialized: true,
}))
app.use(express.static('views'))
app.set('layout','./layouts/layout_page')



//connect routes, db
db.connect()


const httpServer = app.listen(port, () =>{
    console.log(`Welcome to my website, http://localhost:${port}`)
})
const io = socketio(httpServer,{
    pingInterval: 5000,  // 10s
    pingTimeout: 2000    // 5s
})

//fixed this
app.post('/test/verify',async (req, res) => {
    let { fname, lname, username, phone, password, confirm_pw, captcha } = req.body
    // let all_info = req.body
    // console.log(all_info)
    // const appVerifier = JSON.parse(captcha);
    // console.log(appVerifier)
    // const phoneNum = '+84966018054'
    // signInWithPhoneNumber(phoneNum, appVerifier)
    // .then((confirmationResult) => {
    //   // SMS sent. Prompt user to type the code from the message, then sign the
    //   // user in with confirmationResult.confirm(code).
    //   window.confirmationResult = confirmationResult;
    //   console.log('Mã xác thực đã được gửi đến số điện thoại của người dùng.');
    //   req.flash('success','Đăng ký tài khoản thành công')
    //   req.session.validInputRegis = all_info+verificationId
    //   res.redirect('/register/account/phone-number/verification')
    //   // ...
    // }).catch((error) => {
    //   // Error; SMS not sent
    //   // ...
    //   console.log('Lỗi xảy ra khi gửi mã xác thực:', error);
    // });
    // try {
    //     // Đăng ký tài khoản
    //     // const userRecord = await firebaseAdmin.auth().createUser({
    //     //   email,
    //     //   password,
    //     // });
    
    //     // Gửi OTP đến số điện thoại của người dùng
    //     const phoneNumber = '+84966018054'
    //     const sendOtp = firebaseAdmin.functions().httpsCallable('sendOtp');
    //     await sendOtp({ phoneNumber });
    
    //     res.status(200).send({ message: 'Đăng ký thành công. Vui lòng kiểm tra điện thoại để nhập mã OTP' });
    //   } catch (error) {
    //     console.error(error);
    //     res.status(500).send({ message: 'Lỗi đăng ký tài khoản. Vui lòng thử lại' });
    //   }
})
const firebase = ""
route(app, io, firebase) 


//catch out of url page
// app.use((req, res, next) => {
//     res.send("Page cannot be found")
// })


