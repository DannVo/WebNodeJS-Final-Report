const express = require('express')
const router = express.Router()
const {loginValidator} = require('./validator/checkInput')
const {checkIsLogin} = require('./middlewares/checkMiddle')
// const loginController = require('../app/controllers/LoginController')


module.exports = (io) => {
    const loginController = require('../app/controllers/LoginController')(io)
    
    router.get('/login', loginController.index)
    router.post('/login', loginValidator, checkIsLogin, loginController.login)
    router.get('/forgot-password', loginController.forgot_index)
    router.get('/logout', loginController.logout)
    return router
}
