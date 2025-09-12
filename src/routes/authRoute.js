const {Router} = require('express')
const { loginuser, logoutuser } = require('../controllers/authController.js')

const route = Router()


route.post('/login',loginuser)

route.delete('/logout',logoutuser)


module.exports=route