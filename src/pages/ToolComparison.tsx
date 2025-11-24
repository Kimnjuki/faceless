import { useParams } from "react-router-dom";
import { useState } from "react";
import { Check, X, ExternalLink } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const tools = [
  {
    name: "Tool Alpha",
    price: "$29/mo",
    rating: 4.8,
    features: { automation: true, analytics: true, templates: true, support: false },
    affiliate: true
  },
  {
    name: "Tool Beta",
    price: "$49/mo",
    rating: 4.9,
    features: { automation: true, analytics: true, templates: true, support: true },
    affiliate: true
  },
  {
    name: "Tool Gamma",
    price: "$19/mo",
    rating: 4.5,
    features: { automation: false, analytics: true, templates: true, support: false },
    affiliate: true
  }
];

export default function ToolComparison() {
  const { category } = useParams();
  const [filter, setFilter] = useState("all");

  return (
    <>
      <Header />
      <main className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Best {category?.replace(/-/g, " ")} Tools
            </h1>
            <p className="text-lg text-muted-foreground">
              Compare features, pricing, and reviews to find the perfect tool for your needs
            </p>
          </div>

          <div className="flex gap-2 justify-center mb-8">
            <Button variant={filter === "all" ? "default" : "outline"} onClick={() => setFilter("all")}>
              All Tools
            </Button>
            <Button variant={filter === "budget" ? "default" : "outline"} onClick={() => setFilter("budget")}>
              Budget Friendly
            </Button>
            <Button variant={filter === "premium" ? "default" : "outline"} onClick={() => setFilter("premium")}>
              Premium
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {tools.map((tool, index) => (
              <Card key={index} className="relative hover:border-primary transition-colors">
                {tool.affiliate && (
                  <Badge className="absolute top-4 right-4 bg-green-500">Verified</Badge>
                )}
                <CardHeader>
                  <CardTitle>{tool.name}</CardTitle>
                  <div className="text-3xl font-bold text-primary">{tool.price}</div>
                  <div className="text-sm text-muted-foreground">⭐ {tool.rating}/5.0</div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center gap-2 text-sm">
                      {tool.features.automation ? <Check className="h-4 w-4 text-green-500" /> : <X className="h-4 w-4 text-muted-foreground" />}
                      Automation
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      {tool.features.analytics ? <Check className="h-4 w-4 text-green-500" /> : <X className="h-4 w-4 text-muted-foreground" />}
                      Analytics
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      {tool.features.templates ? <Check className="h-4 w-4 text-green-500" /> : <X className="h-4 w-4 text-muted-foreground" />}
                      Templates
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      {tool.features.support ? <Check className="h-4 w-4 text-green-500" /> : <X className="h-4 w-4 text-muted-foreground" />}
                      24/7 Support
                    </li>
                  </ul>
                  <Button className="w-full">
                    Visit Site <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
