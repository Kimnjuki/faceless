import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

/** Exported for FAQ schema on HomePage SEO */
export const faqs = [
  {
    question: "Do I really need to show my face to make money online?",
    answer: "Absolutely not. Many successful channels operate without ever showing the creator's face. Our guides teach strategies for faceless content across YouTube, TikTok, and Instagram using AI voices, stock footage, and animations while keeping your identity private."
  },
  {
    question: "How much money can I realistically make with faceless content?",
    answer: "Earnings vary widely by niche, consistency, and monetization strategy. Documented faceless channels range from a few hundred to tens of thousands of dollars per month. Most new channels take 6-18 months of consistent output to reach meaningful revenue."
  },
  {
    question: "What tools and software do I need to get started?",
    answer: "You can start with free tools! We recommend starting with free AI voice generators, Canva for graphics, and CapCut for video editing. As you scale, you might invest in premium tools ($50-$200/month). We provide detailed tool comparisons, discounts, and step-by-step tutorials for every tool you'll need."
  },
  {
    question: "How long does it take to start making money?",
    answer: "Most channels take 4-6 months to reach YouTube's monetization threshold (1,000 subscribers and 4,000 watch hours) and 6-14 months to earn meaningful income. It depends on your niche, consistency, and content quality. Our platform helps you choose a faster path to profitability."
  },
  {
    question: "I have no experience with content creation. Can I still succeed?",
    answer: "Yes. Faceless content is well suited to beginners. Our step-by-step guides walk you through niche selection, content creation, and monetization, with templates and scripts that make the process approachable even with no prior experience."
  },
  {
    question: "What's included in the membership?",
    answer: "You get access to our complete course library (50+ hours), AI tool discounts, done-for-you templates and scripts, weekly live coaching calls, private community access, niche finder tools, profitability calculator, and ongoing updates. Everything you need to build a profitable faceless content business is included."
  },
  {
    question: "Can I do this part-time while working a full-time job?",
    answer: "Absolutely. Many creators start part-time with 5-10 hours a week, since faceless content can be batch-created and scheduled in advance. Some transition to full-time once their revenue justifies it."
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
