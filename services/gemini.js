require('dotenv').config()
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({apiKey:process.env.GEMINI_API_KEY});

async function generateCaption(prompt,tone,platform,imageBuffer,mimeType) {
    try {
        const base64Image = imageBuffer.toString("base64");
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: [
            {
                parts:[
                    {
                        text:`kamu adalah profesional caption writer, berikan 1 caption terbaik  maksimal 120 karakter untuk post ini : ${prompt} dengan tone ${tone} untuk platform ${platform} hasilnya caption langsung tidak ada tambahan apa apa`
                    },
                    {
                        inlineData:{
                            mimeType:mimeType,
                            data:base64Image
                        }
                    }
                ]
            }
        ]
        });
    
        const text = response.candidates[0].content.parts[0].text;
        return text;
    } catch (error) {
        console.log(error);
        throw error;
        
    }
 
}


module.exports = generateCaption;