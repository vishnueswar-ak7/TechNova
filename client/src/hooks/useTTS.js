import { useCallback, useEffect, useRef, useState } from 'react';

// Maps our language codes to BCP-47 tags for SpeechSynthesis
const LANGUAGE_VOICE_MAP = {
  en: ['en-IN', 'en-GB', 'en-US'],
  ta: ['ta-IN', 'ta'],
  hi: ['hi-IN', 'hi'],
};

/**
 * useTTS — wraps the Web Speech API SpeechSynthesis.
 *
 * Features:
 * - Auto-plays text when autoPlay is true
 * - Picks the best available voice for the language
 * - Exposes play / stop / isPlaying state
 * - Gracefully degrades if SpeechSynthesis is not available
 */
export function useTTS(text, language = 'en', autoPlay = true) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSupported] = useState(() => 'speechSynthesis' in window);
  const utteranceRef = useRef(null);
  const hasAutoPlayed = useRef(false);

  const findVoice = useCallback((lang) => {
    if (!isSupported) return null;
    const voices = window.speechSynthesis.getVoices();
    const preferredTags = LANGUAGE_VOICE_MAP[lang] || LANGUAGE_VOICE_MAP.en;
    for (const tag of preferredTags) {
      const match = voices.find((v) => v.lang.startsWith(tag));
      if (match) return match;
    }
    return voices[0] || null;
  }, [isSupported]);

  const stop = useCallback(() => {
    if (!isSupported) return;
    window.speechSynthesis.cancel();
    setIsPlaying(false);
  }, [isSupported]);

  const play = useCallback(() => {
    if (!isSupported || !text) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.85; // Slightly slower for elderly users
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    // Voice selection runs after voices load (may be async on some browsers)
    const setVoiceAndSpeak = () => {
      const voice = findVoice(language);
      if (voice) utterance.voice = voice;

      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    };

    // If voices not yet loaded, wait for them
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      setVoiceAndSpeak();
    } else {
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.onvoiceschanged = null;
        setVoiceAndSpeak();
      };
    }
  }, [isSupported, text, language, findVoice]);

  // Auto-play once when text arrives
  useEffect(() => {
    if (autoPlay && text && !hasAutoPlayed.current) {
      hasAutoPlayed.current = true;
      // Small delay to let the screen render first
      const timer = setTimeout(play, 600);
      return () => clearTimeout(timer);
    }
  }, [autoPlay, text, play]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (isSupported) window.speechSynthesis.cancel();
    };
  }, [isSupported]);

  return { play, stop, isPlaying, isSupported };
}
