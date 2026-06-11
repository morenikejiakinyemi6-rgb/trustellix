import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '.env') });

import express from 'express';
import cors from 'cors';
import Groq from 'groq-sdk'; // Imported to handle screenshot reading with your existing Groq key
import verifyRoute from './routes/verify.js';
import infrastructureRoute from './routes/infrastructure.js';
import quickscanRoute from './routes/quickscan.js';

const app = express();

app.use(cors({ origin: '*' }));

// Increased body limit to 50mb so large screenshot base64 strings don't cause 'Payload Too Large' errors
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Your existing operational routes
app.use('/api/verify', verifyRoute);
app.use('/api/infrastructure', infrastructureRoute);
app.use('/api/quickscan', quickscanRoute);

// 🔥 THE NEW ROUTE: Secure server-side screenshot text extraction using Groq
app.post('/api/extract-image', async (req, res) => {
  try {
    const { image } = req.body; // Receives the base64 string from your frontend InlineDemo
    
    if (!image) {
      return res.status(400).json({ error: 'No image data provided' });
    }

    if (!process.env.GROQ_API_KEY) {
      console.error("❌ GROQ_API_KEY is missing from server environment variables.");
      return res.status(500).json({ error: 'Server configuration mismatch' });
    }

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    // Using Groq's Llama-3.2 Vision model to read text from your screenshot
    const completion = await groq.chat.completions.create({
      model: "llama-3.2-11b-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Extract all text from this job posting screenshot. Include: job title, company name, location, salary, job description, requirements, and contact details. Return the extracted text only, preserving structural line breaks."
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${image}`
              }
            }
          ]
        }
      ],
      temperature: 0.1,
    });

    const extractedText = completion.choices[0]?.message?.content;
    
    if (extractedText) {
      return res.json({ text: extractedText });
    }
    
    throw new Error('Groq visual extraction returned empty content');

  } catch (err) {
    console.error('Error in Groq image extraction route:', err.message);
    res.status(500).json({ error: 'Failed to extract text from screenshot' });
  }
});

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'Trustellix Engine Online',
    timestamp: new Date().toISOString(),
    endpoints: ['/api/verify', '/api/infrastructure', '/api/quickscan', '/api/extract-image'],
  });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🛡️  Trustellix backend running on port ${PORT}`);
});