import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AppProvider, useApp } from './context/AppContext.jsx';

import LoginScreen from './screens/LoginScreen.jsx';
import HomeScreen from './screens/HomeScreen.jsx';
import AnalyzingScreen from './screens/AnalyzingScreen.jsx';
import ResultScreen from './screens/ResultScreen.jsx';
import ScamWarningScreen from './screens/ScamWarningScreen.jsx';
import EscalationScreen from './screens/EscalationScreen.jsx';
import UndoMeResultScreen from './screens/UndoMeResultScreen.jsx';

function ProtectedRoute({ children }) {
  const { user, isAuthLoading } = useApp();
  
  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="animate-spin text-4xl">⏳</div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

function AppContent() {
  const { highContrast } = useApp();
  
  return (
    <div className={`min-h-screen w-full transition-colors ${highContrast ? 'theme-high-contrast' : ''}`}>
      <HashRouter>
        <Routes>
          <Route path="/login" element={<LoginScreen />} />
          
          <Route path="/" element={<ProtectedRoute><HomeScreen /></ProtectedRoute>} />
          <Route path="/analyzing" element={<ProtectedRoute><AnalyzingScreen /></ProtectedRoute>} />
          <Route path="/result" element={<ProtectedRoute><ResultScreen /></ProtectedRoute>} />
          <Route path="/scam-warning" element={<ProtectedRoute><ScamWarningScreen /></ProtectedRoute>} />
          <Route path="/escalation" element={<ProtectedRoute><EscalationScreen /></ProtectedRoute>} />
          <Route path="/undome-result" element={<ProtectedRoute><UndoMeResultScreen /></ProtectedRoute>} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </div>
  );
}

export default function App() {
  // Use env var for Google Client ID (must match backend)
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'missing-client-id';

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </GoogleOAuthProvider>
  );
}
