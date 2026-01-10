import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { Badge } from "@/components/ui/badge";

export default function TermsOfService() {
  return (
    <>
      <Header />
      <div className="min-h-screen py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Badge className="mb-4">Legal</Badge>
            <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
            <p className="text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString()}</p>

            <div className="prose prose-slate max-w-none space-y-8">
              <section>
                <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
                <p className="text-muted-foreground">
                  By accessing and using ContentAnonymity.com (the "Service"), you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
                <p className="text-muted-foreground">
                  ContentAnonymity.com provides educational content, tools, and community resources for individuals interested in building faceless content businesses. The Service includes courses, templates, tools, and community access.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
                <p className="text-muted-foreground mb-4">
                  To access certain features of the Service, you must create an account. You agree to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Provide accurate and complete information</li>
                  <li>Maintain the security of your password</li>
                  <li>Notify us immediately of any unauthorized use</li>
                  <li>Be responsible for all activities under your account</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">4. Subscription and Payments</h2>
                <p className="text-muted-foreground mb-4">
                  Some features of the Service require a paid subscription. By purchasing a subscription:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>You authorize us to charge your payment method</li>
                  <li>Subscriptions automatically renew unless cancelled</li>
                  <li>You can cancel at any time from your account settings</li>
                  <li>Refunds are available within 30 days of purchase</li>
                  <li>Prices are subject to change with notice</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">5. Refund Policy</h2>
                <p className="text-muted-foreground">
                  We offer a 30-day money-back guarantee. If you're not satisfied with the Service within 30 days of your initial purchase, contact us for a full refund. This guarantee applies to first-time purchases only.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">6. Acceptable Use</h2>
                <p className="text-muted-foreground mb-4">
                  You agree not to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Share your account credentials with others</li>
                  <li>Reproduce, distribute, or resell our content</li>
                  <li>Use the Service for any illegal purpose</li>
                  <li>Harass, abuse, or harm other users</li>
                  <li>Attempt to gain unauthorized access to the Service</li>
                  <li>Upload malicious code or spam</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">7. Intellectual Property</h2>
                <p className="text-muted-foreground">
                  All content, features, and functionality of the Service are owned by ContentAnonymity.com and protected by copyright, trademark, and other intellectual property laws. You may not copy, modify, or create derivative works without our permission.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">8. Disclaimer of Warranties</h2>
                <p className="text-muted-foreground">
                  The Service is provided "as is" without warranties of any kind. We do not guarantee specific results or earnings. Your success depends on various factors including your effort, skills, and market conditions.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">9. Limitation of Liability</h2>
                <p className="text-muted-foreground">
                  To the maximum extent permitted by law, ContentAnonymity.com shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the Service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">10. Termination</h2>
                <p className="text-muted-foreground">
                  We may terminate or suspend your account and access to the Service at any time, without prior notice, for conduct that we believe violates these Terms or is harmful to other users or the Service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">11. Changes to Terms</h2>
                <p className="text-muted-foreground">
                  We reserve the right to modify these Terms at any time. We will provide notice of material changes. Your continued use of the Service after changes constitutes acceptance of the new Terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">12. Governing Law</h2>
                <p className="text-muted-foreground">
                  These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which ContentAnonymity.com operates, without regard to its conflict of law provisions.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">13. Contact Information</h2>
                <p className="text-muted-foreground">
                  For questions about these Terms, please contact us at:
                  <br />
                  <strong>Email:</strong> legal@facelesssuccess.com
                  <br />
                  <strong>Support:</strong> support@facelesssuccess.com
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
