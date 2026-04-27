import React from 'react';
import { Link } from 'react-router-dom';

const AffiliateDisclosure: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 md:py-20">
      <nav className="mb-8 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <span>Affiliate Disclosure</span>
      </nav>

      <h1 className="text-3xl md:text-4xl font-bold mb-6">Affiliate Disclosure</h1>
      
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-lg mb-6">Last updated: April 25, 2026</p>

        <div className="bg-muted p-4 rounded-lg mb-8">
          <p className="m-0 font-medium">
            This Affiliate Disclosure explains how Faceless Solopreneur Hub earns revenue through affiliate partnerships and advertising.
          </p>
        </div>

        <h2 className="text-xl font-semibold mt-8 mb-4">Affiliate Relationship Disclosure</h2>
        <p>
          Faceless Solopreneur Hub contains affiliate links for products and services that we personally use, test, and recommend. When you click on these links and make a purchase, we may earn an affiliate commission at no additional cost to you.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4">Our Affiliate Policy</h2>
        <ul>
          <li>We only recommend products and services that we have personally used and believe provide value</li>
          <li>Affiliate relationships do not influence our editorial content or recommendations</li>
          <li>All reviews and recommendations are based on objective analysis and real-world experience</li>
          <li>You will never pay more for a product by using our affiliate links</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-4">Affiliate Programs We Participate In</h2>
        <p>Faceless Solopreneur Hub is a participant in the following affiliate programs:</p>
        <ul>
          <li>Amazon Services LLC Associates Program</li>
          <li>ClickBank Affiliate Program</li>
          <li>ShareASale Affiliate Network</li>
          <li>PartnerStack</li>
          <li>AppSumo Affiliate Program</li>
          <li>Various independent software vendor affiliate programs</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-4">Advertising Disclosure</h2>
        <p>
          This website displays advertisements through various advertising networks including Google AdSense, Ezoic, and Mediavine. These advertisements are identified as such and are separate from our editorial content.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4">FTC Compliance</h2>
        <p>
          This disclosure is in compliance with the Federal Trade Commission (FTC) guidelines regarding the use of endorsements and testimonials in advertising.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4">Contact Information</h2>
        <p>
          If you have any questions about this Affiliate Disclosure, please contact us through our <Link to="/contact" className="text-primary">Contact page</Link>.
        </p>
      </div>
    </div>
  );
};

export default AffiliateDisclosure;