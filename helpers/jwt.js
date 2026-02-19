const jwt = require("jsonwebtoken");
const secret_key = process.env.JWT_SECRET;

const signToken=(payload)=>{
    return jwt.sign(payload,secret_key)
}


const verifyToken=(token)=>{
    return jwt.verify(token,secret_key)
}

module.exports={
    signToken,
    verifyToken
}