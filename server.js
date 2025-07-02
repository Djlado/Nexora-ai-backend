import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY environment variable is not set.");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

app.post('/chat', async (req, res) => {
  // --- NEW LOGGING CHECKPOINT ---
  console.log('==> Received a request at the /chat endpoint');
  console.log('==> Request body:', req.body); // This will show us the data being sent
  // ------------------------------

  try {
    const { message } = req.body;
    if (!message) {
      console.error('==> Error: Message field is missing in the request body.');
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
  // --- NEW LOGGING CHECKPOINT ---
  console.log('==> Health check request received at /');
  // ------------------------------
  res.send('Nexora AI Backend is running!');
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
