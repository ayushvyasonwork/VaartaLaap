const User=require('../models/User');
const jwt=require('jsonwebtoken')
const bcrypt=require('bcrypt');
const user=require('../models/User')
const generateToken =require('../config/generateToken')
exports.signup=async (req,res)=>{
    try{
        let {name,email,password,confirmPassword}=req.body;
        console.log(`name:${name} `)
        console.log(`email:${email} `)
        console.log(`password:${password} `)
        // NEW CODE
        // console.log(`profilepic:${profilepic}`)
        // console.log(`role:${role}`)

        // NEW CODE
    // if(!name||!email||!password||!confirmPassword||!profilepic ){
    //     res.status(400).json(
    //         {
    //             success:false,
    //             message:'all fields are required'
    //         }
    //     );
    // }
    if(!name||!email||!password){
        res.status(400).json(
            {
                success:false,
                message:'all fields are required'
            }
        );
    }
    // if(password!==confirmPassword){
    //     res.status(401).json({
    //         success:false,
    //         message:'password not matching'
    //     })
    // }
    console.log("validation done ")
    const existingUser=await User.findOne({email});
    console.log(existingUser);
    if(existingUser){
        return res.status(405).json({
            success:false,
            message:'existing user'
        })
    }
    console.log('user is new ')
    let hashedPassword;
    
        hashedPassword=await bcrypt.hash(password,10);
        console.log(`hashed password is ${hashedPassword}`);
    
    console.log(`hashed password created `)
    console.log(`user is ${name}`)

    // user create
const newUser=await User.create({
    name,
    email,
    password:hashedPassword,
    // profilepic,
    // role
})
console.log(`new entry creasted : ${newUser}`);
return res.status(200).json({
    success:true,
    data:{  
        _id:newUser._id,
        name:newUser.name,
        email:newUser.email,
        isAdmin:newUser.isAdmin,
        // profilePic:newUser.profilePic,
        token:generateToken(newUser._id)
    },
    message:'new entry created successfully'
})
    }catch(e){
        console.log(e)
        res.status(500).json({
            success:false,
            message:'internal server error'
        })
    }
}
exports.login=async (req,res)=>{
    try{
        let {email,password}=req.body;
        console.log(`details fetched successfully ${email} password ${password}`);
    if(!email||!password){
        res.status(400).json({
            success:false,
            message:'all fields required'
        })
    }
    const user=await User.findOne({email});
    console.log(` user entry is ${user}`);
    if(!user){
        return res.status(401).json({
            success:false,
            message:'user did not registered'
        })
    }

    const payload={
        email:user.email,
        id:user.id,
        role:user.role
    }
    console.log(`payload is ${payload.email}`);
    const pass=await bcrypt.compare(password,user.password);
    if(pass){
        console.log(process.env.JWT_SECRET)
        let token=jwt.sign(payload,process.env.JWT_SECRET,{
            expiresIn:'1h'
        })
        console.log(`user is ${user}`)
        console.log(`token generated ${token}`)
        // user=user.toObject();   
        console.log(`user is ${user}`)
        user.token=token;
        console.log(`before password ${user.password}`)
        user.password=undefined
        console.log(`after password ${user.password}`)
        const options={
            expires:new Date(Date.now()+60*60*1000),
            httpOnly:true
        }
        console.log(options)
        return res.cookie("token",token,options).status(201).json({
            success:true,
            token,
            data:user,
            message:'token generated'
        })
        // console.log(`cookie generasted ${cookie}`)
        // res.status(200).json({
        //     success:true,
        //     token,
        //     user,
        //     message:"res in console"
        // })

    }
    else{
        return res.status(403).json({
            success: false,
            message: 'password do not match ',
        });
    }
    }catch(e){
        // res.status(500).json({
        //     success: false,
        //     message: 'internal server error  ',
        // });
        console.log(e)
    }
}
exports.findUsers=async (req,res)=>{
    // 'i ' represents that serach query is case insensitive for upper lower case
    console.log('entered 1')
    try{
        console.log('entered 2')
        const keyword=req.query.search?{
            $or:[{name:{$regex:req.query.search,$options:'i'}},
                {email:{$regex:req.query.search,$options:'i'}}
            ]
        }:{};
        console.log('entered 3')
        const users=await user.find(keyword).find({_id:{$ne:req.user._id}});
        console.log('entered 4')
        res.send({users});
        console.log('entered 5')
    }catch(e){
        res.status(500).json({
            message:'internal server error in searching for users'
        })
    }

}