// controllers/feedbackController.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const feedbackcontroller = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message is required" });
    }

    // System instruction: AI as Pet Care Assistant
    const systemInstruction = `
You are a helpful AI-powered Pet Care Assistant.
Your role:
- Answer user questions about pet health, nutrition, grooming, training, adoption, and general care.
- Provide practical, safe, and reliable advice.
- If the question is unrelated to pets or animal care, politely refuse and suggest asking about pet care instead.
- Keep answers clear and concise (1–4 short paragraphs).
`;

    // User prompt
    const userPrompt = `User question: ${message}\n\nAnswer:`;

    // Merge full prompt
    const fullPrompt = systemInstruction + "\n\n" + userPrompt;

    const result = await model.generateContent(fullPrompt);

    const reply =
      result?.response?.text() ||
      "Sorry — I couldn't generate an answer right now.";

    return res.json({ reply });
  } catch (err) {
    console.error("Gemini error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports = { feedbackcontroller };
