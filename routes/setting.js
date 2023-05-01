const express = require('express')
const multer = require('multer')
const {GridFsStorage} = require('multer-gridfs-storage')
const path = require('path')
const jwtAuthentication = require('../routes/middlewares/jwtAuthentication')
const url = 'mongodb+srv://anthonyvo:AnthonyVo378@test.csv7oin.mongodb.net/test?retryWrites=true&w=majority'
const router = express.Router()
const settingController = require('../app/controllers/SettingController')
const getImageDB = require('./middlewares/getImageDB')

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
    file: (req, file) => {
        const match = ["image/png", "image/jpeg"];
        let email = req.session.email
        let userEmail = email.substring(0, email.indexOf("@"))
        if (match.indexOf(file.mimetype) === -1) {
          const filename = `${Date.now()}-${userEmail}-${file.originalname}`;
          return filename;
        }
        // console.log(userEmail)
        return {
          bucketName: `${userEmail}.avatars`,
          filename: `${Date.now()}-${userEmail}-${file.originalname}`
        };
      }
})
const upload = multer({
    storage: storageMongo,
    // fileFilter: (req, file, cb) =>{
    //     if(file.mimetype.startsWith('image/')){
    //         cb(null, true)
    //     }else{
    //         cb(null, false)
    //     }
    // },
    limits: {fileSize: 800000} //500KB
})
router.get('/', jwtAuthentication, getImageDB.getImage, settingController.index)
router.put('/update', jwtAuthentication, upload.single('avatar'),settingController.update)
router.put('/update-password', jwtAuthentication, settingController.update_password)

module.exports = router
