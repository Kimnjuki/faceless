import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Play, Shield, Zap, Users, TrendingUp, CheckCircle2 } from "lucide-react";
import { trackButtonClick } from "@/utils/analytics";

export default function Hero() {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden min-h-[600px] md:min-h-[700px]" style={{ containIntrinsicSize: '600px 700px' }}>
      {/* Modern gradient background with animated blur */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-purple-500/5 via-background to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.1),transparent_50%)] animate-pulse-slow" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass border border-primary/20 text-primary text-sm font-semibold mb-8 shadow-modern hover-lift">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span className="gradient-text font-bold">10,000+ Creators</span> Earning $1,000+ Monthly Anonymously
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight">
              Join 10,000+ Anonymous Creators Earning $1,000+ Monthly (Without Showing Your Face)
            </h1>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-muted-foreground mb-6">
              The All-In-One Platform with AI Tools, Templates, and Community to Build Your Faceless Empire in 30 Days
            </h2>

            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
              Create 30 days of content in 2 hours with AI. Build profitable income streams with <strong>complete anonymity</strong>. Proven strategies, step-by-step automation, and 10,000+ creators earning $1K+ monthly — <strong>all without revealing your identity.</strong>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Button 
                size="lg" 
                className="text-base px-8 gradient-primary hover:shadow-glow transition-all duration-300 hover-lift" 
                asChild
                onClick={() => trackButtonClick('start-journey', 'hero')}
              >
                <Link to="/auth/signup">
                  Get Free Access to Creator Tools <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-base glass border-primary/20 hover:border-primary/40 hover:bg-primary/5 transition-all duration-300"
                onClick={() => trackButtonClick('watch-demo', 'hero')}
              >
                <Play className="mr-2 h-4 w-4" /> Watch How It Works
              </Button>
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-sm mb-8">
              <div className="flex items-center gap-2 text-muted-foreground">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                No credit card required
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                30-day money-back guarantee
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                Cancel anytime
              </div>
            </div>

            {/* Trust badges row (CRO): user count, success metric, security */}
            <div className="flex flex-wrap justify-center items-center gap-8 py-6 px-4 rounded-2xl glass border border-primary/10 mb-4">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-primary" />
                <div className="text-left">
                  <div className="font-bold text-foreground">10,000+</div>
                  <div className="text-xs text-muted-foreground">Active Creators</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <TrendingUp className="h-8 w-8 text-primary" />
                <div className="text-left">
                  <div className="font-bold text-foreground">$1K+</div>
                  <div className="text-xs text-muted-foreground">Avg. Monthly Earnings</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="h-8 w-8 text-green-600 dark:text-green-400" />
                <div className="text-left">
                  <div className="font-bold text-foreground">SSL Secured</div>
                  <div className="text-xs text-muted-foreground">256-bit encryption</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                <span>Verified platform • Stripe & PayPal</span>
              </div>
            </div>
          </div>

          {/* Key Selling Points - Modern Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
            <div className="flex flex-col items-center text-center p-8 rounded-2xl glass border border-primary/10 hover-lift transition-all duration-300 group">
              <div className="h-14 w-14 rounded-2xl gradient-primary flex items-center justify-center mb-5 shadow-glow group-hover:scale-110 transition-transform duration-300">
                <Shield className="h-7 w-7 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-3 gradient-text">Complete Privacy Protection</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">Stay 100% anonymous while building your empire</p>
            </div>

            <div className="flex flex-col items-center text-center p-8 rounded-2xl glass border border-primary/10 hover-lift transition-all duration-300 group">
              <div className="h-14 w-14 rounded-2xl gradient-primary flex items-center justify-center mb-5 shadow-glow group-hover:scale-110 transition-transform duration-300">
                <Zap className="h-7 w-7 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-3 gradient-text">Create 30 Days of Content in 2 Hours</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">AI-powered automation for faceless videos and posts</p>
            </div>

            <div className="flex flex-col items-center text-center p-8 rounded-2xl glass border border-primary/10 hover-lift transition-all duration-300 group">
              <div className="h-14 w-14 rounded-2xl gradient-primary flex items-center justify-center mb-5 shadow-glow group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="h-7 w-7 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-3 gradient-text">$5K–$15K/Month Within 6–12 Months</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">Proven monetization strategies that actually work</p>
            </div>

            <div className="flex flex-col items-center text-center p-8 rounded-2xl glass border border-primary/10 hover-lift transition-all duration-300 group">
              <div className="h-14 w-14 rounded-2xl gradient-primary flex items-center justify-center mb-5 shadow-glow group-hover:scale-110 transition-transform duration-300">
                <Users className="h-7 w-7 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-3 gradient-text">10,000+ Creator Community</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">Learn from successful faceless creators</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
