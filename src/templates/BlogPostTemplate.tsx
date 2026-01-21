/**
 * Blog Post Template
 * 
 * Use this template for creating new blog posts targeting long-tail keywords.
 * Each post should be 2,000+ words with comprehensive, valuable content.
 * 
 * Content Pillars:
 * 1. Educational: "How to Start a Faceless YouTube Channel in 2025"
 * 2. Tools: "15 Best AI Tools for Faceless Content Creators"
 * 3. Case Studies: "How [Name] Made $10K/Month with Faceless TikTok"
 * 4. Comparisons: "Faceless vs Traditional Content: Which Makes More Money?"
 * 5. Tutorials: "Step-by-Step: Creating Your First Faceless Video"
 */

import { useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SEO from "../components/SEO";

interface BlogPostTemplateProps {
  slug: string;
  title: string;
  description: string;
  keywords: string;
  publishedDate: string;
  modifiedDate?: string;
  author?: string;
  readingTime?: number;
  category?: string;
  featuredImage?: string;
}

export default function BlogPostTemplate({
  slug,
  title,
  description,
  keywords,
  publishedDate,
  modifiedDate,
  author = "ContentAnonymity Team",
  readingTime = 10,
  category = "Education",
  featuredImage = "https://contentanonymity.com/og-image.jpg",
}: BlogPostTemplateProps) {
  const url = `https://contentanonymity.com/blog/${slug}`;
  
  return (
    <>
      <SEO
        title={title}
        description={description}
        keywords={keywords}
        url={url}
        canonical={url}
        type="article"
        author={author}
        publishedTime={publishedDate}
        modifiedTime={modifiedDate || publishedDate}
        image={featuredImage}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "headline": title,
          "description": description,
          "image": featuredImage,
          "datePublished": publishedDate,
          "dateModified": modifiedDate || publishedDate,
          "author": {
            "@type": "Person",
            "name": author
          },
          "publisher": {
            "@type": "Organization",
            "name": "ContentAnonymity",
            "logo": {
              "@type": "ImageObject",
              "url": "https://contentanonymity.com/logo-icon.svg"
            }
          },
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": url
          },
          "articleSection": category,
          "keywords": keywords
        }}
      />
      <Header />
      <main className="min-h-screen py-12">
        <article className="container mx-auto px-4 max-w-4xl">
          {/* Article Header */}
          <header className="mb-8">
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary">
                {category}
              </span>
              <span>{new Date(publishedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              <span>•</span>
              <span>{readingTime} min read</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              {title}
            </h1>
            
            {featuredImage && (
              <img
                src={featuredImage}
                alt={title}
                className="w-full rounded-2xl mb-8 object-cover"
              />
            )}
          </header>

          {/* Article Content — full view, no truncation */}
          <div className="article-body prose prose-lg max-w-none overflow-visible">
            {/* 
              TODO: Replace this with your actual blog post content.
              Structure your content with:
              - Introduction (hook + what they'll learn)
              - Main sections with H2 headings
              - Sub-sections with H3 headings
              - Examples, case studies, screenshots
              - Actionable takeaways
              - Conclusion with CTA
            */}
            
            <div className="bg-primary/5 border-l-4 border-primary p-6 rounded-lg mb-8">
              <p className="text-lg font-semibold mb-2">📋 What You'll Learn:</p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Key insight #1</li>
                <li>Key insight #2</li>
                <li>Key insight #3</li>
              </ul>
            </div>

            <h2>Introduction</h2>
            <p>
              Start with a compelling hook that addresses the reader's pain point or desire.
              Clearly state what they'll learn and why it matters.
            </p>

            <h2>Main Section 1</h2>
            <p>
              Provide comprehensive, valuable content. Use examples, case studies, and actionable advice.
              Aim for 2,000+ words total.
            </p>

            <h3>Subsection</h3>
            <p>
              Break down complex topics into digestible sections.
            </p>

            <h2>Main Section 2</h2>
            <p>
              Continue providing value. Include screenshots, step-by-step instructions, or real examples.
            </p>

            <h2>Conclusion</h2>
            <p>
              Summarize key takeaways and include a clear call-to-action.
            </p>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 p-8 rounded-2xl my-12 text-center">
              <h3 className="text-2xl font-bold mb-4">Ready to Build Your Faceless Content Business?</h3>
              <p className="text-muted-foreground mb-6">
                Join 10,000+ creators earning 6-figures anonymously with our complete platform.
              </p>
              <a
                href="/auth/signup"
                className="inline-block px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
              >
                Start Your Free Trial →
              </a>
            </div>
          </div>

          {/* Author Bio */}
          <div className="border-t pt-8 mt-12">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-2xl">👤</span>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">{author}</h3>
                <p className="text-muted-foreground text-sm">
                  Expert in faceless content creation and anonymous entrepreneurship.
                </p>
              </div>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}

// Example usage:
// <BlogPostTemplate
//   slug="how-to-start-faceless-youtube-channel-2025"
//   title="How to Start a Faceless YouTube Channel in 2025: Complete Guide"
//   description="Learn how to start a profitable faceless YouTube channel in 2025. Step-by-step guide with proven strategies, tools, and monetization methods. Join thousands earning 6-figures anonymously."
//   keywords="faceless YouTube channel, how to start faceless YouTube, anonymous YouTube channel, faceless content 2025"
//   publishedDate="2025-01-27"
//   category="Education"
//   readingTime={15}
// />

