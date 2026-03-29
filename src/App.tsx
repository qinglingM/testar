import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import HomePage from "./pages/HomePage";
import QuizDetailPage from "./pages/QuizDetailPage";
import QuizPlayPage from "./pages/QuizPlayPage";
import QuizResultPage from "./pages/QuizResultPage";
import QuizReportPage from "./pages/QuizReportPage";
import QuizAnalyzingPage from "./pages/QuizAnalyzingPage";
import HistoryPage from "./pages/HistoryPage";
import CouponsPage from "./pages/CouponsPage";
import PrivacySettingsPage from "./pages/PrivacySettingsPage";
import NotFound from "./pages/NotFound";

import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { initAnalytics, trackPageView } from "./utils/analytics";
import { useQuizStore } from "./store/useQuizStore";
import { supabase } from "./lib/supabase";

const queryClient = new QueryClient();

// Global Analytics Tracker Component
const AnalyticsTracker = () => {
  const location = useLocation();
  const hydrateSession = useQuizStore(state => state.hydrateSession);
  const refreshProfile = useQuizStore(state => state.refreshProfile);
  const user = useQuizStore(state => state.user);

  useEffect(() => {
    initAnalytics();
    
    // 1. Initial hydration on app load
    hydrateSession();

    // 2. Continuous Sync via Auth Listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        refreshProfile(); // Ensure fresh membership data
      }
      if (event === 'SIGNED_OUT') {
        hydrateSession(); // Will clear user/membership from store
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [hydrateSession, refreshProfile]);

  useEffect(() => {
    // Tracking page view on every location change
    const pageName = document.title || 'Testar';
    trackPageView(pageName);
    
    // Auto scroll to top on every route change
    window.scrollTo(0, 0);
  }, [location, user]);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner 
        position="top-center" 
        duration={2000}
        toastOptions={{
          style: {
            fontSize: '14px',
            fontWeight: 'bold',
            borderRadius: '20px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            border: 'none',
            padding: '12px 20px',
            background: '#ffffff',
            color: '#1e293b'
          }
        }}
      />
      <BrowserRouter>
        <AnalyticsTracker />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/quiz/:slug" element={<QuizDetailPage />} />
          <Route path="/quiz/:slug/play" element={<QuizPlayPage />} />
          <Route path="/quiz/:slug/analyzing" element={<QuizAnalyzingPage />} />
          <Route path="/quiz/:slug/result" element={<QuizResultPage />} />
          <Route path="/quiz/:slug/report" element={<QuizReportPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/coupons" element={<CouponsPage />} />
          <Route path="/privacy" element={<PrivacySettingsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
