import { EventName, EventParams, CommonProperties } from "../types/analytics";

// Storage keys
const DISTINCT_ID_KEY = 'testar_distinct_id';
const SESSION_ID_KEY = 'testar_session_id';
const USER_ID_KEY = 'testar_user_id';

// Local cache
let distinctId = localStorage.getItem(DISTINCT_ID_KEY) || '';
let sessionId = sessionStorage.getItem(SESSION_ID_KEY) || '';

/**
 * Generate a simple unique ID
 */
const generateId = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

/**
 * Initialize analytics, setup IDs
 */
export const initAnalytics = () => {
  if (!distinctId) {
    distinctId = generateId();
    localStorage.setItem(DISTINCT_ID_KEY, distinctId);
  }
  if (!sessionId) {
    sessionId = generateId();
    sessionStorage.setItem(SESSION_ID_KEY, sessionId);
  }
  
  console.log('📊 [Analytics] Initialized', { distinctId, sessionId });
};

/**
 * Core tracking function
 */
export const track = <T extends keyof EventParams>(
  eventName: T,
  params: EventParams[T],
  quizContext?: { id: string; slug?: string; category?: string }
) => {
  // Try to get user_id from localStorage to avoid circular dependency with store
  const userId = localStorage.getItem(USER_ID_KEY) || (window as any)?.__USER_ID__;
  
  const commonProps: CommonProperties = {
    event_time: Date.now(),
    distinct_id: distinctId,
    user_id: userId,
    session_id: sessionId,
    page_name: document.title,
    page_path: window.location.pathname,
    quiz_id: quizContext?.id,
    quiz_slug: quizContext?.slug,
    quiz_category: quizContext?.category,
    source_channel: new URLSearchParams(window.location.search).get('utm_source') || 'direct',
    device_type: /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
    os: navigator.platform,
    web_version: '1.2.8-beta' // Fixed version
  };

  const payload = {
    event: eventName,
    properties: {
      ...commonProps,
      ...params
    }
  };

  // In development, log to console with vibrant style
  if (import.meta.env.DEV) {
    console.log(
      `%c📊 [Analytics] ${eventName}`, 
      'background: #7c3aed; color: white; padding: 2px 6px; border-radius: 4px; font-weight: bold;', 
      payload.properties
    );
  }
};

/**
 * Page view helper
 */
export const trackPageView = (pageName: string, extra?: Record<string, any>) => {
  track('page_view', {
    page_name: pageName,
    page_path: window.location.pathname,
    referrer: document.referrer,
    ...extra
  } as any);
};
