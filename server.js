const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");

const app = express();
const PORT = process.env.PORT || 3000;

// 🔐 DIRECTLY INSERTED API KEY (TEMPORARY)
const GEMINI_API_KEY = "AIzaSyCURz7A2o4Eb0iZa_rGxP5Rxgb5zL3oUkA";

app.use(cors());
app.use(bodyParser.json());

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: userMessage }] }],
        }),
      }
    );

    const data = await geminiRes.json();
    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, no response from Gemini.";
    res.json({ reply });
  } catch (err) {
    console.error("Gemini API error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/", (req, res) => {
  res.send("Nexora AI backend is live with hardcoded API key!");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
