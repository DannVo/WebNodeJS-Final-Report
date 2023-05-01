// const loginRouter = require('./login')
const settingRouter = require('./setting')
const dashboardRouter = require('./dashboard')()
const Account = require('../app/models/UserAccount')

function route(app, io, firebase){
    
    const loginRouter = require('./login')
    const regisRouter = require('./regis')
    app.use('/account', loginRouter(io))
    app.use('/register', regisRouter(firebase))
    app.use('/dashboard', dashboardRouter)
    app.use('/setting-mail', settingRouter)

    //TRANG OVERVIEW //khong can controller
    app.get('/', (req, res) => {
        res.render('index')
    })
    app.get('/detail-mail-1', (req, res) => {
        res.render('detail-mail',{email:'', activePage:'', content:''})
    })    


}

module.exports = route