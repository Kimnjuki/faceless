/**
 * Critical CSS inlining utility
 * Inline critical CSS to prevent render-blocking
 */

export const criticalCSS = `
  /* Critical above-the-fold styles */
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  body {
    font-family: system-ui, -apple-system, sans-serif;
    margin: 0;
    padding: 0;
  }
  
  /* Hero section - prevent CLS */
  section.relative {
    min-height: 600px;
  }
  
  @media (min-width: 768px) {
    section.relative {
      min-height: 700px;
    }
  }
  
  /* Prevent layout shift during font load */
  h1, h2, h3, h4, h5, h6 {
    font-display: swap;
  }
`;

