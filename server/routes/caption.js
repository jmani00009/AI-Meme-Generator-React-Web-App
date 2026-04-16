import { Router } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = Router();

function parseCaption(rawText) {
  const cleanedText = rawText.replace(/```json|```/gi, "").trim();

  const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      const parsed = JSON.parse(jsonMatch[0]);
      if (parsed.top && parsed.bottom) {
        return {
          top: String(parsed.top).slice(0, 120),
          bottom: String(parsed.bottom).slice(0, 120),
        };
      }
    } catch (_err) {
      // Fall back to alternate parsing.
    }
  }

  try {
    const parsed = JSON.parse(cleanedText);
    if (parsed.top && parsed.bottom) {
      return {
        top: String(parsed.top).slice(0, 120),
        bottom: String(parsed.bottom).slice(0, 120),
      };
    }
  } catch (_err) {
    // Fall back to line-based parsing.
  }

  const lines = cleanedText
    .split("\n")
    .map((line) => line.replace(/^[-*\d.)\s]+/, "").trim())
    .filter(Boolean);

  const top = (lines[0] || "WHEN YOU OPEN THE APP").slice(0, 120);
  const bottom = (lines[1] || "AND THE MEMES HIT IMMEDIATELY").slice(0, 120);

  return { top, bottom };
}

function fallbackCaption(topic, style) {
  const safeTopic = String(topic || "this situation").trim();
  const safeStyle = String(style || "funny").toLowerCase();

  if (safeStyle.includes("dark")) {
    return {
      top: `ME THINKING ABOUT ${safeTopic}`.slice(0, 120),
      bottom: "AND REALITY HITS LIKE A TRUCK".slice(0, 120),
    };
  }

  if (safeStyle.includes("relatable")) {
    return {
      top: `WHEN ${safeTopic.toUpperCase()} HAPPENS AGAIN`.slice(0, 120),
      bottom: "EVERYONE PRETENDS IT IS NORMAL".slice(0, 120),
    };
  }

  return {
    top: `ME TRYING TO HANDLE ${safeTopic.toUpperCase()}`.slice(0, 120),
    bottom: "TASK FAILED SUCCESSFULLY".slice(0, 120),
  };
}

router.post("/", async (req, res) => {
  try {
    const { topic, style, template } = req.body || {};
    const safeTemplate = template || "Classic";

    if (!topic || !style) {
      return res.status(400).json({ error: "Topic and style are required." });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Missing GEMINI_API_KEY in server environment." });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const modelsToTry = ["gemini-2.0-flash-lite", "gemini-2.0-flash", "gemini-flash-latest"];

    const prompt = `Generate ${style} meme top and bottom text about ${topic}. Template: ${safeTemplate}. Return strict JSON with keys top and bottom only.`;

    let text = "";
    let lastError;

    for (const modelName of modelsToTry) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        text = response.text();
        if (text) {
          break;
        }
      } catch (modelError) {
        lastError = modelError;
      }
    }

    if (!text) {
      throw lastError || new Error("No model produced content");
    }

    const caption = parseCaption(text);
    return res.json(caption);
  } catch (error) {
    console.error("Caption generation failed:", error);
    const { topic, style } = req.body || {};
    const fallback = fallbackCaption(topic, style);
    return res.json({ ...fallback, fallbackUsed: true });
  }
});

export default router;
