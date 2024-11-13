const mongoose = require('mongoose');
const chat = require('../models/chatSchema');
const user = require('../models/User');

// Fetch a one-on-one chat
const accessChat = async (req, res) => {
   
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'User ID not available',
            });
        }
        let isChat = await chat.find({
            isGroupChat: false,
            $and: [
                { users: { $elemMatch: { $eq: req.user._id } } },
                { users: { $elemMatch: { $eq: userId } } },
            ],
        })
        .populate('users', '-password')
        .populate('latestMessage');
        isChat = await user.populate(isChat, {
            path: 'latestMessage.sender',
            select: 'name email profilePic',
        });
        // If a chat exists, return the topmost result
        if (isChat && isChat.length > 0) {
            return res.send(isChat[0]); // Exit the function after sending response
        }   
        // If not, fetch the other user to get the name
        const otherUser = await user.findById(userId).select('name');
        // Create a new chat with the name of the other user
        let newChat = {
            chatname: otherUser.name, // Use the other user's name here
            isGroupChat: false,
            users: [req.user.id, userId],
        };
        const createdChat = await chat.create(newChat);
        const FullChat = await chat.findOne({ _id: createdChat._id }).populate(
            'users',
            '-password',
        );
        return res.status(200).json({
            FullChat,
        });

    } catch (e) {
        console.log(e); // Add a console log for better debugging
        return res.status(500).json({
            success: false,
            message: 'Internal server error in one-to-one chat controller ayush ',
        });
    }
};
// fetch 
const fetchChats = async (req, res) => {
    try {
        // Find all chats where the current user is part of
        let results = await chat.find({
            users: { $elemMatch: { $eq: req.user.id } },
        })
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
        .populate("latestMessage")
        .sort({ updatedAt: -1 });

        // Populate the latestMessage sender
        results = await user.populate(results, {
            path: "latestMessage.sender",
            select: "name profilePic email",
        });
        // Moved inside the correct scope to access the variable
        // Send the results back as response
        res.status(200).json({
            success: true,
            results,
        });
    } catch (e) {
        console.log(e); // Add logging to debug if needed
        res.status(500).json({
            success: false,
            message: "Internal server error while fetching all chats of a user",
        });
    }
};


const createGroupChat = async (req, res) => {
    if (!req.body.users || !req.body.name) {
        return res.status(400).send({ message: "Please fill all the fields" });
    }
    console.log(req.body.name)
    // Check if a group with the same name already exists
    const checkExisting = await chat.findOne({ chatname: req.body.name });
    if (checkExisting) {
        return res.status(400).json({
            success: false,
            message: 'A group chat with this name already exists',
        });
    }

    // Parse the users from the request
    let users = JSON.parse(req.body.users);

    if (users.length < 2) {
        return res.status(400).send("More than 2 users are required to form a group chat");
    }
   
    

    try {
        const usersId=[];
        for (let i = 0; i < users.length; i++) {
            const oneUser=await user.findOne({email:users[i]});
            usersId.push(oneUser);
          }
          req.user.id?usersId.push(req.user.id):usersId.push(req.body.userid);
          // Add the current user (as admin) to the users array
        console.log(`name is ${req.body.name}`)
        // Create the group chat
        const groupChat = await chat.create({
            chatname: req.body.name, // Ensure chatName is included here
            users: usersId,
            isGroupChat: true,
            groupAdmin: req.user.id?req.user.id:req.body.userid, // Set the current user as group admin
        });
        console.log(`here is the group chat ${groupChat}`);
        // Populate the users and groupAdmin fields
        const fullGroupChat = await chat.findOne({ _id: groupChat._id })
            .populate("users", "-password")
            .populate("groupAdmin", "-password");
        console.log(`full group chat is ${fullGroupChat}`)
        // Add `isAdmin` field to users
        const updatedGroupChat = fullGroupChat.users.map((user) => {
            if (user && user._id) {
                return {
                    ...user.toObject(),
                    isAdmin: user._id.toString() === req.user.id.toString(), // Set isAdmin to true for the group admin
                };
            }
            return user;
        });

        // Send the updated group chat along with `chatName`
        res.status(200).json({
            groupAdmin: fullGroupChat.groupAdmin,
            _id: fullGroupChat._id,
            chatname: fullGroupChat.chatname, // Include chatName in the response
            isGroupChat: fullGroupChat.isGroupChat,
            users: updatedGroupChat,
            createdAt: fullGroupChat.createdAt,
            updatedAt: fullGroupChat.updatedAt,
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};



// rename group 
const renamegroup=async (req,res)=>{
    try{
        const {chatId,chatName}=req.body;
        if(!chatId || !chatName){
            res.status(401).json({
                success:false,
                message:'all fields required'
            })
        }
        const updatedChat=await chat.findByIdAndUpdate(
            chatId,
            {
                chatname:chatName
            },
            {
                new:true
            }
        )
        .populate('users','-password')
        .populate('groupAdmin','-password')
        if(!updatedChat){
            res.status(400).json({
                success:false,
                message:'error while renaming'
            })
        }
        res.status(200).json({
            updatedChat
        })
    }catch(e){
        res.status(500).json({
            success:false,
            message:'internal server error '
        })
    }
}
const removefromGroup=async (req,res)=>{
    try{
        const {chatId,userId}=req.body;
        if(!chatId || !userId){
            res.status(401).json({
                success:false,
                message:'all fields required'
            })
        }
    const updatedUsers=await chat.findByIdAndUpdate(
        chatId,
        {
            $pull:{users:userId}
        },
        {
            new:true
        }
    )
    .populate("users","-password")
    .populate("groupAdmin","-password")
    res.status(200).json({
        success:true,
        message:'user removed from group'
    })
    }catch(e){
        res.status(500).json({
            success:false,
            message:'internal server error'
        })
    }
}
// add in  group 
const addInGroup=async (req,res)=>{
    console.log('we have entered the add in group controller')
    try{
        console.log('we have entered the try block')
        const {chatId,userId}=req.body;
        console.log(`chat id is ${chatId} and user id is ${userId}`);
        if(!chatId || !userId){
            res.status(401).json({
                success:false,
                message:'all fields required'
            })
        }
        console.log(`chat id ${chatId} and user is is ${userId}`)
    const updatedUsers=await chat.findByIdAndUpdate(
        chatId,
        {
            $push:{users:userId}
        },
        {
            new:true
        }
    )
    .populate("users","-password")
    .populate("groupAdmin","-password")
    res.status(200).json({
        sucess:true,
        data:updatedUsers,
        message:"user added in group"
    })
    }catch(e){
        console.log('we have entered the catch block')
        res.status(500).json({
            success:false,
            message:'internal server error '
        })
    }
}
const fetchGroups=async (req,res)=>{
    try{
        const fetchedGroups= await chat.find({isGroupChat:{$ne:'false'}});
        res.send({fetchedGroups});
    }catch(e){
        res.status(500).json({
            message:'internal server error in searching for groups'
        })
    }
}
const groupExit=async (req,res)=>{
    try{
        const {chatId}=req.body;
    const updatedUsers=await chat.findByIdAndUpdate(
        chatId,
        {
            $pull:{users:req.user.id}
        },
        {
            new:true
        }
    )
    .populate("users","-password")
    .populate("groupAdmin","-password")
    res.status(200).json({
        sucess:true,
        data:updatedUsers,
        message:"you exited from group"
    })
    }catch(e){
        console.log('we have entered the catch block')
        res.status(500).json({
            success:false,
            message:'internal server error '
        })
    }
}
const addSelfInGroup = async (req, res) => {
    try {
        console.log('entered 1');
        const { groupId } = req.body;
        console.log(`group id is ${groupId}`);

        if (!groupId) {
            return res.status(401).json({
                success: false,
                message: 'all fields required'
            });
        }

        console.log('entered 2');
        console.log(`user id is ${req.user.id}`);
        
        // First, update the document
        await chat.findByIdAndUpdate(
            groupId,
            { $push: { users: req.user.id } },
            { new: true }
        );

        // Then, retrieve the updated document with population
        const updatedUsers = await chat.findById(groupId)
            .populate("users", "-password")
            .populate("groupAdmin", "-password");

        if (!updatedUsers) {
            console.log('entered 3');
            return res.status(404).json({
                success: false,
                message: 'Group not found or failed to update'
            });
        }

        console.log(updatedUsers);
        res.status(200).json({
            success: true,
            data: updatedUsers,
            message: "You exited from group"
        });
        console.log('entered 4');
    } catch (error) {
        console.log('we have entered the catch block', error);
        res.status(500).json({
            success: false,
            message: 'internal server error'
        });
    }
};

module.exports = {
    accessChat,
    fetchChats,
    createGroupChat,
    renamegroup,
    addInGroup,
    removefromGroup,
    groupExit,
    fetchGroups,
    addSelfInGroup
  }
