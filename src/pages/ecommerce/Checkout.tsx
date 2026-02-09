import { useState } from "react";
import { CreditCard, Lock } from "lucide-react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import SEO from "../../components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { trackButtonClick, trackPurchase } from "@/utils/analytics";

export default function Checkout() {
  const [discount, setDiscount] = useState("");

  return (
    <>
      <SEO
        title="Secure Checkout - Complete Your Purchase | ContentAnonymity"
        description="Complete your purchase securely. 30-day money-back guarantee. Instant access to faceless content business resources, tools, and courses."
        keywords="checkout, purchase, payment, secure checkout, faceless content products"
        url="https://contentanonymity.com/checkout"
        canonical="https://contentanonymity.com/checkout"
        noindex={true}
      />
      <Header />
      <main className="py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-8 text-center">Checkout</h1>
          
          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="lg:col-span-2">
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="you@example.com" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="card">Card Number</Label>
                    <Input id="card" placeholder="1234 5678 9012 3456" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Expiry</Label>
                      <Input id="expiry" placeholder="MM/YY" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvc">CVC</Label>
                      <Input id="cvc" placeholder="123" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Lock className="h-4 w-4" />
                    <span>Secure 256-bit SSL encryption</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Faceless Automation Blueprint</span>
                    <span className="font-semibold">$197</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <Label htmlFor="discount">Discount Code</Label>
                    <div className="flex gap-2">
                      <Input
                        id="discount"
                        placeholder="Enter code"
                        value={discount}
                        onChange={(e) => setDiscount(e.target.value)}
                      />
                      <Button variant="outline">Apply</Button>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>$197</span>
                  </div>
                  
                  <Button 
                    size="lg" 
                    className="w-full"
                    onClick={() => {
                      trackButtonClick('complete-purchase', 'checkout');
                      // Track purchase event (adjust with actual transaction data)
                      trackPurchase(
                        `txn_${Date.now()}`,
                        197,
                        'USD',
                        [{ id: 'blueprint', name: 'Faceless Automation Blueprint', price: 197, quantity: 1 }]
                      );
                    }}
                  >
                    Complete Purchase
                  </Button>
                  
                  <p className="text-xs text-center text-muted-foreground">
                    30-day money-back guarantee
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}