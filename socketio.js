const Chat = require("./models/Chat");
const PersonalChat = require("./models/PersonalChat");
const User = require("./models/User");
const userSocketMap = {};

const CreateSocketIO = async (io) => {
  io.on('connection', (socket) => {
    console.log(`User connected with id ${socket.id}`);

    socket.on('disconnect', () => {
      console.log('User disconnected');
      const userId = Object.keys(userSocketMap).find(
        (key) => userSocketMap[key] === socket.id
      );
      if (userId) {
        delete userSocketMap[userId];
      }
    });

    socket.on('setUserId', async(userId) => {
      const user = await User.findById(userId)
      user.socket = socket.id;
      await user.save();
    });

    socket.on('chat', async (data) => {
      const chat = new Chat({
        user: data.id,
        message: data.message,
      });
      await chat.save();

      const new_chat = await Chat.findById(chat._id)
        .populate('user', 'firstname image')
        .select('message createdAt user');
      io.emit('chat', new_chat);
    });

    socket.on('personalChat', async (data) => {
      const usersToCheck = [data.sender, data.receiver];
      const message_data = {
        'text': data.message,
        'sender': data.sender,
        'receiver': data.receiver,
        'timestamp': new Date(),
      };

      let chat = await PersonalChat.findOne({
        users: { $all: usersToCheck },
      });

      if (chat) {
        chat.messages.push(message_data);
      } else {
        chat = new PersonalChat({
          users: usersToCheck,
          messages: [message_data],
        });
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
    });

    socket.on('typing', async(data) => {
      if (data) {
        const receiver = await User.findById(data.receiver);
        const receiverSocketId = receiver.socket
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('typing', data);
        }
      } else {
        socket.broadcast.emit('typing', "");
      }
    });
  });
};

module.exports = CreateSocketIO;
