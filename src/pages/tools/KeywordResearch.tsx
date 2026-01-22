import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  TrendingUp, 
  HelpCircle, 
  Lightbulb,
  BarChart3,
  ExternalLink,
  Download
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

interface Keyword {
  keyword: string;
  searchVolume: number;
  difficulty: number;
  cpc: number;
  intent: 'informational' | 'commercial' | 'transactional';
}

interface Question {
  question: string;
  type: 'question' | 'preposition' | 'comparison';
}

export default function KeywordResearch() {
  const [query, setQuery] = useState("");
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);

  const handleResearch = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    
    // Simulate API call (in production, integrate with AnswerThePublic API or similar)
    setTimeout(() => {
      // Generate sample keywords based on query
      const generatedKeywords: Keyword[] = [
        {
          keyword: `${query} guide`,
          searchVolume: 1200,
          difficulty: 45,
          cpc: 2.5,
          intent: 'informational'
        },
        {
          keyword: `how to ${query}`,
          searchVolume: 890,
          difficulty: 35,
          cpc: 1.8,
          intent: 'informational'
        },
        {
          keyword: `best ${query} tools`,
          searchVolume: 650,
          difficulty: 55,
          cpc: 3.2,
          intent: 'commercial'
        },
        {
          keyword: `${query} for beginners`,
          searchVolume: 450,
          difficulty: 30,
          cpc: 1.5,
          intent: 'informational'
        },
        {
          keyword: `${query} tutorial`,
          searchVolume: 320,
          difficulty: 40,
          cpc: 2.0,
          intent: 'informational'
        }
      ];

      const generatedQuestions: Question[] = [
        { question: `What is ${query}?`, type: 'question' },
        { question: `How does ${query} work?`, type: 'question' },
        { question: `Why use ${query}?`, type: 'question' },
        { question: `When to use ${query}?`, type: 'question' },
        { question: `Where to learn ${query}?`, type: 'question' },
        { question: `${query} vs alternatives`, type: 'comparison' },
        { question: `${query} for beginners`, type: 'preposition' },
        { question: `${query} best practices`, type: 'preposition' }
      ];

      setKeywords(generatedKeywords);
      setQuestions(generatedQuestions);
      setLoading(false);
    }, 1000);
  };

  return (
    <>
      <SEO
        title="Free Keyword Research Tool - Find SEO Keywords | ContentAnonymity"
        description="Free keyword research tool to find high-value keywords, search questions, and content ideas. Alternative to Ahrefs and Semrush keyword tools."
      />
      <Header />
      <main className="min-h-screen py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-4">Free Keyword Research Tool</h1>
              <p className="text-lg text-muted-foreground mb-6">
                Find high-value keywords and content ideas without paying $100+/month
              </p>
              
              <div className="flex gap-4 max-w-2xl mx-auto mb-8">
                <Input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Enter a keyword or topic (e.g., faceless content)"
                  className="flex-1"
                  onKeyPress={(e) => e.key === 'Enter' && handleResearch()}
                />
                <Button onClick={handleResearch} disabled={loading || !query.trim()}>
                  {loading ? (
                    <>
                      <Search className="mr-2 h-4 w-4 animate-spin" />
                      Researching...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Research
                    </>
                  )}
                </Button>
              </div>
            </div>

            {keywords.length > 0 && (
              <Tabs defaultValue="keywords" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="keywords">Keywords</TabsTrigger>
                  <TabsTrigger value="questions">Questions</TabsTrigger>
                  <TabsTrigger value="content">Content Ideas</TabsTrigger>
                </TabsList>

                <TabsContent value="keywords" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Keyword Suggestions</CardTitle>
                      <CardDescription>
                        {keywords.length} keyword{keywords.length !== 1 ? 's' : ''} found
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {keywords.map((kw, index) => (
                          <div key={index} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="font-semibold text-lg">{kw.keyword}</h3>
                              <Badge variant={
                                kw.intent === 'transactional' ? 'default' :
                                kw.intent === 'commercial' ? 'secondary' : 'outline'
                              }>
                                {kw.intent}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-3 gap-4 text-sm">
                              <div>
                                <span className="text-muted-foreground">Search Volume:</span>
                                <div className="font-semibold">{kw.searchVolume.toLocaleString()}/mo</div>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Difficulty:</span>
                                <div className="font-semibold">
                                  {kw.difficulty < 30 ? (
                                    <span className="text-green-500">Easy</span>
                                  ) : kw.difficulty < 60 ? (
                                    <span className="text-yellow-500">Medium</span>
                                  ) : (
                                    <span className="text-red-500">Hard</span>
                                  )}
                                </div>
                              </div>
                              <div>
                                <span className="text-muted-foreground">CPC:</span>
                                <div className="font-semibold">${kw.cpc.toFixed(2)}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="questions" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>People Also Ask</CardTitle>
                      <CardDescription>
                        Questions people search for about "{query}"
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-3">
                        {questions.map((q, index) => (
                          <div key={index} className="p-3 border rounded-lg flex items-start gap-2">
                            <HelpCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                              <p className="font-medium">{q.question}</p>
                              <Badge variant="outline" className="mt-1 text-xs">
                                {q.type}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-6 p-4 bg-muted rounded-lg">
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <Lightbulb className="h-4 w-4" />
                          Content Strategy
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Create blog posts or FAQ sections targeting these questions to rank in Position 1-3 for long-tail keywords.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="content" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Content Ideas</CardTitle>
                      <CardDescription>
                        Content suggestions based on keyword research
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="p-4 border rounded-lg">
                          <h4 className="font-semibold mb-2">Blog Post Ideas</h4>
                          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                            <li>Complete Guide to {query}</li>
                            <li>How to Get Started with {query} in 2025</li>
                            <li>Best {query} Tools and Resources</li>
                            <li>{query} vs Alternatives: Which is Better?</li>
                          </ul>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <h4 className="font-semibold mb-2">FAQ Section</h4>
                          <p className="text-sm text-muted-foreground mb-2">
                            Add these questions to your FAQ page:
                          </p>
                          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                            {questions.slice(0, 5).map((q, i) => (
                              <li key={i}>{q.question}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            )}

            {/* Free Tools Integration */}
            <Card className="mt-12">
              <CardHeader>
                <CardTitle>Free Keyword Research Tools</CardTitle>
                <CardDescription>Integrate these free tools for comprehensive keyword research</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <ExternalLink className="h-5 w-5" />
                      AnswerThePublic (Free Tier)
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Get questions, prepositions, and comparisons people search for. Free tier: 2 searches/day.
                    </p>
                    <Button variant="outline" size="sm" asChild>
                      <a href="https://answerthepublic.com" target="_blank" rel="noopener noreferrer">
                        Visit AnswerThePublic
                      </a>
                    </Button>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Google Keyword Planner
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Free search volume data. Create a Google Ads account (no ads needed) to access.
                    </p>
                    <Button variant="outline" size="sm" asChild>
                      <a href="https://ads.google.com/home/tools/keyword-planner/" target="_blank" rel="noopener noreferrer">
                        Visit Keyword Planner
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}



