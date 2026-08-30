const { GoogleGenerativeAI } = require('@google/generative-ai');
const env = require('../config/env');
const { getMockResponse } = require('./mockVisionService');

// ── Placeholder values that indicate no real key is set ───────────────────
const PLACEHOLDER_KEYS = new Set([
  'your_gemini_api_key_here',
  'YOUR_GEMINI_API_KEY',
  'test_key',
  '',
]);

function isMockMode() {
  const key = process.env.GEMINI_API_KEY || '';
  return PLACEHOLDER_KEYS.has(key.trim());
}

// ── Language labels used inside the prompt ────────────────────────────────
const LANGUAGE_NAMES = {
  en: 'English',
  ta: 'Tamil',
  hi: 'Hindi',
};

// ── Prompt templates ──────────────────────────────────────────────────────

function buildPrompt(language, mode) {
  const langName = LANGUAGE_NAMES[language] || 'English';
  const modeInstruction =
    mode === 'undome'
      ? 'The user just performed an action and wants to know what changed or what they did. Focus on explaining the current state and confirming whether anything bad happened.'
      : 'The user is confused by this screen and needs help knowing what to do next.';

  return `You are ScreenSaathi, a kind and patient AI assistant helping elderly people (60+ years old) understand their phone or computer screens.

${modeInstruction}

CRITICAL RULES:
1. You MUST respond ONLY in ${langName} language for all text fields.
2. You MUST respond ONLY with a valid JSON object — no markdown, no text outside the JSON.
3. Use very simple, warm, and clear language suitable for elderly users.
4. Keep sentences short. Avoid technical jargon.
5. NEVER tell the user to do something that could harm them.

SCAM DETECTION — Check carefully for ALL of these danger signals:
- Any request to enter OTP, PIN, password, or any secret number
- Urgent language ("Your account will be blocked", "Act immediately", "Last warning")
- Requests to transfer money, pay fees, or buy gift cards
- Spoofed bank/government logos with suspicious URLs or design
- Unusual pop-ups asking for personal information
- Requests to call an unknown number

CONFIDENCE SCORING:
- Be honest about your confidence (0.0 to 1.0)
- If the image is blurry, cropped, or hard to read: confidence below 0.5
- If this screen involves banking, payments, or money: apply extra caution
- If you genuinely cannot determine what the screen shows: confidence below 0.4

Respond with this exact JSON structure (no other text):
{
  "reassurance": "A short, calming sentence. Maximum 15 words. Something like 'Nothing bad has happened.' or 'You are safe.'",
  "explanation": "Plain language explanation of what this screen is showing. Maximum 2 short sentences.",
  "next_action": "ONE single clear action the user should take right now. Maximum 20 words. Or null if scam_flag is true or you are not confident.",
  "confidence": <number between 0.0 and 1.0>,
  "scam_flag": <true or false>,
  "scam_reason": "<If scam_flag is true: explain in simple terms what looks dangerous. Otherwise: null>",
  "involves_money": <true if this screen involves banking, payments, money transfers, UPI, or purchases. Otherwise false>,
  "escalation_message": "<If confidence is low or involves_money is true and you are unsure: a calm message telling the user to call their bank or ask family. Otherwise: null>"
}`;
}

// ── Main service function ─────────────────────────────────────────────────

/**
 * Analyzes a screenshot image using Gemini's vision capabilities.
 * The image buffer is converted to base64 for the API call and is NOT
 * stored or sent anywhere else.
 *
 * @param {Buffer} imageBuffer - Raw image bytes
 * @param {string} mimeType - e.g. "image/jpeg"
 * @param {string} language - "en" | "ta" | "hi"
 * @param {string} mode - "stuck" | "undome"
 * @returns {Promise<Object>} Parsed structured result
 */
async function analyzeImage(imageBuffer, mimeType, language = 'en', mode = 'stuck') {
  // ── Mock mode: no real API key set ────────────────────────────────────────
  if (isMockMode()) {
    console.log('[visionService] MOCK MODE — returning demo response (set a real GEMINI_API_KEY to use live AI)');
    // Simulate realistic processing delay (1.5–2.5 seconds)
    await new Promise((r) => setTimeout(r, 1500 + Math.random() * 1000));
    return getMockResponse(language, mode);
  }

  const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY());
  const model = genAI.getGenerativeModel({ model: 'gemini-3.6-flash' });

  const prompt = buildPrompt(language, mode);
  const base64Image = imageBuffer.toString('base64');

  const imagePart = {
    inlineData: {
      data: base64Image,
      mimeType,
    },
  };

  // Set a 30-second timeout for the API call
  const timeoutMs = 30_000;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  let rawText;
  try {
    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    rawText = response.text();
  } finally {
    clearTimeout(timeoutId);
  }

  return parseGeminiResponse(rawText);
}

/**
 * Parses the raw text from Gemini into a structured object.
 * Handles markdown code fences that the model sometimes includes.
 */
function parseGeminiResponse(rawText) {
  // Strip markdown code fences if present
  let cleaned = rawText.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '').trim();
  }

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    console.error('[visionService] Failed to parse Gemini response as JSON:', rawText);
    throw Object.assign(
      new Error('The AI returned an unexpected response format.'),
      { status: 502 }
    );
  }

  // Validate required fields
  const required = ['reassurance', 'explanation', 'confidence', 'scam_flag'];
  for (const field of required) {
    if (parsed[field] === undefined) {
      console.warn(`[visionService] Missing field in Gemini response: ${field}`);
    }
  }

  // Normalise confidence to 0-1 range
  if (typeof parsed.confidence === 'number') {
    parsed.confidence = Math.max(0, Math.min(1, parsed.confidence));
  } else {
    parsed.confidence = 0.5;
  }

  return parsed;
}

module.exports = { analyzeImage };
