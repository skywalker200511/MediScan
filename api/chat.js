import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function handler(req, res) {
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
    const { message, context } = req.body;

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = context 
      ? `Previous context: ${context}\n\nUser question: ${message}\n\nProvide a helpful medical information response. Always remind users to consult healthcare professionals for medical advice.`
      : `User question: ${message}\n\nProvide helpful medical information. Always remind users to consult healthcare professionals for medical advice.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return res.status(200).json({ 
      success: true,
      reply: text 
    });

  } catch (error) {
    console.error('Error in chat:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Failed to process your question. Please try again.' 
    });
  }
}