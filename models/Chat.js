const { default: mongoose } = require("mongoose");

const chatSchema = mongoose.Schema({
    user: {type: mongoose.Types.ObjectId, ref:"User"},
    message: {type: String}
}, {timestamps: true})

const Chat = mongoose.model("Chat",chatSchema)

module.exports = Chat