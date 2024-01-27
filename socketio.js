const Chat = require("./models/Chat");
const PersonalChat = require("./models/PersonalChat");
const userSocketMap = {};

const CreateSocketIO = async (io) => {
  io.on('connection', (socket) => {
    console.log('User connected');

    socket.on('disconnect', () => {
      console.log('User disconnected');
      const userId = Object.keys(userSocketMap).find(
        (key) => userSocketMap[key] === socket.id
      );
      if (userId) {
        delete userSocketMap[userId];
      }
    });

    socket.on('setUserId', (userId) => {
      userSocketMap[userId] = socket.id;
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
      const receiverSocketId = userSocketMap[data.receiver];
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('personalChat', message_data);
      }
      const senderSocketId = userSocketMap[data.sender];
      if (senderSocketId) {
        io.to(senderSocketId).emit('personalChat', message_data)
      }
    });

    socket.on('typing', (data) => {
      if (data) {
        const receiverSocketId = userSocketMap[data.receiver];
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
