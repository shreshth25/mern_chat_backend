const express = require('express')
const {chat, allChats} = require('../controllers/aiChatController')
const { isAuthenticated } = require('../middlewares/authMiddleware')
const aiChatRouter = express.Router()


aiChatRouter.post('/ask', isAuthenticated ,chat)
aiChatRouter.get('/chats', isAuthenticated ,allChats)

module.exports = aiChatRouter
