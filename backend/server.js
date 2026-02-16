import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '.env') });

console.log('Starting MediScan server...');
console.log('API Key loaded:', process.env.GEMINI_API_KEY ? 'Yes ✓' : 'No ✗');
console.log('Port:', process.env.PORT || 3001);

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Configure multer for image uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'MediScan API is running!' });
});

// Medicine identification route
app.post('/api/identify-medicine', async (req, res) => {
  try {
    const { imageBase64 } = req.body;

    console.log('Received image upload request');

    if (!imageBase64) {
      console.log('No image provided');
      return res.status(400).json({ error: 'No image provided' });
    }

    console.log('Processing image...');

    // Use Gemini Flash Vision
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

    // Remove the data URL prefix if present
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
    console.log('Response preview:', text.substring(0, 100) + '...');

    res.json({ 
      success: true,
      medicineInfo: text 
    });

  } catch (error) {
    console.error('Error identifying medicine:', error);
    console.error('Error message:', error.message);
    res.status(500).json({ 
      success: false,
      error: 'Failed to identify medicine: ' + error.message 
    });
  }
});

// Chat route for follow-up questions
app.post('/api/chat', async (req, res) => {
  try {
    const { message, context } = req.body;

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = context 
      ? `Previous context: ${context}\n\nUser question: ${message}\n\nProvide a helpful medical information response. Always remind users to consult healthcare professionals for medical advice.`
      : `User question: ${message}\n\nProvide helpful medical information. Always remind users to consult healthcare professionals for medical advice.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ 
      success: true,
      reply: text 
    });

  } catch (error) {
    console.error('Error in chat:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to process your question. Please try again.' 
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🏥 MediScan server running on http://localhost:${PORT}`);
});