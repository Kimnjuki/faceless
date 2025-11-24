import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { signupSchema, type SignupFormData } from "@/lib/validations";
import { handleError } from "@/lib/error-handler";

export default function Signup() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: ""
  });
  const [errors, setErrors] = useState<Partial<SignupFormData>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      if (step < 2) {
        // Validate email and password
        const validated = signupSchema.parse({
          email: formData.email,
          password: formData.password,
          name: formData.name
        });
        setStep(step + 1);
      } else {
        // Validate all fields
        const validated = signupSchema.parse({
          email: formData.email,
          password: formData.password,
          name: formData.name
        });
        
        // Create user account
        await signUp(validated.email, validated.password, validated.name);
        
        // Redirect to dashboard
        navigate('/dashboard');
      }
    } catch (error: any) {
      if (error.errors) {
        // Zod validation errors
        const fieldErrors: Partial<SignupFormData> = {};
        error.errors.forEach((err: any) => {
          if (err.path) {
            fieldErrors[err.path[0] as keyof SignupFormData] = err.message;
          }
        });
        setErrors(fieldErrors);
      } else {
        handleError(error, 'Failed to create account');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-2 mb-4">
            <div className="h-8 w-8 rounded-lg bg-primary" />
            <span className="font-bold text-xl">FSH</span>
          </div>
          <CardTitle>Create Your Account</CardTitle>
          <CardDescription>Join 10,000+ faceless creators building profitable businesses</CardDescription>
          <Progress value={(step / 2) * 100} className="mt-4" />
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {step === 1 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className={errors.email ? "border-destructive" : ""}
                  />
                  {errors.email && (
                    <p className="text-xs text-destructive">{errors.email}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    className={errors.password ? "border-destructive" : ""}
                  />
                  {errors.password ? (
                    <p className="text-xs text-destructive">{errors.password}</p>
                  ) : (
                    <p className="text-xs text-muted-foreground">Must be at least 8 characters</p>
                  )}
                </div>
              </>
            )}

            {step === 2 && (
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className={errors.name ? "border-destructive" : ""}
                />
                {errors.name && (
                  <p className="text-xs text-destructive">{errors.name}</p>
                )}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  {step === 2 ? "Create Account" : "Continue"} <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6">
            <Separator className="mb-4" />
            <Button variant="outline" className="w-full">
              Continue with Google
            </Button>
          </div>

          <div className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/auth/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
