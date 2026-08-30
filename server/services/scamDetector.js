/**
 * scamDetector.js
 *
 * Belt-and-suspenders rule-based scam detection that runs AFTER the AI response.
 * Even if the AI misses a signal, these patterns catch the most common scam patterns.
 *
 * This does NOT make network calls or store data — it only inspects the AI's
 * text output for known danger patterns.
 */

// Patterns that strongly indicate a scam regardless of AI confidence
const SCAM_PATTERNS = [
  /enter\s+(your\s+)?(otp|one.?time.?password|pin|password|mpin)/i,
  /share\s+(your\s+)?(otp|pin|password)/i,
  /otp\s+(is|sent|received)/i,
  /your\s+account\s+(will\s+be\s+|has\s+been\s+)?(blocked|suspended|closed|frozen)/i,
  /act\s+(immediately|now|urgently)/i,
  /last\s+(warning|chance|notice)/i,
  /transfer\s+.{0,30}(rupees|rs\.|inr|₹|\$)/i,
  /buy\s+(google\s+play|gift|amazon)\s+card/i,
  /call\s+(rbi|reserve\s+bank|bank\s+helpline)\s+immediately/i,
  /your\s+account\s+.*arrested/i,
  /cybercrime|cyber\s+crime/i,
  /refund\s+process/i,
  /verify\s+(your\s+)?(account|identity)\s+(now|immediately)/i,
];

// Tamil scam patterns
const SCAM_PATTERNS_TA = [
  /otp\s+உள்ளிடவும்/i,
  /கணக்கு\s+தடுக்கப்படும்/i,
  /உடனடியாக\s+செய்யவும்/i,
];

// Hindi scam patterns
const SCAM_PATTERNS_HI = [
  /otp\s+दर्ज\s+करें/i,
  /खाता\s+बंद\s+हो\s+जाएगा/i,
  /तुरंत\s+करें/i,
  /पिन\s+शेयर\s+करें/i,
];

const ESCALATION_MESSAGES = {
  en: '⚠️ Wait — do not enter any numbers or tap anything yet. This screen may be trying to trick you. Please call your bank helpline or ask a trusted family member before doing anything.',
  ta: '⚠️ நில்லுங்கள் — எந்த எண்ணையும் உள்ளிட வேண்டாம். இந்த திரை உங்களை ஏமாற்ற முயற்சிக்கலாம். உங்கள் வங்கி helpline-ஐ அழைக்கவும் அல்லது குடும்பத்தினரிடம் கேளுங்கள்.',
  hi: '⚠️ रुकिए — कोई भी नंबर दर्ज न करें। यह स्क्रीन आपको धोखा देने की कोशिश कर सकती है। कृपया अपने बैंक हेल्पलाइन को कॉल करें या किसी परिवार के सदस्य से पूछें।',
};

/**
 * Applies rule-based overrides to the AI result.
 * Mutates and returns the result object.
 *
 * @param {Object} aiResult - The parsed result from visionService
 * @param {string} language - "en" | "ta" | "hi"
 * @returns {Object} Potentially modified result
 */
function applyScamOverrides(aiResult, language = 'en') {
  const result = { ...aiResult };

  // Gather all text from the AI response to check
  const combinedText = [
    result.explanation,
    result.next_action,
    result.scam_reason,
  ]
    .filter(Boolean)
    .join(' ');

  // Check English patterns
  const matchesEnglish = SCAM_PATTERNS.some((p) => p.test(combinedText));

  // Check language-specific patterns
  const matchesTamil = language === 'ta' && SCAM_PATTERNS_TA.some((p) => p.test(combinedText));
  const matchesHindi = language === 'hi' && SCAM_PATTERNS_HI.some((p) => p.test(combinedText));

  if (matchesEnglish || matchesTamil || matchesHindi) {
    result.scam_flag = true;
    result.next_action = null;
    if (!result.scam_reason) {
      result.scam_reason =
        'This screen appears to be asking for sensitive information like an OTP or PIN.';
    }
    result.escalation_message =
      ESCALATION_MESSAGES[language] || ESCALATION_MESSAGES.en;
  }

  return result;
}

module.exports = { applyScamOverrides };
