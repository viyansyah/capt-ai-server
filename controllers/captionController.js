const client = require('../helpers/uploadCare');
const {Caption} = require('../models');
const generateCaption = require('../services/gemini');

class CaptionController{

    static async addCaption(req,res,next){
        try {
            const {prompt,tone,platform} = req.body;

            if(!prompt || !tone || !platform){
                throw{name:"Bad Request",statusCode:400,message:"tone prompt platform is required"} 
            }
            
           
            if(!req.file){
                throw{name:"Bad Request",statusCode:400,message:"Image is required"   }
            }
                const imageBuffer=req.file.buffer;
                const result=await  client.uploadFile(imageBuffer,{
                    fileName:req.file.originalname,
                    contentType:req.file.mimetype
                })
                
                const imageUrl=`https://122o2p5jkf.ucarecd.net/${result.uuid}/`
                

            
            const generatedText = await generateCaption(
                prompt,
                tone,
                platform,
                );
            
           
            const caption = await Caption.create({
                prompt,
                tone,
                platform,
                generatedText,
                imageUrl:imageUrl,
                userId:req.user.id
                
            });
            
            console.log(caption);
            
            res.status(201).json(caption);
            
        } catch (error) {
            next(error)
        }
    }
    static async readCaption(req,res,next){
        try {
            
            const caption = await Caption.findAll({
                where:{userId:req.user.id}
            });
            res.status(200).json(caption);
            
        } catch (error) {
            next(error)
            

        }
    }
    
    static async deleteCaption(req,res,next){
        try {
            const {id} = req.params;
            const caption = await Caption.destroy({
                where:{id,userId:req.user.id}
            });
            if(!caption){
               throw{name:"not found",statusCode:404,message:"Caption not found"}    
            }
            res.status(200).json({ message: "Caption-AI deleted successfully" });
            
        } catch (error) {
            next(error)
            
        }
    }
    static async updateCaption(req,res,next){
        try {
            const {id} = req.params;
           
            const caption = await Caption.findOne({
                where:{id,userId:req.user.id}
            });
            if(!caption){
               throw{name:"not found",statusCode:404,message:"Caption not found"}    
            }
            
            
            const result=await generateCaption(
                caption.prompt,
                caption.tone,
                caption.platform,
            )
           
            
            
            caption.generatedText=result;
            await caption.save();
           
            
            res.status(200).json(caption);
            
        } catch (error) {
            next(error)
            
        }
    }
    
    


}
module.exports = CaptionController;


