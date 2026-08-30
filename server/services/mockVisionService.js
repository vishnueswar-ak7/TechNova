/**
 * mockVisionService.js
 *
 * Returns realistic demo responses so the app can be fully explored
 * without a real Gemini API key. Activated automatically when
 * GEMINI_API_KEY is the placeholder value.
 *
 * Each call cycles through the four possible response types so you
 * can see every screen of the app.
 */

let callCount = 0;

const MOCK_RESPONSES = {
  en: [
    // Normal result
    {
      reassurance: "Nothing bad has happened. You are safe.",
      explanation: "This screen is showing you your bank account balance and recent transactions. It is a normal banking screen.",
      next_action: "Tap the 'View Transactions' button to see your recent payments.",
      confidence: 0.92,
      scam_flag: false,
      scam_reason: null,
      involves_money: true,
      escalation_message: null,
    },
    // Scam warning
    {
      reassurance: "Please wait before doing anything.",
      explanation: "This screen is asking you to enter your OTP (secret number) urgently. This is suspicious.",
      next_action: null,
      confidence: 0.88,
      scam_flag: true,
      scam_reason: "This screen is urgently asking for your OTP or PIN number. Real banks never ask for this via a pop-up screen.",
      involves_money: true,
      escalation_message: "⚠️ Wait — do not enter any numbers or tap anything yet. This screen may be trying to trick you. Please call your bank helpline or ask a trusted family member before doing anything.",
    },
    // Escalation (low confidence)
    {
      reassurance: "No need to worry.",
      explanation: "I can see a screen but I am not fully sure what it is showing.",
      next_action: null,
      confidence: 0.38,
      scam_flag: false,
      scam_reason: null,
      involves_money: false,
      escalation_message: "I'm not fully sure about this screen. Please call your bank or ask a family member before doing anything.",
    },
    // Normal result (email)
    {
      reassurance: "Everything looks perfectly fine.",
      explanation: "This is a normal email screen. Someone has sent you a message and it is waiting for you to read it.",
      next_action: "Tap on the email subject line to open and read the message.",
      confidence: 0.95,
      scam_flag: false,
      scam_reason: null,
      involves_money: false,
      escalation_message: null,
    },
  ],
  ta: [
    {
      reassurance: "கவலைப்படாதீர்கள். நீங்கள் பாதுகாப்பாக இருக்கிறீர்கள்.",
      explanation: "இந்த திரை உங்கள் வங்கி கணக்கு இருப்பை காட்டுகிறது. இது ஒரு சாதாரண வங்கி திரை.",
      next_action: "'பரிவர்த்தனைகளைக் காண்க' பொத்தானை தட்டவும்.",
      confidence: 0.92,
      scam_flag: false,
      scam_reason: null,
      involves_money: true,
      escalation_message: null,
    },
    {
      reassurance: "நில்லுங்கள், முதலில் சரிபார்க்கவும்.",
      explanation: "இந்த திரை உங்கள் OTP எண்ணை கேட்கிறது. இது சந்தேகமாக உள்ளது.",
      next_action: null,
      confidence: 0.87,
      scam_flag: true,
      scam_reason: "இந்த திரை அவசரமாக உங்கள் OTP அல்லது PIN கேட்கிறது. உண்மையான வங்கிகள் இவ்வாறு கேட்காது.",
      involves_money: true,
      escalation_message: "⚠️ நில்லுங்கள் — எந்த எண்ணையும் உள்ளிட வேண்டாம். உங்கள் வங்கி helpline-ஐ அழைக்கவும்.",
    },
    {
      reassurance: "கவலைப்படாதீர்கள்.",
      explanation: "இந்த திரை என்னவென்று எனக்கு சரியாக தெரியவில்லை.",
      next_action: null,
      confidence: 0.35,
      scam_flag: false,
      scam_reason: null,
      involves_money: false,
      escalation_message: "இந்த திரையில் எனக்கு உறுதியில்லை. குடும்பத்தினரிடம் கேளுங்கள்.",
    },
    {
      reassurance: "எல்லாம் சரியாக உள்ளது.",
      explanation: "இது ஒரு சாதாரண மின்னஞ்சல் திரை. யாரோ உங்களுக்கு செய்தி அனுப்பியுள்ளனர்.",
      next_action: "மின்னஞ்சலின் தலைப்பை தட்டி படிக்கவும்.",
      confidence: 0.94,
      scam_flag: false,
      scam_reason: null,
      involves_money: false,
      escalation_message: null,
    },
  ],
  hi: [
    {
      reassurance: "चिंता मत करिए। आप सुरक्षित हैं।",
      explanation: "यह स्क्रीन आपके बैंक खाते का बैलेंस दिखा रही है। यह एक सामान्य बैंकिंग स्क्रीन है।",
      next_action: "'लेनदेन देखें' बटन पर टैप करें।",
      confidence: 0.92,
      scam_flag: false,
      scam_reason: null,
      involves_money: true,
      escalation_message: null,
    },
    {
      reassurance: "रुकिए, पहले जांचें।",
      explanation: "यह स्क्रीन आपसे OTP मांग रही है। यह संदिग्ध लग रहा है।",
      next_action: null,
      confidence: 0.89,
      scam_flag: true,
      scam_reason: "यह स्क्रीन जल्दी से आपका OTP या PIN मांग रही है। असली बैंक ऐसा नहीं करते।",
      involves_money: true,
      escalation_message: "⚠️ रुकिए — कोई भी नंबर दर्ज न करें। अपने बैंक हेल्पलाइन को कॉल करें।",
    },
    {
      reassurance: "घबराइए नहीं।",
      explanation: "मुझे इस स्क्रीन के बारे में पूरी तरह समझ नहीं आई।",
      next_action: null,
      confidence: 0.38,
      scam_flag: false,
      scam_reason: null,
      involves_money: false,
      escalation_message: "मुझे इस स्क्रीन के बारे में पूरा यकीन नहीं है। परिवार से पूछें।",
    },
    {
      reassurance: "सब कुछ ठीक है।",
      explanation: "यह एक सामान्य ईमेल स्क्रीन है। किसी ने आपको संदेश भेजा है।",
      next_action: "ईमेल के शीर्षक पर टैप करके पढ़ें।",
      confidence: 0.95,
      scam_flag: false,
      scam_reason: null,
      involves_money: false,
      escalation_message: null,
    },
  ],
};

/**
 * Returns a mock response, cycling through all 4 response types.
 * Supports undome mode by tweaking the framing.
 */
function getMockResponse(language, mode) {
  const lang = MOCK_RESPONSES[language] ? language : 'en';
  const responses = MOCK_RESPONSES[lang];
  const response = { ...responses[callCount % responses.length] };
  callCount++;

  // For undome mode, adjust reassurance framing
  if (mode === 'undome' && !response.scam_flag && response.confidence > 0.5) {
    response.reassurance = language === 'ta'
      ? 'நீங்கள் எதுவும் தவறாக செய்யவில்லை.'
      : language === 'hi'
        ? 'आपने कुछ गलत नहीं किया।'
        : 'You did not do anything wrong.';
  }

  return response;
}

module.exports = { getMockResponse };
