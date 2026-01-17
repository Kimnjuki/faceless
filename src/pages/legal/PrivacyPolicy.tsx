import Header from "../../components/Header";
import Footer from "../../components/Footer";
import SEO from "../../components/SEO";
import { Badge } from "@/components/ui/badge";

export default function PrivacyPolicy() {
  return (
    <>
      <SEO
        title="Privacy Policy"
        description="ContentAnonymity's Privacy Policy. Learn how we collect, use, and protect your personal information. GDPR compliant privacy practices for anonymous content creators."
        keywords="privacy policy, data protection, GDPR, privacy rights, data security, anonymous data"
        url="https://contentanonymity.com/privacy-policy"
        canonical="https://contentanonymity.com/privacy-policy"
        noindex={false}
      />
      <Header />
      <div className="min-h-screen py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Badge className="mb-4">Legal</Badge>
            <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString()}</p>

            <div className="prose prose-slate max-w-none space-y-8">
              <section>
                <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
                <p className="text-muted-foreground mb-4">
                  We collect information you provide directly to us, including when you create an account, subscribe to our services, or communicate with us.
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Account information (name, email address, password)</li>
                  <li>Profile information (bio, preferences, goals)</li>
                  <li>Payment information (processed securely through Stripe)</li>
                  <li>Communications with us</li>
                  <li>Usage data and analytics</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
                <p className="text-muted-foreground mb-4">
                  We use the information we collect to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Provide, maintain, and improve our services</li>
                  <li>Process transactions and send related information</li>
                  <li>Send you technical notices and support messages</li>
                  <li>Respond to your comments and questions</li>
                  <li>Send marketing communications (with your consent)</li>
                  <li>Monitor and analyze trends and usage</li>
                  <li>Detect, prevent, and address technical issues</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">3. Information Sharing</h2>
                <p className="text-muted-foreground mb-4">
                  We do not sell your personal information. We may share your information in the following circumstances:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>With service providers who perform services on our behalf</li>
                  <li>To comply with legal obligations</li>
                  <li>To protect our rights and prevent fraud</li>
                  <li>With your consent or at your direction</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">4. Data Security</h2>
                <p className="text-muted-foreground">
                  We implement appropriate technical and organizational measures to protect your personal information. However, no method of transmission over the Internet is 100% secure.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">5. Your Rights</h2>
                <p className="text-muted-foreground mb-4">
                  You have the right to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Access your personal information</li>
                  <li>Correct inaccurate information</li>
                  <li>Request deletion of your information</li>
                  <li>Object to processing of your information</li>
                  <li>Export your data</li>
                  <li>Withdraw consent at any time</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">6. Cookies and Tracking</h2>
                <p className="text-muted-foreground">
                  We use cookies and similar tracking technologies to track activity on our service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">7. Children's Privacy</h2>
                <p className="text-muted-foreground">
                  Our service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">8. Changes to This Policy</h2>
                <p className="text-muted-foreground">
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">9. Contact Us</h2>
                <p className="text-muted-foreground">
                  If you have any questions about this Privacy Policy, please contact us at:
                  <br />
                  <strong>Email:</strong> privacy@facelesssuccess.com
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
