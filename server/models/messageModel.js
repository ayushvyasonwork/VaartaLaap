const mongoose=require('mongoose');
const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    // NEW CODE
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    // NEW CODE
    content: {
        type: String,
        trim: true
    },
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "chat"  // Reference to the chat model
    }
}, { timestamps: true });

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
