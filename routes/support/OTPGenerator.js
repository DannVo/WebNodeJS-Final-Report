const admin = require('firebase-admin');
const functions = require('firebase-functions');
const twilio = require('twilio');
const accountSid = 'AC68aaa702a4b127350dd589112e0e7714';
const authToken = '917a3311a999cd5186736343b7b5fac7';
const client = twilio(accountSid, authToken);

admin.initializeApp();

exports.sendOtp = functions.https.onCall(async (data, context) => {
  // Kiểm tra quyền truy cập của user 
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Chưa đăng nhập');
  }

  const phoneNumber = data.phoneNumber;
  const testVerificationCode = "123456"; // mã OTP tạo chỉ mang tính chất minh họa
  const ttl = 60 * 60; // thời gian sống của OTP (1h)

  try {
    // Tạo mã OTP mới cho người dùng (để sử dụng mã Google generate OTP)
    const verificationRequest = await admin.auth().createSessionCookie(phoneNumber, { ttl });
    console.log(`Mã OTP: ${testVerificationCode}`);

    // Gửi mã OTP đến số điện thoại của người dùng
    const message = `Mã xác nhận đăng nhập của bạn là ${testVerificationCode}`;
    const response = await client.messages.create({
      body: message,
      from: '+16206596023', // Twilio số điện thoại của bạn 
      to: phoneNumber
    });

    // Lưu thông tin đăng nhập của người dùng vào Firebase
    await admin.firestore().collection('loginRequests').doc().set({
      timestamp: admin.firestore.Timestamp.fromDate(new Date()),
      userUid: context.auth.uid,
      phoneNumber
    });

    return { success: true };
  } catch (error) {
    console.log(error);
    throw new functions.https.HttpsError('failed-precondition', 'Failed to create OTP');
  }
});
