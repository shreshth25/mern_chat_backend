const express = require('express')
const { register, login, profile, updateProfile, updateImage } = require('../controllers/authController')
const { isAuthenticated } = require('../middlewares/authMiddleware')
const upload = require('../config/storage')


const authRouter = express.Router()

authRouter.post('/register', register)
authRouter.post('/login', login)
authRouter.get('/', isAuthenticated, profile)
authRouter.post('/update', isAuthenticated, updateProfile)
authRouter.post('/update-image', isAuthenticated, upload.single('image') , updateImage)


module.exports = authRouter