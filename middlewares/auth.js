const {verifyToken} = require('../helpers/jwt');
const {User} = require('../models');

const authentication = async (req,res,next)=>{
    try {
        const authorization = req.headers.authorization;
        if(!authorization){
            throw{name:"Unauthorized",statusCode:401,message:"Token is required"}
        }
        const token = authorization.split(" ")[1];
        if(!token){
            throw{name:"Unauthorized",statusCode:401,message:"Token is required"}
        }
        const decodedToken = verifyToken(token);
        if(!decodedToken.id){
            throw{name:"Unauthorized",statusCode:401,message:"Token is required"}
        }
        const user = await User.findByPk(decodedToken.id);
        if(!user){
            throw{name:"Unauthorized",statusCode:401,message:"User not found"}
        }
        req.user = {
            id:user.id,
            email:user.email    
        }
        next();
    } catch (error) {
        next(error);
    }
}

module.exports = authentication;