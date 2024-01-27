const express = require('express')
const { getChats, getPrivateChats, uploadImage } = require('../controllers/chatController')
const upload = require('../config/storage')

const chatRoutes = express.Router()

chatRoutes.get('/', getChats)
chatRoutes.post('/privatechats', getPrivateChats)
chatRoutes.post('/upload', upload.single('image') , uploadImage)

module.exports = chatRoutes