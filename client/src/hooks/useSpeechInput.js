import { useState, useCallback, useRef, useEffect } from 'react';

// Maps our language codes to BCP-47 for SpeechRecognition
const LANG_MAP = {
  en: 'en-IN',
  ta: 'ta-IN',
  hi: 'hi-IN',
};

/**
 * useSpeechInput — wraps the Web Speech Recognition API.
 *
 * Gracefully degrades: isSupported is false if the browser doesn't support it.
 * Designed for elderly users — simple trigger (start/stop), no complex state.
 */
export function useSpeechInput(language = 'en', onTranscript) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported] = useState(
    () => 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window
  );
  const recognitionRef = useRef(null);

  const start = useCallback(() => {
    if (!isSupported || isListening) return;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    const recognition = new SpeechRecognition();
    recognition.lang = LANG_MAP[language] || 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript || '';
      if (transcript && onTranscript) {
        onTranscript(transcript.trim());
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [isSupported, isListening, language, onTranscript]);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      recognitionRef.current?.abort();
    };
  }, []);

  return { start, stop, isListening, isSupported };
}
