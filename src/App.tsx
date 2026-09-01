import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider, AuthProviderFallback } from "@/contexts/AuthContext";
import AnalyticsConsent from "@/components/AnalyticsConsent";
import { trackPageView } from "@/utils/analytics";
import { initWebVitals } from "@/utils/webVitals";
const HomePage = lazy(() => import("./pages/HomePage"));
const StartHere = lazy(() => import("./pages/StartHere"));
const GettingStarted = lazy(() => import("./pages/GettingStarted"));
const BlogIndex = lazy(() => import("./pages/BlogIndex"));
const ArticleDetail = lazy(() => import("./pages/ArticleDetail"));
const PillarPage = lazy(() => import("./pages/PillarPage"));
const ToolComparison = lazy(() => import("./pages/ToolComparison"));
const ProfitabilityCalculator = lazy(() => import("./pages/tools/ProfitabilityCalculator"));
const NicheQuiz = lazy(() => import("./pages/tools/NicheQuiz"));
const SEOAudit = lazy(() => import("./pages/tools/SEOAudit"));
const KeywordResearch = lazy(() => import("./pages/tools/KeywordResearch"));
const BacklinkChecker = lazy(() => import("./pages/tools/BacklinkChecker"));
const PerformanceMonitor = lazy(() => import("./pages/tools/PerformanceMonitor"));
const ScriptGenerator = lazy(() => import("./pages/tools/ScriptGenerator"));
const TrendScanner = lazy(() => import("./pages/tools/TrendScanner"));
const ChannelAnalyzer = lazy(() => import("./pages/tools/ChannelAnalyzer"));
const Signup = lazy(() => import("./pages/auth/Signup"));
const Login = lazy(() => import("./pages/auth/Login"));
const OAuthCallback = lazy(() => import("./pages/auth/OAuthCallback"));
const Dashboard = lazy(() => import("./pages/dashboard/Dashboard"));
const Courses = lazy(() => import("./pages/dashboard/Courses"));
const CoursePlayer = lazy(() => import("./pages/courses/CoursePlayer"));
const Community = lazy(() => import("./pages/dashboard/Community"));
const Profile = lazy(() => import("./pages/dashboard/Profile"));
const ContentCreation = lazy(() => import("./pages/dashboard/ContentCreation"));
const AnalyticsDashboard = lazy(() => import("./pages/dashboard/AnalyticsDashboard"));
const ProductListing = lazy(() => import("./pages/ecommerce/ProductListing"));
const ProductDetail = lazy(() => import("./pages/ecommerce/ProductDetail"));
const Checkout = lazy(() => import("./pages/ecommerce/Checkout"));
const WebinarRegistration = lazy(() => import("./pages/funnel/WebinarRegistration"));
const ChallengeFunnel = lazy(() => import("./pages/funnel/ChallengeFunnel"));
const PrivacyPolicy = lazy(() => import("./pages/legal/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/legal/TermsOfService"));
const AffiliateDisclosure = lazy(() => import("./pages/legal/AffiliateDisclosure"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const TemplatesLibrary = lazy(() => import("./pages/resources/TemplatesLibrary"));
const NicheDatabase = lazy(() => import("./pages/resources/NicheDatabase"));
const NicheDetail = lazy(() => import("./pages/niches/NicheDetail"));
const LearningPaths = lazy(() => import("./pages/learning/LearningPaths"));
const LearningPathDetail = lazy(() => import("./pages/learning/LearningPathDetail"));
const CreatorStudio = lazy(() => import("./pages/creator-studio/CreatorStudio"));
const PlatformGuides = lazy(() => import("./pages/learning/PlatformGuides"));
const AiPlaybook = lazy(() => import("./pages/dashboard/AiPlaybook"));
const PlatformGuideDetail = lazy(() => import("./pages/learning/PlatformGuideDetail"));
const CaseStudies = lazy(() => import("./pages/learning/CaseStudies"));
const CaseStudyDetail = lazy(() => import("./pages/learning/CaseStudyDetail"));
const LiveWorkshops = lazy(() => import("./pages/learning/LiveWorkshops"));
const ResourceDownloads = lazy(() => import("./pages/learning/ResourceDownloads"));
const MemberDirectory = lazy(() => import("./pages/community/MemberDirectory"));
const Events = lazy(() => import("./pages/community/Events"));
const Challenges = lazy(() => import("./pages/community/Challenges"));
const CommunityIndex = lazy(() => import("./pages/community/CommunityIndex"));
const CreatorRoadmap = lazy(() => import("./pages/CreatorRoadmap"));
const OpportunityFinder = lazy(() => import("./pages/OpportunityFinder"));
const MonetizationMatcher = lazy(() => import("./pages/MonetizationMatcher"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Health = lazy(() => import("./pages/Health"));
const ThreatModels = lazy(() => import("./pages/ThreatModels"));
const News = lazy(() => import("./pages/News"));

import ProtectedRoute from "./components/ProtectedRoute";
import PerformanceOptimizer from "./components/PerformanceOptimizer";
import ForeMediaAd from "./components/ForeMediaAd";
import { isAuth0Configured } from "@/lib/auth0";

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

const hasAuth0 = isAuth0Configured();

export default function App() {
  const AuthWrapper = hasAuth0 ? AuthProvider : AuthProviderFallback;
  return (
    <AuthWrapper>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <PerformanceOptimizer />
        <PageViewTracker />
        <AnalyticsConsent />
        {/* ForeMedia POP_ADS - loads once site-wide */}
        <ForeMediaAd slot="pop_ads" />
        <Suspense fallback={
          <div className="min-h-[60vh] flex items-center justify-center">
            <div className="flex flex-col items-center gap-3 text-muted-foreground">
              <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span className="text-sm">Loading page…</span>
            </div>
          </div>
        }>
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
        <Route path="/tools/script-generator" element={<ScriptGenerator />} />
        <Route path="/tools/trend-scanner" element={<TrendScanner />} />
        <Route path="/tools/channel-analyzer" element={<ChannelAnalyzer />} />
        <Route path="/auth/signup" element={<Signup />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/callback" element={<OAuthCallback />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/dashboard/playbook" element={<ProtectedRoute><AiPlaybook /></ProtectedRoute>} />
        <Route path="/dashboard/courses" element={<ProtectedRoute><Courses /></ProtectedRoute>} />
        <Route path="/courses/:courseId/learn" element={<ProtectedRoute><CoursePlayer /></ProtectedRoute>} />
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
         <Route path="/terms" element={<TermsOfService />} />
         <Route path="/affiliate-disclosure" element={<AffiliateDisclosure />} />
        <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy/threat-models" element={<ThreatModels />} />
        <Route path="/resources/templates" element={<TemplatesLibrary />} />
        <Route path="/resources/niches" element={<NicheDatabase />} />
        <Route path="/niches/:nicheId" element={<NicheDetail />} />
        <Route path="/learning-paths" element={<LearningPaths />} />
        <Route path="/learning-paths/:pathId" element={<LearningPathDetail />} />
        <Route path="/platform-guides" element={<PlatformGuides />} />
        <Route path="/creator-studio" element={<CreatorStudio />} />
        <Route path="/platform-guides/:slug" element={<PlatformGuideDetail />} />
        <Route path="/learning/case-studies" element={<CaseStudies />} />
        <Route path="/learning/case-studies/:slug" element={<CaseStudyDetail />} />
        <Route path="/learning/workshops" element={<LiveWorkshops />} />
        <Route path="/learning/resources" element={<ResourceDownloads />} />
         <Route path="/community" element={<CommunityIndex />} />
         <Route path="/community/members" element={<MemberDirectory />} />
         <Route path="/community/events" element={<Events />} />
         <Route path="/community/challenges" element={<Challenges />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="/health" element={<Health />} />
        <Route path="/creator-roadmap" element={<CreatorRoadmap />} />
        <Route path="/opportunity-finder" element={<OpportunityFinder />} />
        <Route path="/monetization-matcher" element={<MonetizationMatcher />} />
        <Route path="/news" element={<News />} />
        <Route path="/:pillarSlug" element={<PillarPage />} />
        <Route path="*" element={<NotFound />} />
        </Routes>
        </Suspense>
        <Toaster />
      </Router>
    </AuthWrapper>
  );
}
