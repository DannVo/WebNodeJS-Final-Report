const Account = require('../../app/models/UserAccount')
async function ID2Email(listID) {
    let temp = [...listID]
    let strArray = JSON.stringify(temp)
    let mailBox = JSON.parse(strArray)
    let newList = []
    let senderList = []
    for (let i = 0; i < listID.length; i++) {
        const mail = listID[i];
        const {email} = await Account.findOne({_id: mail['sender']}).select('email')
        let mailList = []
        if (mail && mail.receiver) {
            let length = mail['receiver'].length
            for (let index = 0; index < length; index++) {
                const element = mail['receiver'][index]
                let {email} = await Account.findOne({_id: element}).select('email')
                mailList.push(email)
            }
        }
        senderList.push(email)
        newList.push(mailList)
    }
    for (let i = 0; i < mailBox.length; i++) {
        mailBox[i].receiver = newList[i]
        mailBox[i].sender = senderList[i]
    }
    // console.log(mailBox)
    return mailBox
    //export: ['41hd2ew23412'] -> [user1@fmail.com,...]
}

module.exports = {ID2Email}