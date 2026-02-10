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

// Initialize Convex client with error handling
// Always create a client (even if URL is missing) to prevent hook errors
// Components will check VITE_CONVEX_URL before using features
const convexUrl = import.meta.env.VITE_CONVEX_URL;
let convex: ConvexReactClient;

try {
  if (convexUrl) {
    convex = new ConvexReactClient(convexUrl);
    console.log('✅ Convex client initialized');
  } else {
    console.warn("VITE_CONVEX_URL is not set. Convex features will not work.");
    // Create a placeholder client to prevent hook errors
    // Components will check VITE_CONVEX_URL before making actual calls
    convex = new ConvexReactClient("https://placeholder.convex.cloud");
  }
} catch (error) {
  console.warn('Failed to initialize Convex client:', error);
  // Fallback to placeholder to prevent hook errors
  convex = new ConvexReactClient("https://placeholder.convex.cloud");
}

// Initialize analytics services with error handling
try {
  initGoogleAnalytics();
} catch (error) {
  console.warn('Failed to initialize Google Analytics:', error);
}

try {
  // Initialize GA4 (only in production to avoid polluting data with dev clicks)
  const GA4_ID = import.meta.env.VITE_GA4_MEASUREMENT_ID;
  if (GA4_ID && import.meta.env.PROD) {
    // Prevent double initialization in React Strict Mode
    if (!window.__GA4_INITIALIZED__) {
      initGA4();
      window.__GA4_INITIALIZED__ = true;
    }
  }
} catch (error) {
  console.warn('Failed to initialize GA4:', error);
}

try {
  // Initialize Microsoft Clarity (heatmaps and session recordings)
  initClarity();
} catch (error) {
  console.warn('Failed to initialize Clarity:', error);
}

// Initialize Web Vitals monitoring (only in production)
if (import.meta.env.PROD) {
  // This will be called when App mounts
  // We'll initialize it in App.tsx component
}

// Initialize Ad Manager and Prebid.js
if (typeof window !== 'undefined') {
  // Wait for scripts to load
  window.addEventListener('load', () => {
    try {
      initGoogleAdManager();
      initPrebid();
    } catch (error) {
      console.warn('Failed to initialize ad services:', error);
    }
  });
}

// Ensure DOM is ready before rendering
const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('Root element not found!');
  // Try to create it as fallback
  const body = document.body;
  if (body) {
    const newRoot = document.createElement('div');
    newRoot.id = 'root';
    body.appendChild(newRoot);
    console.log('Created root element as fallback');
  } else {
    throw new Error('Root element not found and cannot create fallback');
  }
}

const auth0Domain = import.meta.env.VITE_AUTH0_DOMAIN ?? '';
const auth0ClientId = import.meta.env.VITE_AUTH0_CLIENT_ID ?? '';
const hasAuth0 = Boolean(auth0Domain && auth0ClientId);

// Always wrap in ConvexProvider to prevent hook errors
// Components will check VITE_CONVEX_URL before using Convex features
const content = (
  <ConvexProvider client={convex}>
    <ErrorBoundary>
      <App />
      {convexUrl && <ConvexConnectionStatus />}
    </ErrorBoundary>
  </ConvexProvider>
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

// Render app with error handling
try {
  const root = ReactDOM.createRoot(rootElement!);
  root.render(app);
  console.log('✅ React app rendered successfully');
} catch (error) {
  console.error('❌ Failed to render React app:', error);
  // Show fallback content
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="padding: 40px; text-align: center; font-family: system-ui, sans-serif;">
        <h1 style="color: #dc2626; margin-bottom: 20px;">Application Error</h1>
        <p style="color: #666; margin-bottom: 20px;">The application failed to load. Please refresh the page.</p>
        <button onclick="window.location.reload()" style="padding: 12px 24px; background: #8b5cf6; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px;">
          Refresh Page
        </button>
        <details style="margin-top: 20px; text-align: left; max-width: 600px; margin-left: auto; margin-right: auto;">
          <summary style="cursor: pointer; color: #666;">Error Details</summary>
          <pre style="background: #f5f5f5; padding: 15px; border-radius: 4px; overflow: auto; margin-top: 10px;">${error instanceof Error ? error.stack : String(error)}</pre>
        </details>
      </div>
    `;
  }
}

