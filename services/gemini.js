require('dotenv').config()
const { GoogleGenAI } = require("@google/genai");
const ai = new GoogleGenAI({apiKey:process.env.GEMINI_API_KEY});

async function generateCaption(prompt,tone,platform) {
    try {
        
        const response = await ai.models.generateContent({
          model:"gemini-2.5-flash-lite",
          contents:`kamu adalah profesional caption writer.
          Tugas:
           buatkan 1 caption terbaik  maksimal 120 karakter.
           Detail :
           topik: ${prompt}
           tone : ${tone} 
           platform: ${platform}

           output
           Hanya caption tanpa tambahan apapun.`
        });
    
        const text = response.candidates[0].content.parts[0].text;
        return text;
    } catch (error) {
        console.log(error);
      
        
    }
 
}


module.exports = generateCaption;