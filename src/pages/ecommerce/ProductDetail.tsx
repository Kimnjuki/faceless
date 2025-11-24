import { useParams, Link } from "react-router-dom";
import { Check, Star, ShoppingCart, Shield, RefreshCw, Zap } from "lucide-react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const features = [
  "Lifetime access to all materials",
  "30-day money-back guarantee",
  "Priority email support",
  "Free updates forever",
  "Community forum access",
  "Bonus templates included"
];

const testimonials = [
  { author: "Mike T.", rating: 5, text: "Best investment I've made for my business! Made my money back in 2 weeks.", verified: true },
  { author: "Lisa R.", rating: 5, text: "Clear, actionable, and worth every penny. The templates alone saved me 20+ hours.", verified: true },
  { author: "James K.", rating: 5, text: "Finally a course that delivers on its promises. Highly recommend!", verified: true }
];

const trustBadges = [
  { icon: Shield, text: "Secure Checkout" },
  { icon: RefreshCw, text: "30-Day Refund" },
  { icon: Zap, text: "Instant Access" }
];

export default function ProductDetail() {
  const { slug } = useParams();

  return (
    <>
      <Header />
      <main className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <div>
              <Badge className="mb-4">Digital Product</Badge>
              <h1 className="text-4xl font-bold mb-4">
                {slug?.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                Complete toolkit to launch and scale your faceless content business with proven systems, templates, and step-by-step guidance.
              </p>
              
              <div className="flex items-center gap-2 mb-6">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                  ))}
                </div>
                <span className="text-sm font-semibold">4.9/5</span>
                <span className="text-sm text-muted-foreground">(127 reviews)</span>
              </div>

              <Separator className="my-6" />

              <div className="space-y-3 mb-6">
                <h3 className="font-semibold text-lg">What's Included:</h3>
                {features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-4 mt-8">
                {trustBadges.map((badge, i) => (
                  <div key={i} className="flex flex-col items-center text-center p-4 bg-muted/50 rounded-lg">
                    <badge.icon className="h-6 w-6 text-primary mb-2" />
                    <span className="text-xs font-medium">{badge.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Card className="sticky top-20 border-2 border-primary/20">
                <CardContent className="p-6">
                  <div className="mb-4">
                    <div className="text-sm text-muted-foreground line-through mb-1">$297</div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold">$197</span>
                      <Badge variant="secondary">Save $100</Badge>
                    </div>
                  </div>
                  
                  <Button size="lg" className="w-full mb-3" asChild>
                    <Link to="/checkout">
                      <ShoppingCart className="mr-2 h-5 w-5" />
                      Add to Cart
                    </Link>
                  </Button>
                  
                  <Button size="lg" variant="outline" className="w-full mb-4">
                    Buy Now - Save $100
                  </Button>
                  
                  <Separator className="my-4" />
                  
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span>Instant digital download</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span>30-day money-back guarantee</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span>Secure payment processing</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-primary/5 rounded-lg text-center">
                    <p className="text-sm font-medium">🔥 Limited Time Offer</p>
                    <p className="text-xs text-muted-foreground mt-1">47 people bought this in the last 24 hours</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="mt-16 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Verified Customer Reviews</h2>
            <div className="space-y-4">
              {testimonials.map((review, i) => (
                <Card key={i}>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex">
                        {[...Array(review.rating)].map((_, j) => (
                          <Star key={j} className="h-4 w-4 fill-primary text-primary" />
                        ))}
                      </div>
                      <span className="font-semibold">{review.author}</span>
                      {review.verified && (
                        <Badge variant="secondary" className="text-xs">Verified Purchase</Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground">{review.text}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
