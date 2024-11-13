const jwt=require('jsonwebtoken');
require('dotenv').config();

exports.auth = (req, res, next) => {
    console.log('Auth middleware triggered');

    try {
        // Fetch token from cookies
        const token = req.cookies.token || req.header('Authorization').replace("Bearer ","") ;
        console.log(`Token: ${token}`);

        if (!token) {
            // If no token, respond with an error
            return res.status(400).json({
                success: false,
                message: 'Token not present',
            });
        }

        // Verify the token
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        console.log(`Payload: ${JSON.stringify(payload)}`);

        // Attach user data to the request object
        req.user = payload;

        console.log('Payload successfully attached to req.user');
        // Proceed to the next middleware/controller
        next();
    } catch (error) {
        console.log(`Error in auth middleware: ${error.message}`);

        // Handle token verification errors and any other issues
        return res.status(500).json({
            success: false,
            message: 'Error in authentication. Invalid token or internal error.',
        });
    }
};
exports.Inuser = (req,res,next)=>{
    try{
        if(req.user.role!=="User"){
            return res.status(401).json({
                success:false,
                message:"this is protected route for student u are not allowed "
            })
        }
    }catch(err){
        return res.status(500).json({
            success:false,
            message:"role not available "
        })
    }
    next()
}
exports.Inadmin = (req,res,next)=>{
    try{
        if(req.user.role!=="Admin"){
            return res.status(401).json({
                success:false,
                message:"this is protected route for Admin  u are not allowed "
            })
        }
    }catch(err){
        return res.status(500).json({
            success:false,
            message:"role not available "
        })
    }
    next()
}