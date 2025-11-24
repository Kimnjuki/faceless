import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

const faqs = [
  {
    question: "Do I really need to show my face to make money online?",
    answer: "Absolutely not! Thousands of creators are earning 6-figures without ever showing their face. Our platform teaches you proven strategies for faceless content across YouTube, TikTok, Instagram, and more. You'll learn to use AI voices, stock footage, animations, and other techniques to create engaging content while staying completely anonymous."
  },
  {
    question: "How much money can I realistically make with faceless content?",
    answer: "Earnings vary based on niche, consistency, and monetization strategies. Our community members report earnings ranging from $1K-$50K+ per month. Beginners typically start seeing their first $1K-$3K within 3-6 months. The key is choosing the right niche, following our proven systems, and staying consistent."
  },
  {
    question: "What tools and software do I need to get started?",
    answer: "You can start with free tools! We recommend starting with free AI voice generators, Canva for graphics, and CapCut for video editing. As you scale, you might invest in premium tools ($50-$200/month). We provide detailed tool comparisons, discounts, and step-by-step tutorials for every tool you'll need."
  },
  {
    question: "How long does it take to start making money?",
    answer: "Most creators see their first earnings within 2-4 months. However, this depends on your niche, content quality, and consistency. Some niches like meditation content can monetize within 1-2 months, while others like finance education might take 3-4 months. Our platform helps you choose the fastest path to profitability for your situation."
  },
  {
    question: "I have no experience with content creation. Can I still succeed?",
    answer: "Yes! Most of our successful members started with zero experience. Our step-by-step courses walk you through everything from niche selection to content creation to monetization. You'll get templates, scripts, and done-for-you resources that make the process simple, even if you're a complete beginner."
  },
  {
    question: "What's included in the membership?",
    answer: "You get access to our complete course library (50+ hours), AI tool discounts, done-for-you templates and scripts, weekly live coaching calls, private community access, niche finder tools, profitability calculator, and ongoing updates. Everything you need to build a profitable faceless content business is included."
  },
  {
    question: "Can I do this part-time while working a full-time job?",
    answer: "Absolutely! Most of our members start part-time, dedicating 5-10 hours per week. Faceless content is perfect for side hustlers because you can batch-create content and schedule it in advance. Many members eventually transition to full-time once they hit $5K-$10K per month."
  },
  {
    question: "What if I choose the wrong niche?",
    answer: "No problem! Our Niche Finder Quiz and profitability calculator help you choose the right niche from the start. If you need to pivot, our strategies are transferable across niches. Plus, you'll have access to our community and coaching to get guidance before making any major decisions."
  },
  {
    question: "Is there a money-back guarantee?",
    answer: "Yes! We offer a 30-day money-back guarantee. If you're not satisfied with the platform, courses, or community within the first 30 days, simply email us for a full refund. No questions asked. We're confident you'll love what we've built."
  },
  {
    question: "How is this different from free YouTube tutorials?",
    answer: "Free content is scattered, outdated, and incomplete. Our platform gives you a complete, step-by-step system with proven strategies, templates, and ongoing support. You'll save months of trial and error, avoid costly mistakes, and get direct access to successful faceless creators who can answer your questions and review your content."
  }
];

export default function FAQ() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4">FAQ</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to know about building a faceless content business
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
