import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { ErrorBoundary } from './components/ErrorBoundary'
import { initGoogleAnalytics } from './utils/analytics'
import { initGoogleAdManager, initPrebid } from './utils/adManager'
import './index.css'

// Initialize Google Analytics if user has consented
initGoogleAnalytics();

// Initialize Ad Manager and Prebid.js
if (typeof window !== 'undefined') {
  // Wait for scripts to load
  window.addEventListener('load', () => {
    initGoogleAdManager();
    initPrebid();
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)

