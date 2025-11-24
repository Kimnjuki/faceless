import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import HomePage from "./pages/HomePage";
import GettingStarted from "./pages/GettingStarted";
import BlogIndex from "./pages/BlogIndex";
import PillarPage from "./pages/PillarPage";
import ToolComparison from "./pages/ToolComparison";
import ProfitabilityCalculator from "./pages/tools/ProfitabilityCalculator";
import NicheQuiz from "./pages/tools/NicheQuiz";
import Signup from "./pages/auth/Signup";
import Login from "./pages/auth/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import Courses from "./pages/dashboard/Courses";
import Community from "./pages/dashboard/Community";
import Profile from "./pages/dashboard/Profile";
import ProductListing from "./pages/ecommerce/ProductListing";
import ProductDetail from "./pages/ecommerce/ProductDetail";
import Checkout from "./pages/ecommerce/Checkout";
import WebinarRegistration from "./pages/funnel/WebinarRegistration";
import ChallengeFunnel from "./pages/funnel/ChallengeFunnel";
import PrivacyPolicy from "./pages/legal/PrivacyPolicy";
import TermsOfService from "./pages/legal/TermsOfService";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/getting-started" element={<GettingStarted />} />
        <Route path="/blog" element={<BlogIndex />} />
        <Route path="/tools/:category" element={<ToolComparison />} />
        <Route path="/tools/calculator" element={<ProfitabilityCalculator />} />
        <Route path="/tools/niche-quiz" element={<NicheQuiz />} />
        <Route path="/auth/signup" element={<Signup />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/courses" element={<Courses />} />
        <Route path="/dashboard/community" element={<Community />} />
        <Route path="/dashboard/profile" element={<Profile />} />
        <Route path="/products/:category" element={<ProductListing />} />
        <Route path="/product/:slug" element={<ProductDetail />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/webinar/:slug" element={<WebinarRegistration />} />
        <Route path="/challenge/:name" element={<ChallengeFunnel />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/:pillarSlug" element={<PillarPage />} />
      </Routes>
      <Toaster />
    </Router>
  );
}
