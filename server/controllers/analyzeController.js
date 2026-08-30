const { analyzeImage } = require('../services/visionService');
const { applyScamOverrides } = require('../services/scamDetector');
const env = require('../config/env');

/**
 * POST /api/analyze
 *
 * Validates the uploaded image, calls the vision service,
 * applies confidence thresholds + scam detection overrides,
 * and returns a structured response to the client.
 *
 * The image buffer is used in-memory only and is garbage-collected
 * after this function returns — nothing is ever persisted.
 */
async function analyzeScreenshot(req, res, next) {
  try {
    // ── Validate file ──────────────────────────────────────────────────────
    if (!req.file) {
      return res.status(400).json({
        error: 'Please provide a screenshot image to analyze.',
      });
    }

    const language = ['en', 'ta', 'hi'].includes(req.body.language)
      ? req.body.language
      : 'en';

    const mode = ['stuck', 'undome'].includes(req.body.mode)
      ? req.body.mode
      : 'stuck';

    // ── Call vision service ────────────────────────────────────────────────
    let result;
    try {
      result = await analyzeImage(req.file.buffer, req.file.mimetype, language, mode);
    } catch (visionErr) {
      console.error('[analyzeController] Vision service error:', visionErr.message);
      return res.status(502).json({
        error:
          'I could not read your screenshot right now. Please check your internet connection and try again.',
      });
    }

    // ── Apply rule-based scam overrides (belt-and-suspenders) ──────────────
    const finalResult = applyScamOverrides(result, language);

    // ── Apply confidence thresholds ────────────────────────────────────────
    const CONF_THRESHOLD = env.CONFIDENCE_THRESHOLD();
    const MONEY_CONF_THRESHOLD = env.MONEY_CONFIDENCE_THRESHOLD();

    const confidence = finalResult.confidence ?? 0;
    const involveMoney = finalResult.involves_money ?? false;
    const scamFlag = finalResult.scam_flag ?? false;

    // Scam detected → return scam warning response
    if (scamFlag) {
      return res.json({
        type: 'scam_warning',
        scam_flag: true,
        scam_reason: finalResult.scam_reason || 'This screen looks suspicious.',
        escalate: true,
        escalation_message: finalResult.escalation_message,
        language,
      });
    }

    // Low confidence OR money screen with borderline confidence → escalate
    const shouldEscalate =
      confidence < CONF_THRESHOLD ||
      (involveMoney && confidence < MONEY_CONF_THRESHOLD);

    if (shouldEscalate) {
      return res.json({
        type: 'escalation',
        escalate: true,
        confidence,
        escalation_message: finalResult.escalation_message ||
          "I'm not fully sure about this screen. Please call your bank or ask a family member before doing anything.",
        involves_money: involveMoney,
        language,
      });
    }

    // ── Normal result ──────────────────────────────────────────────────────
    return res.json({
      type: mode === 'undome' ? 'undome_result' : 'result',
      reassurance: finalResult.reassurance,
      explanation: finalResult.explanation,
      next_action: finalResult.next_action,
      confidence,
      scam_flag: false,
      involves_money: involveMoney,
      language,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { analyzeScreenshot };
