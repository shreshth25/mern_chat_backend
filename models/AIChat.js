const { default: mongoose } = require("mongoose");

const AIChatSchema = new mongoose.Schema({
    user: {type: mongoose.Types.ObjectId, ref:'User'},
    messages: [{'role': String, 'content': String}]
}, {timestamps:true})

const AIChat = mongoose.model('AIChat', AIChatSchema)

module.exports = AIChat