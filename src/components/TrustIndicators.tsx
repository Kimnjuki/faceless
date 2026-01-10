import { Shield, Lock, Award, CheckCircle2 } from "lucide-react";

export default function TrustIndicators() {
  return (
    <section className="py-12 border-y bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {/* Security Badge */}
            <div className="flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mb-3">
                <Shield className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-semibold text-sm mb-1">SSL Secured</h3>
              <p className="text-xs text-muted-foreground">256-bit encryption</p>
            </div>

            {/* Payment Security */}
            <div className="flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center mb-3">
                <Lock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold text-sm mb-1">Secure Payments</h3>
              <p className="text-xs text-muted-foreground">Stripe & PayPal</p>
            </div>

            {/* Money Back Guarantee */}
            <div className="flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center mb-3">
                <Award className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-semibold text-sm mb-1">30-Day Guarantee</h3>
              <p className="text-xs text-muted-foreground">Money-back promise</p>
            </div>

            {/* Verified Platform */}
            <div className="flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center mb-3">
                <CheckCircle2 className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="font-semibold text-sm mb-1">Verified Platform</h3>
              <p className="text-xs text-muted-foreground">10,000+ members</p>
            </div>
          </div>

          {/* Payment Processor Logos */}
          <div className="mt-8 pt-8 border-t flex flex-wrap items-center justify-center gap-6 opacity-60">
            <div className="text-xs font-medium text-muted-foreground">Accepted Payment Methods:</div>
            <div className="flex items-center gap-4">
              <div className="px-3 py-1 bg-white dark:bg-gray-800 rounded text-xs font-semibold border">Stripe</div>
              <div className="px-3 py-1 bg-white dark:bg-gray-800 rounded text-xs font-semibold border">PayPal</div>
              <div className="px-3 py-1 bg-white dark:bg-gray-800 rounded text-xs font-semibold border">Visa</div>
              <div className="px-3 py-1 bg-white dark:bg-gray-800 rounded text-xs font-semibold border">Mastercard</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

