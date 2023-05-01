const mongoose = require('mongoose')

async function connect() {
    
    try {
        await mongoose.connect('mongodb+srv://anthonyvo:AnthonyVo378@cluster1.csv7oin.mongodb.net/?retryWrites=true&w=majority'
        , { useNewUrlParser: true, useUnifiedTopology: true })
        console.log('Connect successfully!')
    } catch (error) {
        console.log('Connect failure!')
    }
}

module.exports = {connect}



