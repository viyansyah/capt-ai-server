require('dotenv').config()
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({apiKey:process.env.GEMINI_API_KEY});

async function generateCaption(prompt,tone,platform) {
    try {
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: `kamu adalah profesional caption writer, berikan caption untuk post ini : ${prompt} dengan tone ${tone} untuk platform ${platform}`,
        });
    
        const text = response.candidates[0].content.parts[0].text;
        return text;
    } catch (error) {
        console.log(error);
        
    }
 
}


module.exports = generateCaption;