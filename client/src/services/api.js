/**
 * api.js — All API calls in one place.
 *
 * No business logic here — just fetch, error normalisation, and AbortController.
 * Every caller gets a consistent { data, error } shape back.
 */

const API_BASE = '/api';
const REQUEST_TIMEOUT_MS = 35_000; // 35 seconds

export async function checkSession() {
  try {
    const res = await fetch(`${API_BASE}/auth/me`);
    if (!res.ok) return { user: null };
    const data = await res.json();
    return { user: data.user };
  } catch (err) {
    return { user: null };
  }
}

export async function loginWithGoogle(credential) {
  try {
    const res = await fetch(`${API_BASE}/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ credential }),
    });
    const data = await res.json();
    if (!res.ok) return { data: null, error: data.error || 'Login failed' };
    return { data, error: null };
  } catch (err) {
    return { data: null, error: 'Could not reach the server.' };
  }
}

export async function logout() {
  try {
    await fetch(`${API_BASE}/auth/logout`, { method: 'POST' });
    return true;
  } catch (err) {
    return false;
  }
}

/**
 * Analyzes a screenshot by sending it to the server.
 */
export async function analyzeScreenshot(file, language = 'en', mode = 'stuck', signal) {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('language', language);
  formData.append('mode', mode);

  const timeoutController = new AbortController();
  const timeoutId = setTimeout(() => timeoutController.abort(), REQUEST_TIMEOUT_MS);

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
    if (!res.ok) return { data: null, error: json.error || 'Something went wrong. Please try again.' };
    return { data: json, error: null };
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') return { data: null, error: 'cancelled' };
    if (!navigator.onLine) return { data: null, error: 'No internet connection. Please check your WiFi or mobile data and try again.' };
    return { data: null, error: 'Could not connect to the server. Please try again in a moment.' };
  }
}

/**
 * Sends a plain-text summary to a family contact.
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
    if (!res.ok) return { success: false, error: json.error || 'Could not send notification.' };
    return { success: true, error: null };
  } catch {
    return { success: false, error: 'Could not reach the server. Please try again.' };
  }
}
