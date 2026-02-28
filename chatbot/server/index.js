import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });

const PORT = Number(process.env.PORT || 3001);
const CORS_ORIGIN = process.env.CORS_ORIGIN || "*";
const MAX_HISTORY_MESSAGES = 20;

const MODEL_PRIORITY = (process.env.GEMINI_MODEL ? [process.env.GEMINI_MODEL] : []).concat([
  "gemini-2.0-flash-lite",
  "gemini-2.0-flash",
  "gemini-2.5-flash",
  "gemini-flash-latest",
]);

const TOKEN_TIERS = [
  { min: 75, cost: 10, label: "Full response" },
  { min: 40, cost: 5, label: "Standard response" },
  { min: 10, cost: 2, label: "Brief response" },
  { min: 1, cost: 1, label: "Minimal response" },
];

function getTier(balance) {
  return TOKEN_TIERS.find((tier) => balance >= tier.min) || null;
}

function toGeminiRole(role) {
  return role === "assistant" ? "model" : "user";
}

function buildVerbosity(tier) {
  if (tier.min >= 75) return "Give thorough, detailed responses with examples.";
  if (tier.min >= 40) return "Give clear, concise responses.";
  if (tier.min >= 10) return "Be brief. Answer in 2-3 sentences maximum.";
  return "Answer in one sentence only.";
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function withRetry(fn, { retries = 3, baseDelayMs = 3000 } = {}) {
  let lastErr;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      const message = err?.message || "";
      const is429 =
        err?.status === 429 ||
        message.includes("429") ||
        message.includes("Too Many Requests") ||
        message.toLowerCase().includes("quota");

      if (!is429 || attempt === retries) {
        throw err;
      }

      const hint = message.match(/"retryDelay":"(\d+)s"/);
      const delay = hint ? Number(hint[1]) * 1000 : baseDelayMs * 2 ** attempt;
      await wait(delay);
    }
  }

  throw lastErr;
}

async function callGemini(apiKey, modelList, systemInstruction, geminiHistory, userText) {
  const genAI = new GoogleGenerativeAI(apiKey);
  let lastErr;

  for (const modelName of modelList) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName, systemInstruction });
      const chat = model.startChat({ history: geminiHistory });
      const result = await withRetry(() => chat.sendMessage(userText));
      return { reply: result.response.text().trim(), usedModel: modelName };
    } catch (err) {
      const message = err?.message || "";
      const is404 = err?.status === 404 || message.includes("404");
      const isHardQuota = err?.status === 429 && message.includes("limit: 0") && !/"retryDelay"/.test(message);

      if (is404 || isHardQuota) {
        lastErr = err;
        continue;
      }

      throw err;
    }
  }

  throw lastErr || new Error("All Gemini models exhausted.");
}

const app = express();
app.use(
  cors({
    origin: CORS_ORIGIN === "*" ? true : CORS_ORIGIN,
  })
);
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req, res) => {
  res.json({ ok: true, models: MODEL_PRIORITY });
});

app.get("/api/token-info", (req, res) => {
  const balance = Number(req.query.balance) || 0;
  const tier = getTier(balance);
  res.json({ tier, tiers: TOKEN_TIERS });
});

app.post("/api/chat", async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "your-gemini-api-key-here") {
      return res.status(500).json({
        error: "Server missing GEMINI_API_KEY. Add it to chatbot/server/.env and restart.",
      });
    }

    const balance = Number(req.body?.tokenBalance) || 0;
    const tier = getTier(balance);

    if (!tier) {
      return res.status(402).json({
        error: "Insufficient tokens. You need at least 1 AIUtilityToken to use this agent.",
        tokensRequired: 1,
        tokenBalance: balance,
      });
    }

    const newBalance = balance - tier.cost;
    const rawMessages = Array.isArray(req.body?.messages) ? req.body.messages : [];
    const validMessages = rawMessages
      .filter(
        (message) =>
          message &&
          typeof message === "object" &&
          (message.role === "user" || message.role === "assistant") &&
          typeof message.content === "string" &&
          message.content.trim()
      )
      .slice(-MAX_HISTORY_MESSAGES);

    const lastUserMessage = validMessages[validMessages.length - 1];
    if (!lastUserMessage) {
      return res.status(400).json({ error: "A user message is required." });
    }

    const historyMessages = validMessages.slice(0, -1);
    const geminiHistory = historyMessages.map((message) => ({
      role: toGeminiRole(message.role),
      parts: [{ text: message.content }],
    }));

    const systemInstruction =
      "You are an AI Governance Agent for a BNB blockchain project. " +
      "You help users understand blockchain concepts, token economics, smart contracts, " +
      "governance proposals, and DeFi mechanisms. " +
      `The user paid ${tier.cost} AIUtilityToken(s) for this message (remaining: ${newBalance}). ` +
      buildVerbosity(tier);

    const { reply, usedModel } = await callGemini(
      apiKey,
      MODEL_PRIORITY,
      systemInstruction,
      geminiHistory,
      lastUserMessage.content
    );

    return res.json({
      reply,
      tokenCost: tier.cost,
      tokenBalance: newBalance,
      tier: tier.label,
      model: usedModel,
    });
  } catch (err) {
    const status = typeof err?.status === "number" ? err.status : 500;
    const rawMessage = err?.message || "Gemini request failed.";
    let errorMessage = rawMessage;

    if (status === 401 || status === 403) {
      errorMessage = "Gemini authentication failed. Check GEMINI_API_KEY in chatbot/server/.env.";
    } else if (status === 429 || rawMessage.includes("429")) {
      errorMessage = "All Gemini models are currently rate-limited. Please retry shortly.";
    } else if (status === 404) {
      errorMessage = "No supported Gemini model found for this API key.";
    }

    return res.status(status >= 400 ? status : 500).json({ error: errorMessage });
  }
});

app.listen(PORT, () => {
  console.log(`AI server ready on http://localhost:${PORT}`);
  console.log(`Model priority: ${MODEL_PRIORITY.join(" -> ")}`);
});
