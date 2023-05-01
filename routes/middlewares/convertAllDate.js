const {showDate} = require('../support/dateConvert')

function getAllDate(msgList) {
    let temp = [...msgList]
    let strArray = JSON.stringify(temp)
    let mailBox = JSON.parse(strArray)
    let newDateList = []
    for (let i = 0; i < msgList.length; i++) {
        const mail = msgList[i];
        const newDate = showDate(mail.createdAt)
        newDateList.push(newDate)
    }
    for (let i = 0; i < mailBox.length; i++) {
        mailBox[i].createdAt = newDateList[i]
    }
    return mailBox
}

module.exports ={getAllDate}