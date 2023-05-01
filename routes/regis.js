const express = require('express')
const router = express.Router()
// const regisController = require('../app/controllers/RegisController')()
const {regisValidator} = require('./validator/checkInput')
const {checkInputValid, checkIsExistDB} = require('./middlewares/checkMiddle')

module.exports = (firebase) => {
    const regisController = require('../app/controllers/RegisController')(firebase)
    
    router.get('/', regisController.index)
    router.post('/phone/confirm', regisValidator, checkIsExistDB, regisController.regis)
    router.get('/account/phone-number/verification', regisController.phone_auth_index)
    router.post('/account/phone-number/verification/:id', regisController.phone_authentication)

    return router
}

// router.get('/', regisController.index)
// router.post('/account/phone-number/verification', regisValidator, checkIsExistDB, regisController.regis)
// router.get('/', regisValidator, checkIsExistDB, regisController.phone_authentication)
