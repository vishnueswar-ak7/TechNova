import { GoogleGenAI } from '@google/genai';

const LANGUAGE_NAMES = {
  en: 'English',
  ta: 'Tamil',
  hi: 'Hindi',
  te: 'Telugu',
  ml: 'Malayalam',
  kn: 'Kannada',
  mr: 'Marathi',
  bn: 'Bengali'
};

export default async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  try {
    const { image, language = 'en', mode = 'stuck' } = req.body;
    if (!image) return res.status(400).json({ error: 'No image provided.' });

    const langName = LANGUAGE_NAMES[language] || 'English';
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      // Return a mock response if no key is set, so the app still demos
      return res.json({
        summary: "This is a demo mode summary because no valid Gemini API key is configured on Vercel.",
        scamLikelihood: 0.1,
        isMoneyTransfer: false,
        nextAction: "Configure the GEMINI_API_KEY environment variable in Vercel."
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    // The user's image is a base64 string
    const imagePart = {
      inlineData: {
        data: image,
        mimeType: 'image/png'
      }
    };

    let prompt = '';
    if (mode === 'undome') {
      prompt = `You are a reassuring technical assistant.
The user is panicked and asking "What did I just do?".
Look at the screen and figure out what action just happened (e.g. money sent, app installed, setting changed).
Reassure them first, then explain simply what happened.

IMPORTANT: You must respond with ONLY a raw JSON object (no markdown, no backticks).
Required JSON format:
{
  "summary": "Reassuring explanation of what they did in ${langName} language",
  "scamLikelihood": 0.0 to 1.0 (float),
  "isMoneyTransfer": true or false,
  "nextAction": "One clear instruction on how to undo or go back in ${langName}"
}`;
    } else {
      prompt = `You are a reassuring technical assistant for elderly users.
Look at the UI screenshot. Identify what app or screen this is.
Find the most obvious next action the user might want to take.

IMPORTANT: You must respond with ONLY a raw JSON object (no markdown, no backticks).
Required JSON format:
{
  "summary": "1 sentence explanation of what this screen is in ${langName}",
  "scamLikelihood": 0.0 to 1.0 (float),
  "isMoneyTransfer": true or false,
  "nextAction": "One clear, simple instruction of what to press next in ${langName}"
}`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: [
        {
          role: 'user',
          parts: [imagePart, { text: prompt }]
        }
      ],
      config: {
        temperature: 0.1,
      }
    });

    const rawText = response.text;
    const cleanText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    const result = JSON.parse(cleanText);

    res.json(result);
  } catch (error) {
    console.error('[analyze] AI Error:', error);
    res.status(500).json({ error: 'Failed to analyze the screen.' });
  }
};
