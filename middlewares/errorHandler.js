const errorHandler = (err,req,res,next)=>{
    if(err.statusCode){
        return res.status(err.statusCode).json({message:err.message})
    }

    if(err.name === "Unauthorized"){
        return res.status(401).json({message:err.message})
    }
    if(err.name === "not found"){
        return res.status(404).json({message:err.message})
    }
    if(err.name === "Bad Request"){
        return res.status(400).json({message:err.message})
    }
    if(err.name === "SequelizeValidationError" || err.name === "SequelizeUniqueConstraintError"){
        return res.status(400).json({message:err.message})
    }
    return res.status(500).json({message:"Internal Server Error"})
}

module.exports = errorHandler;