import { useParams, useNavigate } from "react-router-dom";
import { Filter } from "lucide-react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import SEO from "../../components/SEO";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const products = [
  {
    name: "Niche Research Template Pack",
    price: 27,
    category: "Templates",
    description: "10+ research templates to find profitable niches",
    popular: false
  },
  {
    name: "Faceless Automation Blueprint",
    price: 197,
    category: "Courses",
    description: "Complete course on building automated content systems",
    popular: true
  },
  {
    name: "Content Calendar System",
    price: 67,
    category: "Templates",
    description: "Pre-built content planning and scheduling system",
    popular: false
  }
];

export default function ProductListing() {
  const { category } = useParams();
  const navigate = useNavigate();

  const categoryName = category?.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase()) || 'All';
  const pageTitle = category && category !== 'all' 
    ? `${categoryName} Products - Digital Resources for Faceless Creators | ContentAnonymity`
    : 'Digital Products - Faceless Content Creator Resources | ContentAnonymity';
  const pageDescription = category && category !== 'all'
    ? `Browse premium ${categoryName.toLowerCase()} products for faceless content creators. Templates, courses, and tools to build your anonymous content empire.`
    : 'Discover premium digital products for faceless content creators. Templates, courses, automation tools, and resources to build your anonymous content business.';
  const canonicalUrl = category && category !== 'all'
    ? `https://contentanonymity.com/products/${category}`
    : 'https://contentanonymity.com/products/all';

  return (
    <>
      <SEO
        title={pageTitle}
        description={pageDescription}
        keywords={`${categoryName.toLowerCase()} products, faceless content products, digital products, anonymous creator resources, faceless business tools`}
        url={canonicalUrl}
        canonical={canonicalUrl}
        type="website"
      />
      <Header />
      <main className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                {category?.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())} Products
              </h1>
              <p className="text-muted-foreground">Premium resources for faceless creators</p>
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, index) => (
              <Card key={index} className="hover:border-primary transition-colors">
                {product.popular && (
                  <div className="absolute top-4 right-4">
                    <Badge>Bestseller</Badge>
                  </div>
                )}
                <CardHeader>
                  <Badge variant="secondary" className="w-fit mb-2">{product.category}</Badge>
                  <CardTitle>{product.name}</CardTitle>
                  <CardDescription>{product.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">${product.price}</div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full"
                    onClick={() => navigate(`/product/${product.name.toLowerCase().replace(/\s+/g, '-')}`)}
                  >
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}