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
import NotFound from "./pages/NotFound";

import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { initAnalytics, trackPageView } from "./utils/analytics";
import { usePaymentListener } from "./hooks/usePaymentListener";

const queryClient = new QueryClient();

// Global Analytics Tracker Component
const AnalyticsTracker = () => {
  const location = useLocation();

  useEffect(() => {
    initAnalytics();
  }, []);

  useEffect(() => {
    // Tracking page view on every location change
    const pageName = document.title || 'Testar';
    trackPageView(pageName);
  }, [location]);

  // Handle global payment success notifications
  usePaymentListener();

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
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
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
