const Chat = require("../models/Chat");
const PersonalChat = require("../models/PersonalChat");

const getChats = async (req, resp) => {
  const chats = await Chat.find({}).populate('user', 'firstname image').select('message createdAt user')
  resp.json({'chats': chats})
}

const getPrivateChats = async (req, resp) => {
  const usersToCheck = [req.body.sender, req.body.receiver]
  const chats = await PersonalChat.findOne({
      users: { $all: usersToCheck }
  })
  if(!chats)
  {
    return resp.json({'chats': []})
  }
  else
  {
    resp.json({'chats': chats.messages})
  }
  
}

const uploadImage = async (req, resp) => {
  const usersToCheck = [req.body.sender, req.body.receiver]
  const chats = await PersonalChat.findOne({
      users: { $all: usersToCheck }
  })
  if(!chats)
  {
    return resp.json({'chats': []})
  }
  else
  {
    resp.json({'chats': chats.messages})
  }
  
}

module.exports = {getChats, getPrivateChats, uploadImage};
