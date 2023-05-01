const { throws } = require('assert')
const {check, validationResult, oneOf} = require('express-validator')

const regisValidator = [
    check('fname').exists().withMessage('Vui lòng nhập họ tên người dùng')
    .notEmpty().withMessage('Không được để trống họ tên người dùng'),
    // .isLength({min:6}).withMessage('Tên người dùng ít nhất phải từ 6 ký tự'),

    check('lname').exists().withMessage('Vui lòng nhập tên người dùng')
    .notEmpty().withMessage('Không được để trống họ tên người dùng'),

    check('username').exists().withMessage('Vui lòng nhập tên tài khoản')
    .notEmpty().withMessage('Không được để trống tên tài khoản'),
    // .isEmail().withMessage('Email đăng ký không hợp lệ'),

    check('phone').exists().withMessage('Vui lòng nhập số điện thoại')
    .notEmpty().withMessage('Không được để trống số điện thoại')
    .isMobilePhone().withMessage('Số điện thoại không hợp lệ'),

    check('password').exists().withMessage('Vui lòng nhập mật khẩu')
    .notEmpty().withMessage('Không được để trống mật khẩu')
    .isLength({min:6}).withMessage('Mật khẩu cần phải từ 6 ký tự, bao gồm các ký tự đặc biệt @#$A*'),

    check('confirm_pw').exists().withMessage('Vui lòng xác nhận lại mật khẩu')
    .notEmpty().withMessage('Mật khẩu xác nhận không chính xác')
    .custom((value, {req}) => {
        if (value !== req.body.password) {
            throw new Error('Mật khẩu xác nhận không trùng khớp')
        }
        return true
    })
]

const loginValidator = [
    check('email').exists().withMessage('Vui lòng nhập email')
    .notEmpty().withMessage('Không được để trống email')
    .isEmail().withMessage('Email đăng nhập không hợp lệ'),

    check('password').exists().withMessage('Vui lòng nhập mật khẩu')
    .notEmpty().withMessage('Không được để trống mật khẩu')
    .isLength({min:6}).withMessage('Mật khẩu cần phải từ 6 ký tự, bao gồm các ký tự đặc biệt @#$A*'),
]

const composeValidator = [

    check('to_email')
    .if(check('to_email').isEmpty() && check('cc_email').isEmpty() && check('bcc_email').isEmpty())
    .notEmpty().withMessage("Vui lòng nhập ít nhất 1 địa chỉ")
    .isEmail().withMessage("Email không đúng định dạng"),

]

module.exports = {regisValidator, loginValidator, composeValidator, validationResult};