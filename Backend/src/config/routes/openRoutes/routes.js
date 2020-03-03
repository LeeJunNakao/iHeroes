const authService = require('../../auth/authService')

module.exports = (app)=>{
    app.get('/',(req,res)=>{
        res.send('ok')
    })

    app.post('/register',authService.signup);
    app.post('/login', authService.login);
    app.post('/validateToken', authService.validateToken)

}