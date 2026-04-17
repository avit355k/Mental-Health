// routes/chat.js
const express = require("express");
const router = express.Router();
const axios = require("axios");


const systemPrompt = `
You are CalmBridge AI, a compassionate mental health assistant.
- Be empathetic, calm, and supportive
- Do NOT give medical diagnosis
- Encourage seeking professional help if needed
- Keep responses short and comforting
`;

router.post("/", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ response: "Message is required" });
    }

    const ollamaRes = await axios.post("http://localhost:11434/api/chat", {
      model: "seabass118/Empathetic-AI",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      stream: false
    });

    res.json({
      response: ollamaRes.data.message.content
    });

  } catch (error) {
    console.error("Ollama Error:", error.message);

    res.status(500).json({
      response: "I'm here with you, but I'm having trouble responding right now."
    });
  }
});

module.exports = router;