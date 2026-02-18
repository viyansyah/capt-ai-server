const {Caption} = require('../models');
class CaptionController{
    static async addCaption(req,res,next){
        try {
            const {prompt,tone,platform} = req.body;

            if(!prompt || !tone || !platform){
                return res.status(400).json({message:"tone prompt platform is required"})
            }
           
            let imageUrl=""
            if(req.file){
                const result=await  client.uploadFile(req.file.buffer,{
                    fileName:req.file.originalname,
                    contentType:req.file.mimetype
                })
                imageUrl=`https://122o2p5jkf.ucarecd.net/${result.uuid}/`


            }
            const caption = await Caption.create({
                prompt,
                tone,
                platform,
                userId:req.user,
                imageUrl:imageUrl
            });
            res.status(201).json(caption);
            
        } catch (error) {
            next(error)
        }
    }
    static async readCaption(req,res,next){
        try {
            const userId = req.user;
            const caption = await Caption.findAll({
                where:{userId}
            });
            res.status(200).json(caption);
            
        } catch (error) {
            next(error)
            

        }
    }
    
    static async deleteCaption(req,res,next){
        try {
            const {id} = req.params;
            const userId = req.user;
            const caption = await Caption.destroy({
                where:{id,userId}
            });
            if(!caption){
               throw{name:"Unauthorized",statusCode:404,message:"Caption not found"}    
            }
            res.status(200).json(caption);
            
        } catch (error) {
            next(error)
            
        }
    }
    static async updateCaption(req,res,next){
        try {
            const {id} = req.params;
            const userId = req.user;
            const {prompt,tone,platform} = req.body;
            const caption = await Caption.update({prompt,tone,platform},{
                where:{id,userId}
            });
            res.status(200).json(caption);
            
        } catch (error) {
            next(error)
            
        }
    }
    



}


