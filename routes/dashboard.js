const express = require('express')
const router = express.Router()
const {composeValidator} = require('./validator/checkInput')
const multer = require('multer')
const {GridFsStorage} = require('multer-gridfs-storage')
const crypto = require('crypto');
const path = require('path')
const jwtAuthentication = require('../routes/middlewares/jwtAuthentication')
const url = 'mongodb+srv://anthonyvo:AnthonyVo378@test.csv7oin.mongodb.net/test?retryWrites=true&w=majority'
const dashController = require('../app/controllers/DashboardController')()
const {getImage} = require('./middlewares/getImageDB')
// const url = ''

const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, path.join(__dirname, '../uploads'))
    },
    filename: (req, file, cb) =>{
        cb(null, file.originalname)
    },
    
})
const storageMongo = new GridFsStorage({
    url:url ,
    options: { 
        useUnifiedTopology: true,
        useNewUrlParser: true,
        req: null,// Pass req object as an option
    },
    // file: (req, file) => {
    //     // const match = ["image/png", "image/jpeg"];
    //     let email = req.session.email
    //     let userEmail = email.substring(0, email.indexOf("@"))
    //     // if (match.indexOf(file.mimetype) === -1) {
    //     //   const filename = `${Date.now()}-${userEmail}-${file.originalname}`;
    //     //   return filename;
    //     // }
    //     console.log(userEmail)
    //     return {
    //       bucketName: `${userEmail}.avatars`,
    //       filename: `${Date.now()}-${userEmail}-${file.originalname}`
    //     };
    //   }
})
const storage2 = new GridFsStorage({
    url: url,
    options: { 
        useUnifiedTopology: true,
        useNewUrlParser: true,
        req: null,// Pass req object as an option
    },
    file: (req, file) => {
        let email = req.session.email
        let userEmail = email.substring(0, email.indexOf("@"))
        return {
          filename: file.originalname,
          bucketName: `${userEmail}.mail`
        }
        
    }
  });
const upload = multer({
    storage: storage2,
    limits: {fileSize: 25000000} //25MB
})

module.exports = () => {
    // const dashController = require('../app/controllers/DashboardController')
    router.get('/', jwtAuthentication, getImage, dashController.index)
    router.get('/stared', jwtAuthentication, dashController.stared_index)
    router.get('/all-sent', jwtAuthentication, dashController.sent_index)
    router.get('/draft', jwtAuthentication, dashController.draft_index)
    router.get('/trash', jwtAuthentication, dashController.trash_index)
    router.get('/mail/content/:id', jwtAuthentication, dashController.detail_mail)
    router.get('/mail/content/files/view/:id',jwtAuthentication, dashController.view_content_files)
    router.get('/mail/content/files/download/:id',jwtAuthentication, dashController.download_content_files)
    
    router.post('/account/block/:mail', jwtAuthentication, dashController.block_friend)
    router.post('/account/unblock/:mail', jwtAuthentication, dashController.unblock_friend)
    router.post('/compose/email', jwtAuthentication, upload.array('sentFile',4), composeValidator, dashController.send_email)
    router.post('/send-email/draft/store', jwtAuthentication, upload.single('sentFile'), dashController.store_draft)

    return router
}
