const client = require('../helpers/uploadCare');
const {Caption} = require('../models');
const generateCaption = require('../services/gemini');

class CaptionController{

    static async addCaption(req,res,next){
        try {
            const {prompt,tone,platform} = req.body;

            if(!prompt || !tone || !platform){
                return res.status(400).json({message:"tone prompt platform is required"})
            }
            const generatedText = await generateCaption(prompt,tone,platform);
           
            let imageUrl=null;
           
            if(req.file){
                const result=await  client.uploadFile(req.file.buffer,{
                    fileName:req.file.originalname,
                    contentType:req.file.mimetype
                })
                
                imageUrl=`https://122o2p5jkf.ucarecd.net/${result.uuid}/`
                

            }
            
            
            console.log("FINAL IMAGE URL:", imageUrl)
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
            const {prompt,tone,platform} = req.body;
            const caption = await Caption.update({prompt,tone,platform},{
                where:{id,userId:req.user.id}
            });
            
            res.status(200).json(caption);
            
        } catch (error) {
            next(error)
            
        }
    }
    


}
module.exports = CaptionController;


