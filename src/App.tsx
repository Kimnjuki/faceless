import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider, AuthProviderFallback } from "@/contexts/AuthContext";
import AnalyticsConsent from "@/components/AnalyticsConsent";
import { trackPageView } from "@/utils/analytics";
import { initWebVitals } from "@/utils/webVitals";
import HomePage from "./pages/HomePage";
import StartHere from "./pages/StartHere";
import GettingStarted from "./pages/GettingStarted";
import BlogIndex from "./pages/BlogIndex";
import ArticleDetail from "./pages/ArticleDetail";
import PillarPage from "./pages/PillarPage";
import ToolComparison from "./pages/ToolComparison";
import ProfitabilityCalculator from "./pages/tools/ProfitabilityCalculator";
import NicheQuiz from "./pages/tools/NicheQuiz";
import SEOAudit from "./pages/tools/SEOAudit";
import KeywordResearch from "./pages/tools/KeywordResearch";
import BacklinkChecker from "./pages/tools/BacklinkChecker";
import PerformanceMonitor from "./pages/tools/PerformanceMonitor";
import Signup from "./pages/auth/Signup";
import Login from "./pages/auth/Login";
import OAuthCallback from "./pages/auth/OAuthCallback";
import Dashboard from "./pages/dashboard/Dashboard";
import Courses from "./pages/dashboard/Courses";
import Community from "./pages/dashboard/Community";
import Profile from "./pages/dashboard/Profile";
import ContentCreation from "./pages/dashboard/ContentCreation";
import AnalyticsDashboard from "./pages/dashboard/AnalyticsDashboard";
import ProductListing from "./pages/ecommerce/ProductListing";
import ProductDetail from "./pages/ecommerce/ProductDetail";
import Checkout from "./pages/ecommerce/Checkout";
import WebinarRegistration from "./pages/funnel/WebinarRegistration";
import ChallengeFunnel from "./pages/funnel/ChallengeFunnel";
import PrivacyPolicy from "./pages/legal/PrivacyPolicy";
import TermsOfService from "./pages/legal/TermsOfService";
import TemplatesLibrary from "./pages/resources/TemplatesLibrary";
import NicheDatabase from "./pages/resources/NicheDatabase";
import LearningPaths from "./pages/learning/LearningPaths";
import LearningPathDetail from "./pages/learning/LearningPathDetail";
import CreatorStudio from "./pages/creator-studio/CreatorStudio";
import PlatformGuides from "./pages/learning/PlatformGuides";
import PlatformGuideDetail from "./pages/learning/PlatformGuideDetail";
import CaseStudies from "./pages/learning/CaseStudies";
import LiveWorkshops from "./pages/learning/LiveWorkshops";
import ResourceDownloads from "./pages/learning/ResourceDownloads";
import MemberDirectory from "./pages/community/MemberDirectory";
import Events from "./pages/community/Events";
import Challenges from "./pages/community/Challenges";
import NotFound from "./pages/NotFound";
import Health from "./pages/Health";
import News from "./pages/News";
import ProtectedRoute from "./components/ProtectedRoute";
import PerformanceOptimizer from "./components/PerformanceOptimizer";
import ForeMediaAd from "./components/ForeMediaAd";

// Component to track page views on route changes
function PageViewTracker() {
  const location = useLocation();

  useEffect(() => {
    // Track page view on route change
    trackPageView(location.pathname + location.search, document.title);
  }, [location]);

  return null;
}

// Initialize Web Vitals monitoring (production only, or dev with reduced logging)
if (import.meta.env.PROD || import.meta.env.DEV) {
  initWebVitals();
}

const hasAuth0 = Boolean(import.meta.env.VITE_AUTH0_DOMAIN && import.meta.env.VITE_AUTH0_CLIENT_ID);

export default function App() {
  const AuthWrapper = hasAuth0 ? AuthProvider : AuthProviderFallback;
  return (
    <AuthWrapper>
      <Router>
        <PerformanceOptimizer />
        <PageViewTracker />
        <AnalyticsConsent />
        {/* ForeMedia POP_ADS - loads once site-wide */}
        <ForeMediaAd slot="pop_ads" />
        <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/start-here" element={<StartHere />} />
        <Route path="/getting-started" element={<GettingStarted />} />
        <Route path="/blog" element={<BlogIndex />} />
        <Route path="/blog/:slug" element={<ArticleDetail />} />
        <Route path="/tools/all" element={<ToolComparison />} />
        <Route path="/tools/:category" element={<ToolComparison />} />
        <Route path="/tools/calculator" element={<ProfitabilityCalculator />} />
        <Route path="/tools/niche-quiz" element={<NicheQuiz />} />
        <Route path="/tools/seo-audit" element={<SEOAudit />} />
        <Route path="/tools/keyword-research" element={<KeywordResearch />} />
        <Route path="/tools/backlink-checker" element={<BacklinkChecker />} />
        <Route path="/tools/performance" element={<PerformanceMonitor />} />
        <Route path="/auth/signup" element={<Signup />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/callback" element={<OAuthCallback />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/dashboard/courses" element={<ProtectedRoute><Courses /></ProtectedRoute>} />
        <Route path="/dashboard/community" element={<ProtectedRoute><Community /></ProtectedRoute>} />
        <Route path="/dashboard/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/dashboard/content" element={<ProtectedRoute><ContentCreation /></ProtectedRoute>} />
        <Route path="/dashboard/analytics" element={<ProtectedRoute><AnalyticsDashboard /></ProtectedRoute>} />
        <Route path="/products/:category" element={<ProductListing />} />
        <Route path="/product/:slug" element={<ProductDetail />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/webinar/:slug" element={<WebinarRegistration />} />
        <Route path="/challenge/:name" element={<ChallengeFunnel />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/resources/templates" element={<TemplatesLibrary />} />
        <Route path="/resources/niches" element={<NicheDatabase />} />
        <Route path="/learning-paths" element={<LearningPaths />} />
        <Route path="/learning-paths/:pathId" element={<LearningPathDetail />} />
        <Route path="/platform-guides" element={<PlatformGuides />} />
        <Route path="/creator-studio" element={<CreatorStudio />} />
        <Route path="/platform-guides/:slug" element={<PlatformGuideDetail />} />
        <Route path="/learning/case-studies" element={<CaseStudies />} />
        <Route path="/learning/workshops" element={<LiveWorkshops />} />
        <Route path="/learning/resources" element={<ResourceDownloads />} />
        <Route path="/community/members" element={<MemberDirectory />} />
        <Route path="/community/events" element={<Events />} />
        <Route path="/community/challenges" element={<Challenges />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="/health" element={<Health />} />
        <Route path="/news" element={<News />} />
        <Route path="/:pillarSlug" element={<PillarPage />} />
        <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </Router>
    </AuthWrapper>
  );
}
