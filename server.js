import express from 'express';
import dotenv from 'dotenv';
// We are keeping cors, but adding manual headers as well for maximum compatibility.
import cors from 'cors'; 
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// --- POWERFUL DEBUGGING MIDDLEWARE ---
// This new section manually sets headers to allow all connections.
// This will force the connection from Vercel to be accepted.
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  console.log(`==> Received a ${req.method} request for ${req.url}`);
  next();
});
// ------------------------------------

app.use(cors());
app.use(express.json());

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY environment variable is not set.");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

app.post('/chat', async (req, res) => {
  console.log('==> Request successfully reached /chat endpoint');
  console.log('==> Request body:', req.body);

  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required.' });
    }

    const result = await model.generateContent(message);
    const response = result.response;
    const text = response.text();

    res.json({ response: text });
  } catch (error) {
    console.error('==> Error during Gemini API call:', error);
    res.status(500).json({ error: 'Failed to generate AI response.' });
  }
});

app.get('/', (req, res) => {
  res.send('Nexora AI Backend is running!');
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
