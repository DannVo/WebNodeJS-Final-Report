const localStorage = require('local-storage')
const {connectServer} = require('../client-connect/socket-connection')
const jwt = require('jsonwebtoken')

module.exports = (io) => {
    function index(req, res){
        if (req.session.user) {
            return res.redirect('/dashboard')
        }
        const error = req.flash('error') || ''
        let email = req.flash('email') || ''
        let password = req.flash('password') || ''
        const success = req.flash('success') || ''
        let errorTitle = (req.flash('error').length > 0) ? req.flash('error-title') : 'Warning'
        let errorType = (req.flash('error').length > 0) ? req.flash('error-type') : 'danger'
        
        res.render('login',{error, errorTitle: errorTitle, errorType: errorType, email, success})
    }
 
    function login(req, res){
        req.session.email = req.body.email
        let email = req.session.email
        localStorage.set("user-email",req.session.email)
        const token = jwt.sign({email}, process.env.JWT_PASSWORD,{expiresIn: '3h'})
        res.cookie('token',token, {httpOnly:true, sameSite: true })
        connectServer(io)
        
        res.redirect('/dashboard') 
    }

    function forgot_index(req, res){
        
        res.render('forgot-password')
    }

    function logout(req, res){
        req.session.user = null
        // req.session.destroy()
        res.redirect('login')
    }

    return {index, login, forgot_index, logout}
};