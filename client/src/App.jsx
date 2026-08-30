import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext.jsx';

import HomeScreen from './screens/HomeScreen.jsx';
import AnalyzingScreen from './screens/AnalyzingScreen.jsx';
import ResultScreen from './screens/ResultScreen.jsx';
import ScamWarningScreen from './screens/ScamWarningScreen.jsx';
import EscalationScreen from './screens/EscalationScreen.jsx';
import UndoMeResultScreen from './screens/UndoMeResultScreen.jsx';

/**
 * App.jsx — Root router using HashRouter.
 *
 * Hash-based routing (#/path) means:
 * - No server configuration needed for deep links
 * - Refresh on any route works correctly
 * - Forward/back navigation is safe
 *
 * All app state lives in AppContext (in-memory React state).
 * Navigating to /home always clears the previous analysis.
 */
export default function App() {
  return (
    <AppProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/analyzing" element={<AnalyzingScreen />} />
          <Route path="/result" element={<ResultScreen />} />
          <Route path="/scam-warning" element={<ScamWarningScreen />} />
          <Route path="/escalation" element={<EscalationScreen />} />
          <Route path="/undome-result" element={<UndoMeResultScreen />} />
          {/* Catch-all: redirect unknown routes to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </AppProvider>
  );
}
