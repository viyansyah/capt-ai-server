const {verifyIdToken} = require('../helpers/jwt');
const {User} = require('../models');

const authentication = async (req,res,next)=>{
    try {
        const authorization = req.headers.authorization;
        if(!authorization){
            throw{name:"Unauthorized",statusCode:401,message:"Token is required"}
        }
        const token = authorization.split(" ")[1];
        const decodedToken = verifyIdToken(token);
        const user = await User.findByPk(decodedToken.id);
        if(!user){
            throw{name:"Unauthorized",statusCode:401,message:"User not found"}
        }
        req.user = user.id;
        next();
    } catch (error) {
        next(error);
    }
}

module.exports = authentication;