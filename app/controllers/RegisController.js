const Account = require('../models/UserAccount')
const bcrypt = require('bcrypt')
const {getAuth} = require('firebase/auth')
const saltRounds = 10


module.exports = (firebase) => {
  function index(req, res) {
    if (req.session.user) {
      return res.redirect('/dashboard')
    }
    let fname = req.flash('fname') || ''
    let lname = req.flash('lname') || ''
    let username = req.flash('username') || ''
    let phone = req.flash('phone') || ''
    let password = req.flash('password') || ''
    let confirm_pw = req.flash('confirm_pw') || ''
    const success = req.flash('success') || ''
    const error = req.flash('error') || ''
    let errorTitle = (req.flash('error').length > 0) ? req.flash('error-title') : 'Warning'
    let errorType = (req.flash('error').length > 0) ? req.flash('error-type') : 'danger'
    console.log("regis")
    res.render('register', {
      fname, lname, username,
      phone, password, confirm_pw,
      success, error,
      errorTitle, errorType
    })
  }
  
  function regis(req, res) {
    let { fname, lname, username, phone, password, confirm_pw, captcha } = req.body
    let all_info = req.body
    console.log(all_info)
    const appVerifier = JSON.parse(captcha);
    console.log(appVerifier)
    // firebase.default.auth().signInWithPhoneNumber(auth, phone, appVerifier)
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
    
  // })
  // .catch((error) => {
  //     console.log('Lỗi xảy ra khi gửi mã xác thực:', error);
  //   });

    // bcrypt.genSalt(saltRounds, (err, salt) => {
    //   bcrypt.hash(password, salt, (err, hash_pw) => {
    //     console.log('password ', password)
    //     console.log("hash password ", hash_pw)

    //     let new_account = new Account({
    //       user_id: Date.now(),
    //       fullName: { firstName: fname, lastName: lname },
    //       email: username + '@fmail.com',
    //       password: hash_pw,
    //       phoneNumber: phone,
    //     }).save()
    //   })
    // })

  }
  function phone_auth_index(req, res){
    if(!req.session.validInputRegis){
      return res.redirect('/register')
    }
    res.render('phone-auth')

  }
  function phone_authentication(req, res){
    const sessionValue = req.session.validInputRegis
    const phoneNumber = '+1234567890'; // Số điện thoại của người dùng
    const verificationId = 0; // ID xác thực từ bước 4
    const code = req.params.id; // Mã xác thực từ người dùng

    console.log(sessionValue)
    console.log(code)
    // admin.auth().checkVerificationCode(verificationId, code)
    //   .then((result) => {
    //     console.log('Mã xác thực hợp lệ:', result);
    //   })
    //   .catch((error) => {
    //     console.log('Mã xác thực không hợp lệ:', error);
    //   });
  }

  return {index, regis, phone_auth_index, phone_authentication}
};