import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { imageBase64 } = req.body;

    console.log('Received image upload request');

    if (!imageBase64) {
      console.log('No image provided');
      return res.status(400).json({ error: 'No image provided' });
    }

    console.log('Processing image...');

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `
      You are a medical assistant. Analyze this medicine image and provide detailed information.
      
      Please identify:
      1. Medicine name (both generic and brand name if visible)
      2. What it's used for (indications)
      3. Common dosage
      4. Important side effects
      5. Warnings and precautions
      6. Drug interactions (common ones)
      
      Format your response in a clear, structured way.
      If you cannot identify the medicine clearly, say so.
      
      IMPORTANT: Add a disclaimer that this is for informational purposes only and users should consult a healthcare professional.
    `;

    const base64Data = imageBase64.includes(',') 
      ? imageBase64.split(',')[1] 
      : imageBase64;

    const imagePart = {
      inlineData: {
        data: base64Data,
        mimeType: 'image/jpeg',
      },
    };

    console.log('Calling Gemini API...');

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();

    console.log('Success! Response received');

    return res.status(200).json({ 
      success: true,
      medicineInfo: text 
    });

  } catch (error) {
    console.error('Error identifying medicine:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Failed to identify medicine: ' + error.message 
    });
  }
}