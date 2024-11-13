const mongoose=require('mongoose');
const User=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    profilePic:{
        type:String,
        required:true,
        default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
    //NEW CODE
    // chats:[{
    //     type:mongoose.Schema.Types.ObjectId,
    //     ref:"chat"
    // }],
    isAdmin: {
        type: Boolean,
        required: true,
        default: false,
      },
},{
    timestamps:true
})
const user=mongoose.model('User',User);
module.exports= user;