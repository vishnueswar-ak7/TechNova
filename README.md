# Trust Wise 🙏

**AI-powered screen companion for elderly users (60+)**

Trust Wise (formerly ScreenSaathi) helps elderly users who get stuck on confusing digital interfaces (banking apps, email, government portals). Upload or capture a screenshot → get ONE simple, spoken next action in multiple languages.

🔗 **Live Demo:** [https://tech-nova-client.vercel.app](https://tech-nova-client.vercel.app)

---

## Features

| Feature | Status |
|---|---|
| 🔐 Google OAuth 2.0 Secure Login | ✅ Complete |
| 📸 Screenshot upload / Live Screen Share | ✅ Complete |
| 🎙️ Voice Command Input | ✅ Complete |
| 🤖 AI vision analysis (Gemini 3.6 Flash) | ✅ Complete |
| 🔊 Text-to-speech in 8 languages | ✅ Complete (EN, TA, HI, TE, ML, KN, MR, BN) |
| ⚠️ Scam detection (AI + rule-based) | ✅ Complete |
| ↩ UndoMe flow ("What did I just do?") | ✅ Complete |
| 📞 Family notification (Nodemailer Email) | ✅ Complete |
| 👓 High Contrast Accessibility Mode | ✅ Complete |
| 📱 PWA (Installable on Mobile/Desktop) | ✅ Complete |

---

## Quick Start (Local Development)

### Prerequisites
- Node.js 18+
- A [Google Gemini API key](https://aistudio.google.com/app/apikey) (free tier works)
- Google Cloud OAuth Client ID

### Setup

```bash
# 1. Clone / download the project
git clone https://github.com/vishnueswar-ak7/TechNova.git
cd TechNova

# 2. Setup Environment Variables
# Create a .env file in the client folder:
# client/.env
VITE_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com

# Create a .env file in the server folder (if running locally):
# server/.env
GEMINI_API_KEY=your_gemini_key
JWT_SECRET=your_secure_random_string
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com

# 3. Install all dependencies
npm install

# 4. Start development server (client + server concurrently)
npm run dev
```

The app will be available at **http://localhost:5173**
The API server runs at **http://localhost:3001**

---

## Environment Variables

| Variable | Location | Required | Description |
|---|---|---|---|
| `VITE_GOOGLE_CLIENT_ID` | `client/.env` & Vercel | ✅ Yes | Google OAuth Client ID for frontend popup |
| `GEMINI_API_KEY` | `server/.env` & Vercel | ✅ Yes | Google Gemini API key for screenshot analysis |
| `JWT_SECRET` | `server/.env` & Vercel | ✅ Yes | Random string to encrypt user session cookies |
| `GOOGLE_CLIENT_ID`| `server/.env` & Vercel | ✅ Yes | Same as VITE_... used to verify backend tokens |

---

## Project Structure (Vercel Serverless)

The project has been upgraded to support seamless, zero-config deployment on Vercel using Serverless Functions.

```
TechNova/
├── client/              # React + Vite frontend (Vercel Root)
│   ├── api/             # Vercel Serverless Backend Functions
│   │   ├── auth/        # Login, Logout, Me endpoints
│   │   ├── analyze.js   # Gemini Vision AI logic
│   │   └── notify.js    # Nodemailer email alerts
│   └── src/             # React Application
│       ├── screens/     # LoginScreen, HomeScreen
│       ├── hooks/       # useLanguage, useSpeechInput, useTTS
│       └── services/    # api.js
└── server/              # Legacy / Local Dev Express Backend
```

---

## API & Vercel Serverless

When deployed to Vercel, the backend automatically runs via Serverless functions (no separate Render/Heroku backend required). 

### `POST /api/analyze`
Analyzes a screenshot (sent as base64 JSON) and returns structured AI advice.

### `POST /api/notify`
Sends an email summary to a family contact using Nodemailer.

### `POST /api/auth/google`
Verifies the Google OAuth credential and sets a 7-day HttpOnly secure session cookie.

---

## Privacy & Safety

- **Screenshots are NEVER stored** — processed in-memory only, discarded immediately after Gemini analysis.
- **No user data sold** — Sessions are encrypted via HttpOnly cookies.
- **Scam detection** runs on every request before returning any action advice to protect vulnerable users.
