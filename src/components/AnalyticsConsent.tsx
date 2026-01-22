import { useState, useEffect } from 'react';
import { X, Cookie, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { enableAnalytics, disableAnalytics } from '@/utils/analytics';

export default function AnalyticsConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('analytics_consent');
    if (consent === null) {
      // Show banner if no choice has been made
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    enableAnalytics();
    setShowBanner(false);
  };

  const handleDecline = () => {
    disableAnalytics();
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-fade-in">
      <Card className="max-w-4xl mx-auto shadow-2xl border-2 border-primary/20 glass">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Cookie className="h-6 w-6 text-primary" />
            </div>
            
            <div className="flex-1">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    Privacy & Analytics
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    We use analytics to improve your experience. Your data is anonymized and never shared. 
                    You can change this preference anytime in your settings.
                  </p>
                </div>
                <button
                  onClick={() => setShowBanner(false)}
                  className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
                  aria-label="Close cookie consent"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleAccept}
                  className="flex-1 gradient-primary hover:shadow-glow"
                  size="lg"
                >
                  Accept Analytics
                </Button>
                <Button
                  onClick={handleDecline}
                  variant="outline"
                  className="flex-1"
                  size="lg"
                >
                  Decline
                </Button>
              </div>
              
              <p className="text-xs text-muted-foreground mt-4">
                <a href="/privacy-policy" className="text-primary hover:underline">
                  Learn more about our privacy practices
                </a>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}







