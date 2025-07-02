import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middlewares
app.use(cors()); // Allows your Vercel frontend to connect
app.use(express.json()); // Allows the server to read JSON from requests

// Check for the API Key when the server starts
if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY environment variable is not set.");
}

// Initialize the Google AI SDK
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// API route for the chatbot
app.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required.' });
    }

    // Use the SDK to generate content
    const result = await model.generateContent(message);
    const response = result.response;
    const text = response.text();

    res.json({ response: text });
  } catch (error) {
    console.error('Error in /chat endpoint:', error);
    res.status(500).json({ error: 'Failed to generate AI response.' });
  }
});

// A simple route to check if the server is running
app.get('/', (req, res) => {
  res.send('Nexora AI Backend is running!');
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
    
