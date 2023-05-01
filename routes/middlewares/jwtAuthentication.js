const jwt = require('jsonwebtoken')

module.exports = async (req, res, next) => {
    const authentication = req.cookies.token || ''

    if(!authentication){
        return res.redirect('/account/login')
    }
    try{
        const {email} = await jwt.verify(authentication, process.env.JWT_PASSWORD)
        req.email = email
        next()
    }catch(error){
        return res.redirect('/account/login')
    }
}