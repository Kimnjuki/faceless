import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Play, Shield, Zap, Users, TrendingUp, CheckCircle2 } from "lucide-react";
import { trackButtonClick } from "@/utils/analytics";

export default function Hero() {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
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
              <span className="gradient-text font-bold">10,000+ Creators</span> Earning 6-Figures Anonymously
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight">
              Build a Profitable <span className="gradient-text bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">Faceless Content Business</span> in 2025
            </h1>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-muted-foreground mb-6">
              Unlike Medium, Substack & Ghost — <span className="text-foreground">No Real Name Required</span>
            </h2>

            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
              Build your faceless content empire with <strong>complete anonymity</strong>. Join creators earning 6-figures anonymously through AI-powered content, proven monetization strategies, and step-by-step automation — <strong>all without revealing your identity.</strong>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button 
                size="lg" 
                className="text-base px-8 gradient-primary hover:shadow-glow transition-all duration-300 hover-lift" 
                asChild
                onClick={() => trackButtonClick('start-journey', 'hero')}
              >
                <Link to="/auth/signup">
                  Start Your Faceless Journey <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
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

            <div className="flex flex-wrap justify-center gap-6 text-sm">
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
              <h3 className="font-bold text-lg mb-3 gradient-text">AI-Powered Content Creation</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">Automate your content with cutting-edge AI tools</p>
            </div>

            <div className="flex flex-col items-center text-center p-8 rounded-2xl glass border border-primary/10 hover-lift transition-all duration-300 group">
              <div className="h-14 w-14 rounded-2xl gradient-primary flex items-center justify-center mb-5 shadow-glow group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="h-7 w-7 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-3 gradient-text">Proven Monetization Strategies</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">Follow step-by-step systems that actually work</p>
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
