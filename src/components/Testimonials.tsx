import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Alex M.",
    role: "Faceless YouTuber",
    content: "From zero to $5K/month in just 4 months. The automation systems are game-changing!",
    rating: 5,
    initials: "AM"
  },
  {
    name: "Sarah K.",
    role: "Digital Product Creator",
    content: "Finally, a platform that understands faceless creators. The community alone is worth 10x the price.",
    rating: 5,
    initials: "SK"
  },
  {
    name: "Jordan P.",
    role: "Content Entrepreneur",
    content: "The niche research tools helped me find 3 profitable niches in a week. Incredible ROI.",
    rating: 5,
    initials: "JP"
  }
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Success Stories from Our Community
          </h2>
          <p className="text-lg text-muted-foreground">
            Join thousands of creators building profitable faceless businesses
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-sm mb-6">{testimonial.content}</p>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-primary/10 text-primary">{testimonial.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-sm">{testimonial.name}</div>
                    <div className="text-xs text-foreground/70">{testimonial.role}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
