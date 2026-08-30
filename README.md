# ScreenSaathi 🙏

**AI-powered screen companion for elderly users (60+)**

ScreenSaathi helps elderly users who get stuck on confusing digital interfaces (banking apps, email, government portals). Upload or capture a screenshot → get ONE simple, spoken next action in Tamil, English, or Hindi.

---

## Features

| Feature | Status |
|---|---|
| 📸 Screenshot upload / camera capture | ✅ MVP |
| 🤖 AI vision analysis (Gemini 1.5 Flash) | ✅ MVP |
| 🔊 Text-to-speech in 3 languages | ✅ MVP |
| ⚠️ Scam detection (AI + rule-based) | ✅ MVP |
| 🤔 Low-confidence escalation | ✅ MVP |
| ↩ UndoMe flow | ✅ MVP |
| 📞 Family notification (console stub) | ✅ MVP |
| 🌐 Tamil / English / Hindi responses | ✅ MVP |

---

## Quick Start

### Prerequisites
- Node.js 18+
- A [Google Gemini API key](https://aistudio.google.com/app/apikey) (free tier works)

### Setup

```bash
# 1. Clone / download the project
cd screensaathi

# 2. Copy env file and add your API key
cp .env.example .env
# Edit .env and set GEMINI_API_KEY=your_key_here

# 3. Install all dependencies
npm install

# 4. Start development server (client + server concurrently)
npm run dev
```

The app will be available at **http://localhost:5173**

The API server runs at **http://localhost:3001**

---

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `GEMINI_API_KEY` | ✅ Yes | — | Google Gemini API key |
| `PORT` | No | `3001` | Server port |
| `ALLOWED_ORIGIN` | No | `http://localhost:5173` | CORS origin |
| `CONFIDENCE_THRESHOLD` | No | `0.55` | Below this → escalation |
| `MONEY_CONFIDENCE_THRESHOLD` | No | `0.80` | Money screens need higher confidence |

---

## Project Structure

```
screensaathi/
├── client/          # React + Vite frontend
│   └── src/
│       ├── components/   # Reusable UI atoms
│       ├── screens/      # Full-page screen components
│       ├── hooks/        # useAnalyze, useTTS, useSpeechInput, useLanguage
│       ├── services/     # api.js (all fetch calls)
│       └── context/      # AppContext (global state)
└── server/          # Node.js + Express backend
    ├── routes/       # Route definitions only
    ├── controllers/  # Request handling logic
    ├── services/     # visionService, scamDetector, notifyService
    ├── middleware/   # upload, rateLimiter, errorHandler
    └── config/       # env validation
```

---

## API

### `POST /api/analyze`
Analyzes a screenshot and returns structured AI advice.

**Request:** `multipart/form-data`
- `image` — JPEG/PNG/WEBP screenshot (max 5MB)
- `language` — `en` | `ta` | `hi`
- `mode` — `stuck` | `undome`

**Response types:**
- `{ type: "result", reassurance, explanation, next_action, confidence }`
- `{ type: "scam_warning", scam_flag: true, scam_reason, escalation_message }`
- `{ type: "escalation", escalate: true, escalation_message, confidence }`

### `POST /api/notify`
Sends a text summary to a family contact (console stub in MVP).

### `GET /api/health`
Returns `{ status: "ok" }`.

---

## Privacy & Safety

- **Screenshots are NEVER stored** — processed in-memory only, garbage collected immediately
- **Family notifications** send only a generated text summary, never the image
- **No user data** is stored, logged, or shared with third parties
- **Scam detection** runs on every request before returning any action advice

---

## Extending the Notify Feature

The family notification is a console stub in MVP. To add real delivery:

**Email (SendGrid):**
```bash
npm install @sendgrid/mail --workspace=server
# Then uncomment the SendGrid block in server/services/notifyService.js
# Add SENDGRID_API_KEY to .env
```

**SMS (Twilio):**
```bash
npm install twilio --workspace=server
# Then uncomment the Twilio block in server/services/notifyService.js
# Add TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER to .env
```

---

## Production Build

```bash
npm run build        # Builds client to client/dist/
npm run start        # Starts production server
```

Serve `client/dist/` as static files from the Express server or a CDN.
