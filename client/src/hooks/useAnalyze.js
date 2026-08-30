import { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { analyzeScreenshot } from '../services/api.js';
import { useApp } from '../context/AppContext.jsx';

/**
 * useAnalyze — orchestrates the full screenshot analysis flow.
 *
 * Handles:
 * - Preventing duplicate submissions (double-tap protection)
 * - Abort on cancel
 * - Navigation to the correct result screen based on response type
 * - Error state management
 */
export function useAnalyze() {
  const navigate = useNavigate();
  const { language, mode, setAnalysisResult, setError } = useApp();
  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = useRef(null);

  const submit = useCallback(
    async (file) => {
      // Prevent double-tap: if already loading, ignore
      if (isLoading) return;

      // Validate file before sending
      if (!file) {
        setError('Please select a screenshot first.');
        return;
      }

      const MAX_SIZE = 5 * 1024 * 1024;
      if (file.size > MAX_SIZE) {
        setError('This image is too large (max 5 MB). Please try a smaller screenshot.');
        return;
      }

      // Create a new AbortController for this request
      abortControllerRef.current = new AbortController();

      setIsLoading(true);
      setError(null);
      setAnalysisResult(null);

      navigate('/analyzing');

      const { data, error } = await analyzeScreenshot(
        file,
        language,
        mode,
        abortControllerRef.current.signal
      );

      setIsLoading(false);

      if (error === 'cancelled') {
        // User cancelled — go back home cleanly
        navigate('/');
        return;
      }

      if (error) {
        setError(error);
        navigate('/');
        return;
      }

      // Store result and navigate to appropriate screen
      setAnalysisResult(data);

      switch (data.type) {
        case 'scam_warning':
          navigate('/scam-warning');
          break;
        case 'escalation':
          navigate('/escalation');
          break;
        case 'undome_result':
          navigate('/undome-result');
          break;
        default:
          navigate('/result');
      }
    },
    [isLoading, language, mode, navigate, setAnalysisResult, setError]
  );

  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsLoading(false);
  }, []);

  return { submit, cancel, isLoading };
}
