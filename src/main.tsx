import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { Auth0Provider } from '@auth0/auth0-react'
import { ConvexProvider, ConvexReactClient } from "convex/react"
import App from './App.tsx'
import { ErrorBoundary } from './components/ErrorBoundary'
import ConvexConnectionStatus from './components/ConvexConnectionStatus'
import { initGoogleAnalytics } from './utils/analytics'
import { initGA4 } from './utils/ga4'
import { initClarity } from './utils/clarity'
import { initGoogleAdManager, initPrebid } from './utils/adManager'
import './index.css'

// Initialize Convex client
const convexUrl = import.meta.env.VITE_CONVEX_URL;
if (!convexUrl) {
  console.warn("VITE_CONVEX_URL is not set. Convex features will not work.");
}
const convex = convexUrl ? new ConvexReactClient(convexUrl) : null;

// Initialize Google Analytics if user has consented (existing GA)
initGoogleAnalytics();

// Initialize GA4 (only in production to avoid polluting data with dev clicks)
const GA4_ID = import.meta.env.VITE_GA4_MEASUREMENT_ID;
if (GA4_ID && import.meta.env.PROD) {
  // Prevent double initialization in React Strict Mode
  if (!window.__GA4_INITIALIZED__) {
    initGA4();
    window.__GA4_INITIALIZED__ = true;
  }
}

// Initialize Microsoft Clarity (heatmaps and session recordings)
// Initialize in both dev and prod (can restrict to PROD if needed)
initClarity();

// Initialize Web Vitals monitoring (only in production)
if (import.meta.env.PROD) {
  // This will be called when App mounts
  // We'll initialize it in App.tsx component
}

// Initialize Ad Manager and Prebid.js
if (typeof window !== 'undefined') {
  // Wait for scripts to load
  window.addEventListener('load', () => {
    initGoogleAdManager();
    initPrebid();
  });
}

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

const auth0Domain = import.meta.env.VITE_AUTH0_DOMAIN ?? '';
const auth0ClientId = import.meta.env.VITE_AUTH0_CLIENT_ID ?? '';
const hasAuth0 = Boolean(auth0Domain && auth0ClientId);

const content = convex ? (
  <ConvexProvider client={convex}>
    <ErrorBoundary>
      <App />
      <ConvexConnectionStatus />
    </ErrorBoundary>
  </ConvexProvider>
) : (
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);

const app = (
  <StrictMode>
    <HelmetProvider>
      {hasAuth0 ? (
        <Auth0Provider
          domain={auth0Domain}
          clientId={auth0ClientId}
          authorizationParams={{
            redirect_uri: typeof window !== 'undefined' ? window.location.origin + '/auth/callback' : '',
          }}
        >
          {content}
        </Auth0Provider>
      ) : (
        content
      )}
    </HelmetProvider>
  </StrictMode>
);

ReactDOM.createRoot(rootElement).render(app);

