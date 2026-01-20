import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import AnalyticsConsent from "@/components/AnalyticsConsent";
import { trackPageView } from "@/utils/analytics";
import HomePage from "./pages/HomePage";
import GettingStarted from "./pages/GettingStarted";
import BlogIndex from "./pages/BlogIndex";
import ArticleDetail from "./pages/ArticleDetail";
import PillarPage from "./pages/PillarPage";
import ToolComparison from "./pages/ToolComparison";
import ProfitabilityCalculator from "./pages/tools/ProfitabilityCalculator";
import NicheQuiz from "./pages/tools/NicheQuiz";
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
import PlatformGuides from "./pages/learning/PlatformGuides";
import PlatformGuideDetail from "./pages/learning/PlatformGuideDetail";
import CaseStudies from "./pages/learning/CaseStudies";
import LiveWorkshops from "./pages/learning/LiveWorkshops";
import ResourceDownloads from "./pages/learning/ResourceDownloads";
import MemberDirectory from "./pages/community/MemberDirectory";
import Events from "./pages/community/Events";
import Challenges from "./pages/community/Challenges";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
// Component to track page views on route changes
function PageViewTracker() {
  const location = useLocation();

  useEffect(() => {
    // Track page view on route change
    trackPageView(location.pathname + location.search, document.title);
  }, [location]);

  return null;
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <PageViewTracker />
        <AnalyticsConsent />
        <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/getting-started" element={<GettingStarted />} />
        <Route path="/blog" element={<BlogIndex />} />
        <Route path="/blog/:slug" element={<ArticleDetail />} />
        <Route path="/tools/all" element={<ToolComparison />} />
        <Route path="/tools/:category" element={<ToolComparison />} />
        <Route path="/tools/calculator" element={<ProfitabilityCalculator />} />
        <Route path="/tools/niche-quiz" element={<NicheQuiz />} />
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
        <Route path="/platform-guides/:slug" element={<PlatformGuideDetail />} />
        <Route path="/learning/case-studies" element={<CaseStudies />} />
        <Route path="/learning/workshops" element={<LiveWorkshops />} />
        <Route path="/learning/resources" element={<ResourceDownloads />} />
        <Route path="/community/members" element={<MemberDirectory />} />
        <Route path="/community/events" element={<Events />} />
        <Route path="/community/challenges" element={<Challenges />} />
        <Route path="/:pillarSlug" element={<PillarPage />} />
        <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </Router>
    </AuthProvider>
  );
}
