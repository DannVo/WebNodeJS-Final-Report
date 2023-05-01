const Account = require('../../app/models/UserAccount')

const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();
const { PhoneNumberFormat } = require('google-libphonenumber');
const bcrypt = require('bcrypt')
const emailValidator = require('email-validator');
const { validationResult } = require('../validator/checkInput');

function isValidPhoneNumber(phoneNumber) {
    try {
        // Parse the phone number string into a PhoneNumber object
        const parsedNumber = phoneUtil.parse(phoneNumber, 'VN');
    
        // Check if the phone number is valid and formatted correctly
        if (phoneUtil.isValidNumber(parsedNumber)) {
          const formattedNumber = phoneUtil.format(parsedNumber, PhoneNumberFormat.E164);
          console.log(`Valid Vietnamese phone number: ${formattedNumber}`)
          return true;
        } else {
          return false;
        }
    } catch (error) {
        console.error('Error parsing phone number:', error);
        return false;
    }
}

function checkInputValid(req, res, next) {
    let {fname, lname, username, phone, password, confirm_pw} = req.body
    let msg = ''
    
    if (!fname) {
      msg = "Please enter your first name"
    }else if(!lname){
      msg = "Please enter your last name"
    }else if(!username){
      msg = "Please enter your username"
    }else if(!phone){
      msg = "Please enter your phone number"
    }else if(!password){
      msg = "Please enter password"
    }else if(password.length < 6){
      msg = "Password must be at least 6 characters!"
    }else if(!confirm_pw){
      msg = "Confirm password need to be filled"
    }else if(confirm_pw !== password){
      msg = "Confirm password is not matching"
    }
    let errMsg = msg
    if (errMsg.length >0) {
        return res.render('register',{errMsg, fname, lname, username, phone, password, confirm_pw})
    }else if(!isValidPhoneNumber(phone)){
        errMsg = "Số điện thoại \n không hợp lệ - Yêu cầu mã vùng tại VN: +84"
        return res.render('register',{errMsg, fname, lname, username, phone, password, confirm_pw})
    }
    next()
}

//used
async function checkIsExistDB(req, res, next) {
    let {fname, lname, username, phone, password, confirm_pw} = req.body
    let email = username + '@fmail.com'
    let result = validationResult(req)
    let message = ''
    if(result.errors.length !== 0){
      result = result.mapped()
      for(let fields in result){
          message = result[fields].msg
          break;
      }
      // console.log(message)
      req.flash('error', message)
      req.flash('fname',fname)
      req.flash('lname',lname)
      req.flash('username',username)
      req.flash('phone',phone)
      req.flash('password',password)
      req.flash('confirm_pw',confirm_pw)
  
      return res.redirect('/register')
    }
    
    try {
        let emailExist = await Account.findOne({email: email})
        let phoneExist = await Account.findOne({phoneNumber: phone})
        
        if(emailExist){
          req.flash('fname',fname)
          req.flash('lname',lname)
          req.flash('username',username)
          req.flash('phone',phone)
          req.flash('password',password)
          req.flash('confirm_pw',confirm_pw)
          req.flash("error","Email đã tồn tại. Vui lòng dùng tên khác!")
          req.flash('error-type','warning')
          return res.redirect('register')
        }else if(phoneExist){
          req.flash('fname',fname)
          req.flash('lname',lname)
          req.flash('username',username)
          req.flash('phone',phone)
          req.flash('password',password)
          req.flash('confirm_pw',confirm_pw)
          req.flash("error","Số điện thoại đã được đăng ký")
          req.flash('error-type','warning')
          return res.redirect('register')
          
        }else if(!isValidPhoneNumber(phone)){
          req.flash('fname',fname)
          req.flash('lname',lname)
          req.flash('username',username)
          req.flash('phone',phone)
          req.flash('password',password)
          req.flash('confirm_pw',confirm_pw)
          req.flash("error","Số điện thoại \n không hợp lệ - Yêu cầu mã vùng tại VN: +84")
          req.flash('error-type','warning')
          return res.redirect('register')
      }
    } catch (error) {
      
        req.flash("error","Lỗi dữ liệu. Vui lòng thử lại!")
        req.flash('error-type','danger')
        return res.redirect('register')
    }
    next()
    
}

function checkLoginInput(req, res, next) {
  let {password, email} = req.body
  let errMsg = ''

  if(!email){
    errMsg = 'Vui lòng nhập email người dùng!'
  }else if(!emailValidator.validate(email)){
    errMsg = 'Email đăng nhập không đúng định dạng (example@fmail.com)'

  }else if(!password){
    errMsg = 'Vui lòng nhập mật khẩu!'
  }

  if (errMsg.length >0) {
      return res.render('login',{errMsg, errTitle: 'Notice', type:'warning', email})
  }
  next() 
}

async function checkIsLogin(req, res, next) {
  let email = req.body.email
  let pw = req.body.password
  let result = validationResult(req)
  let message = ''
  console.log(email, pw)

  //check login input validator result (true, false)
  if(result.errors.length !== 0){
    result = result.mapped()
    for(let fields in result){
        message = result[fields].msg
        break;
    }
    // console.log(message)
    req.flash('error', message)
    req.flash('email',email)
    return res.redirect('login')
  }

  let errMsg = ''
  Account.findOne({email: email}).then(user =>{
    if(user){
      bcrypt.compare(pw, user.password, (err, result) =>{
        if(result){
          
          req.session.user = email
          req.session.userId = user.user_id
          req.session.avatar = user.avatar
    
          return next()
        }
        
        errMsg = 'Email hoặc mật khẩu không chính xác'
        console.log(errMsg)
        req.flash('error', errMsg)
        req.flash('email',email)
        req.flash('error-title','Warning')
        req.flash('error-type','danger')
        return res.redirect('login')
      })
    }else{
      errMsg = 'Email hoặc mật khẩu không chính xác'
      console.log(errMsg)
      req.flash('error', errMsg)
      req.flash('email',email)
      req.flash('error-title','Warning')
      req.flash('error-type','danger')
      
      return res.redirect('login')

    }
  }) 
}

module.exports = {checkInputValid, checkIsExistDB, checkLoginInput, checkIsLogin}