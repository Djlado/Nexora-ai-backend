const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.post('/generate', async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await fetch(\`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=\${process.env.GEMINI_API_KEY}\`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: userMessage }] }]
      })
    });

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn’t understand.";
    res.json({ reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ reply: 'An error occurred while processing your message.' });
  }
});

app.get('/', (req, res) => {
  res.send('Nexora AI Backend is running');
});

app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});