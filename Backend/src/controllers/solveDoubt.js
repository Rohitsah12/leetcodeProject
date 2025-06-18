const { GoogleGenAI } = require("@google/genai");
const buildSystemInstruction = require("../utils/geminiPromptBuilder");

const solveDoubt = async (req, res) => {
  try {
    const { messages, title, description, testCases, startCode } = req.body;
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_KEY });

    const systemInstruction = buildSystemInstruction({ title, description, testCases, startCode });

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: messages,
      config: {
        systemInstruction,
      },
    });

    const reply = response.text || response.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated";

    res.status(201).json({ message: reply });
    console.log("Gemini Reply:", reply);

  } catch (err) {
    console.error("Gemini API Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = solveDoubt;
