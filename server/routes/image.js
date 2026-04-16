import { Router } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = Router();

function fallbackImagePrompt(topic, style) {
  const safeTopic = String(topic || "daily life").trim();
  const safeStyle = String(style || "funny").toLowerCase();

  if (safeStyle.includes("dark")) {
    return `moody cinematic meme scene about ${safeTopic}, dramatic lighting, expressive faces`;
  }

  if (safeStyle.includes("relatable")) {
    return `relatable meme moment about ${safeTopic}, everyday chaos, expressive reaction`;
  }

  return `funny meme scene about ${safeTopic}, exaggerated expression, internet meme style`;
}

async function generateImagePrompt(genAI, topic, style) {
  const modelsToTry = ["gemini-2.0-flash-lite", "gemini-2.0-flash", "gemini-flash-latest"];
  const prompt = `Create a short image generation prompt (max 15 words) for a ${style} meme about: "${topic}". Return only the prompt text.`;

  let text = "";
  let lastError;

  for (const modelName of modelsToTry) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      text = response.text()?.trim();
      if (text) {
        break;
      }
    } catch (error) {
      lastError = error;
    }
  }

  if (!text) {
    throw lastError || new Error("Prompt generation failed");
  }

  return text.replace(/```/g, "").trim();
}

router.post("/", async (req, res) => {
  try {
    const { topic, style } = req.body || {};

    if (!topic || !style) {
      return res.status(400).json({ error: "Topic and style are required." });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Missing GEMINI_API_KEY in server environment." });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const imagePrompt = await generateImagePrompt(genAI, topic, style);
    const encodedPrompt = encodeURIComponent(imagePrompt);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=768&height=768&nologo=true`;

    return res.json({ imageUrl, imagePrompt });
  } catch (error) {
    console.error("Image generation failed:", error);
    const { topic, style } = req.body || {};
    const imagePrompt = fallbackImagePrompt(topic, style);
    const encodedPrompt = encodeURIComponent(imagePrompt);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=768&height=768&nologo=true`;
    return res.json({ imageUrl, imagePrompt, fallbackUsed: true });
  }
});

export default router;
