const {OAuth2Client} = require('google-auth-library');
const { signToken } = require('../helpers/jwt');
const { User } = require('../models');
const { comparePassword } = require('../helpers/bcrypt');


class UserController{
    static async register(req,res,next){
        try {
           const {email,password}=req.body
           if(!email || !password){
            throw{name:"Bad Request",statusCode:400,message:"Email and password are required"}
           }
           const user = await User.create({email,password})
           const result={
            email:user.email,
            id:user.id
           }
           res.status(201).json(result)
        } catch (error) {
            next(error)
            
        }
    }

    static async login(req,res,next){
        try {
            const {email,password}=req.body
            const user = await User.findOne({where:{email}})
            if(!user){
                return res.status(404).json({message:"User not found"})
            }
            const validPassword =await comparePassword(password,user.password)
            if(!validPassword){
                return res.status(401).json({message:"Invalid password"})
            }
            const payload={
                id:user.id,
                
               }
            const access_token = signToken(payload)
            res.status(200).json({access_token})
        } catch (error) {
            next(error)
            
        }
    }
}


module.exports = UserController;