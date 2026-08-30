import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { checkSession, logout as apiLogout } from '../services/api.js';

/**
 * AppContext — global in-memory state for the ScreenSaathi app.
 *
 * IMPORTANT: No localStorage/sessionStorage is used anywhere.
 * All state is cleared on page refresh — this is intentional.
 * Each refresh gives a clean slate, preventing stale UI bugs.
 */

const AppContext = createContext(null);

const DEFAULT_LANGUAGE = 'en';

export function AppProvider({ children }) {
  const [language, setLanguage] = useState(DEFAULT_LANGUAGE);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [mode, setMode] = useState('stuck'); // 'stuck' | 'undome'
  const [consentGiven, setConsentGiven] = useState(false);
  const [familyContact, setFamilyContact] = useState({ email: '', phone: '' });
  const [error, setError] = useState(null);
  const [highContrast, setHighContrast] = useState(false);
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    async function initAuth() {
      const { user } = await checkSession();
      setUser(user);
      setIsAuthLoading(false);
    }
    initAuth();
  }, []);

  const handleLogout = async () => {
    await apiLogout();
    setUser(null);
  };

  /**
   * Resets all analysis state — call this when returning to HomeScreen
   * to guarantee a completely clean state with no ghost UI.
   */
  const resetAnalysis = useCallback(() => {
    setAnalysisResult(null);
    setError(null);
    setMode('stuck');
  }, []);

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        analysisResult,
        setAnalysisResult,
        mode,
        setMode,
        consentGiven,
        setConsentGiven,
        familyContact,
        setFamilyContact,
        error,
        setError,
        highContrast,
        setHighContrast,
        resetAnalysis,
        user,
        setUser,
        handleLogout,
        isAuthLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
