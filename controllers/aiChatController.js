const OpenAI = require('openai');
const AIChat = require('../models/AIChat');
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});


const getChats = async (id) => {
    let chats = await AIChat.findOne({ user: id });
  
    if (!chats) {
        chats = new AIChat({
        user: id,
        messages: [],
      });
      await chats.save();
    }
  
    return chats;
  };

const chat = async (req, resp) => {
  try {
    const { chat } = req.body;
    const chats = await getChats(req.user.user_id)

    const finalChats = chats.messages.map(({ role, content }) => ({ role, content }));
    const chatCompletion = await openai.chat.completions.create({
      messages: [...finalChats, { role: 'user', content: chat }],
      model: 'gpt-3.5-turbo',
    });

    const responseMessage = chatCompletion.choices[0].message.content;
    chats.messages.push({role: 'user', content: chat})
    chats.messages.push({ role: 'assistant', content: responseMessage });
    await chats.save();

    resp.json({'chats':chats.messages});
  } catch (error) {
    console.error(error);
    resp.status(500).send('Internal Server Error');
  }
};

const allChats = async (req, resp) => {
  try {
    const chats = await getChats(req.user.user_id)
    resp.json({'chats':chats.messages});

  } catch (error) {
    console.error(error);
    resp.status(500).send('Internal Server Error');
  }
};

module.exports = {chat, allChats};
