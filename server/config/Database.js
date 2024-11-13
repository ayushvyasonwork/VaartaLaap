const mongoose= require('mongoose');
require('dotenv').config();
const dbConnect=async ()=>{
    try{
        await mongoose.connect(process.env.DATABASE_URL,{
            useNewUrlParser:true,
            useUnifiedTopology:true,
            
        })
        .then(console.log('db connection successful'))
        .catch((e)=>{
            console.log('error occured while connecting database');
            console.error(e.message);
            process.exit(1);
        });
    }catch(e){
            console.log(e);
    }
}
module.exports=dbConnect;