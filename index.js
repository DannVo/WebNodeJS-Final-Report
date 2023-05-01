const express = require('express')
const expressLayout = require('express-ejs-layouts')
const session = require('express-session')
const flash = require('express-flash')
const firebaseAdmin = require('firebase-admin')
const firebase = ''
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

route(app, io, firebase) 
 

//catch out of url page
// app.use((req, res, next) => {
//     res.send("Page cannot be found")
// })


