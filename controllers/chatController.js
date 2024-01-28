const Chat = require("../models/Chat");
const PersonalChat = require("../models/PersonalChat");
const User = require("../models/User");

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
  const io = req.io
  const data = req.body
  const usersToCheck = [data.sender, data.receiver];
  const message_data = {
    'text': req.file.path,
    'type':'image',
    'sender': data.sender,
    'receiver': data.receiver,
    'timestamp': new Date(),
  };

  let chat = await PersonalChat.findOne({
    users: { $all: usersToCheck },
  });

  if (chat) {
    chat.messages.push(message_data);
  }

  await chat.save();  

  const receiver = await User.findById(data.receiver);
  const receiverSocketId = receiver.socket
  if (receiverSocketId) {
    io.to(receiverSocketId).emit('personalChat', message_data);
  }
  
  const sender = await User.findById(data.sender);
  const senderSocketId = sender.socket
  if (senderSocketId) {
    io.to(senderSocketId).emit('personalChat', message_data)
  }
  resp.json({'status':'SUCCESS','image':'Done'})
}

module.exports = {getChats, getPrivateChats, uploadImage};
