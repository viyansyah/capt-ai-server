const {OAuth2Client} = require('google-auth-library');
const { signToken } = require('../helpers/jwt');
const { User } = require('../models');

class UserController{
    static async register(req,res){
        try {
           const {email,password}=req.body
           const user = await User.create({email,password})
           res.status(201).json(user)
        } catch (error) {
            console.log(error);
            
        }
    }

    static async login(req,res){
        try {
            const {email,password}=req.body
            const user = await User.findOne({where:{email}})
            if(!user){
                return res.status(404).json({message:"User not found"})
            }
            const validPassword = await comparePassword(password,user.password)
            if(!validPassword){
                return res.status(401).json({message:"Invalid password"})
            }
            const token = signToken({id:user.id})
            res.status(200).json({token})
        } catch (error) {
            console.log(error);
            
        }
    }
}


module.exports = UserController;