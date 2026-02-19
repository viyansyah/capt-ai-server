const errorHandler = (err,req,res,next)=>{
    if(err.name === "Unauthorized"){
        return res.status(401).json({message:err.message})
    }
    if(err.name === "not found"){
        return res.status(404).json({message:err.message})
    }
    if(err.name === "Bad Request"){
        return res.status(400).json({message:err.message})
    }
    if(err.name === "SequelizeValidationError"){
        return res.status(400).json({message:err.message})
    }
    return res.status(500).json({message:"Internal Server Error"})
}

module.exports = errorHandler;