/**
 * api.js — All API calls in one place.
 *
 * No business logic here — just fetch, error normalisation, and AbortController.
 * Every caller gets a consistent { data, error } shape back.
 */

const API_BASE = '/api';
const REQUEST_TIMEOUT_MS = 35_000; // 35 seconds

/**
 * Analyzes a screenshot by sending it to the server.
 *
 * @param {File} file - The screenshot file
 * @param {string} language - "en" | "ta" | "hi"
 * @param {string} mode - "stuck" | "undome"
 * @param {AbortSignal} [signal] - Optional AbortController signal for cancellation
 * @returns {Promise<{ data: Object | null, error: string | null }>}
 */
export async function analyzeScreenshot(file, language = 'en', mode = 'stuck', signal) {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('language', language);
  formData.append('mode', mode);

  // Combine caller's abort signal with a timeout signal
  const timeoutController = new AbortController();
  const timeoutId = setTimeout(() => timeoutController.abort(), REQUEST_TIMEOUT_MS);

  // Merge signals: abort if either fires
  const mergedSignal = signal
    ? AbortSignal.any([signal, timeoutController.signal])
    : timeoutController.signal;

  try {
    const res = await fetch(`${API_BASE}/analyze`, {
      method: 'POST',
      body: formData,
      signal: mergedSignal,
    });

    clearTimeout(timeoutId);

    const json = await res.json();

    if (!res.ok) {
      return { data: null, error: json.error || 'Something went wrong. Please try again.' };
    }

    return { data: json, error: null };
  } catch (err) {
    clearTimeout(timeoutId);

    if (err.name === 'AbortError') {
      return { data: null, error: 'cancelled' };
    }

    if (!navigator.onLine) {
      return {
        data: null,
        error: 'No internet connection. Please check your WiFi or mobile data and try again.',
      };
    }

    return {
      data: null,
      error: 'Could not connect to the server. Please try again in a moment.',
    };
  }
}

/**
 * Sends a plain-text summary to a family contact.
 * Never sends the image — only the summary string.
 *
 * @param {string} summary
 * @param {{ email?: string, phone?: string }} contact
 * @returns {Promise<{ success: boolean, error: string | null }>}
 */
export async function notifyFamily(summary, contact) {
  try {
    const res = await fetch(`${API_BASE}/notify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        summary,
        contactEmail: contact.email || undefined,
        contactPhone: contact.phone || undefined,
      }),
    });

    const json = await res.json();

    if (!res.ok) {
      return { success: false, error: json.error || 'Could not send notification.' };
    }

    return { success: true, error: null };
  } catch {
    return { success: false, error: 'Could not reach the server. Please try again.' };
  }
}
