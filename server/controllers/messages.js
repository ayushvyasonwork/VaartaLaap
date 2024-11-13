const Message=require('../models/messageModel');
const Chat=require('../models/chatSchema');
const User=require('../models/User');

const allMessages = async (req, res) => {
    try {
        const chatId = req.params.chatId;
        console.log(`Fetching messages for chatId: ${chatId}`)

        const messages = await Message.find({ chat: chatId })
            .populate('sender', 'name pic email') 
            .populate('chat'); 

        if (!messages) {
            return res.status(404).json({ success: true, message: 'No messages found', messages: [] });
        }

        console.log("Found messages:", messages);

        res.status(200).json({
            success: true,
            messages
        });
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({
            success: false,
            message: 'Internal server error while fetching messages'
        });
    }
};

const sendMessage = async (req, res) => {
    const { content, chatId } = req.body;
    console.log(`content is ${content} and ${chatId}`);

    if (!content || !chatId) {
        return res.status(401).json({
            success: false,
            message: 'All fields are required',
        });
    }

    var newMessage = {
        sender: req.user.id,
        content: content,
        chat: chatId,
    };

    console.log(`new message is ${newMessage}`);

    try {
        

        // Create and save the message
        let message = await Message.create(newMessage);
        

        // Find the message by ID and populate sender and chat fields
        message = await Message.findById(message._id)
            .populate('sender', 'name pic')
            .populate('chat');
        

        // Populate the users in the chat
        message = await User.populate(message, {
            path: 'chat.users',
            select: 'name pic email',
        });
        

        // Update the chat's latestMessage field
        await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });
        

        // Send response
        res.status(200).json({
            success: true,
            message: 'Message sent successfully',
            data: message, // Return message for confirmation
        });

    } catch (e) {
        console.log(e); // Log the error for debugging
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};


module.exports = { allMessages, sendMessage };