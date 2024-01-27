const { default: mongoose } = require("mongoose");

const messages_types = ['text', 'image'];
const personalChatSchema = mongoose.Schema({
    users: [
        { type: mongoose.Types.ObjectId, ref: "User" }
    ],
    messages: [
        {
            text: { type: String, required: true },
            sender: { type: mongoose.Types.ObjectId, ref: "User", required: true },
            receiver: { type: mongoose.Types.ObjectId, ref: "User", required: true },
            type: {type: String, enum: messages_types, default: 'text'},
            timestamp: { type: Date, default: Date.now }
        }
    ]
}, { timestamps: true });

const PersonalChat = mongoose.model("Personal", personalChatSchema)

module.exports = PersonalChat