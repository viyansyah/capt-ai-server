const {OAuth2Client} = require('google-auth-library');
const { signToken } = require('../helpers/jwt');
const { User } = require('../models');
const { comparePassword } = require('../helpers/bcrypt');
const client = new OAuth2Client()

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
            if(!email || !password){
                throw{name:"Bad Request",statusCode:400,message:"Email and password are required"}
            }
            const user = await User.findOne({where:{email}})
            if(!user){
                return res.status(404).json({message:"Invalid password or email"})
            }
            const validPassword =await comparePassword(password,user.password)
            if(!validPassword){
                return res.status(401).json({message:"Invalid password or email"})
            }
            const payload={
                id:user.id,
               }
            const access_token = signToken(payload)
            if(!access_token){
                throw{name:"Bad Request",statusCode:400,message:"Token is required"}
            }
            res.status(200).json({access_token})
        } catch (error) {
            next(error)
            
        }
    }
    static async googleLogin(req,res,next){
        try {
            const {access_token_google}=req.headers
            if(!access_token_google){
                throw{name:"Bad Request",statusCode:400,message:"Google access token is required"}
            }
            const ticket = await client.verifyIdToken({
                idToken: access_token_google,
                audience: process.env.GOOGLE_CLIENT_ID,
            })
            const payload = ticket.getPayload()
           
            if(!payload.email_verified){
                throw{name:"Bad Request",statusCode:400,message:"Google access token is required"}
            }
            
            const [user,created]=await User.findOrCreate({
                where:{email:payload.email},
                defaults:{
                    email:payload.email,
                    password:Date.now().toString()+Math.random().toString()
                }
            })
           
          
           const access_token= signToken({id:user.id})
          
           
           res.status(200).json({access_token})
           
            
        } catch (error) {
            next(error)
            
        }
    }
}


module.exports = UserController;