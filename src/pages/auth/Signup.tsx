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
import { trackSignup, trackFormSubmit } from "@/utils/analytics";
import SEO from "@/components/SEO";

export default function Signup() {
  const navigate = useNavigate();
  const { signUp, signInWithGoogle } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
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
        // Validate email and password only
        const emailPasswordSchema = signupSchema.pick({ email: true, password: true });
        emailPasswordSchema.parse({
          email: formData.email,
          password: formData.password
        });
        
        // If validation passes, move to next step
        setStep(2);
      } else {
        // Name is optional - use pseudonym or generate one
        const creatorName = formData.name.trim() || `Creator_${Date.now().toString(36).substring(0, 8)}`;
        
        // Validate all fields (name is optional)
        const validated = signupSchema.parse({
          email: formData.email,
          password: formData.password,
          name: creatorName
        });
        
        // Track form submission
        trackFormSubmit('signup', 'signup-page');
        
        // Create user account with pseudonym
        const result = await signUp(validated.email, validated.password, validated.name);
        
        // Check result and handle accordingly
        if (result.error) {
          // Error already shown in toast by signUp function
          // Check if it's a validation error we should show in form
          if (result.error.message?.toLowerCase().includes('email') || 
              result.error.message?.toLowerCase().includes('user already registered')) {
            setErrors({ email: result.error.message });
          } else if (result.error.message?.toLowerCase().includes('password')) {
            setErrors({ password: result.error.message });
          }
          return; // Don't redirect on error
        }
        
        // Check if user was created or redirect (Auth0 handles session)
        if (result.user) {
          trackSignup('email');
          setTimeout(() => navigate('/dashboard'), 500);
        } else {
          // Redirect after sign up attempt (Auth0 may redirect)
          setTimeout(() => navigate('/auth/login?message=Please check your email to verify your account'), 2000);
        }
      }
    } catch (error: any) {
      if (error.errors) {
        // Zod validation errors
        const fieldErrors: Partial<SignupFormData> = {};
        error.errors.forEach((err: any) => {
          if (err.path && err.path.length > 0) {
            const fieldName = err.path[0] as keyof SignupFormData;
            fieldErrors[fieldName] = err.message;
          }
        });
        setErrors(fieldErrors);
      } else if (error.message) {
        // Other errors
        handleError(error, 'Failed to create account');
        // Try to extract field-specific errors
        if (error.message.toLowerCase().includes('email')) {
          setErrors({ email: error.message });
        } else if (error.message.toLowerCase().includes('password')) {
          setErrors({ password: error.message });
        }
      } else {
        handleError(error, 'Failed to create account');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO
        title="Create Anonymous Account - ContentAnonymity"
        description="Create your secure, faceless creator account. This signup page is private and not indexed by search engines."
        noindex
        canonical="https://contentanonymity.com/auth/signup"
      />
      <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center justify-center p-4 rounded-xl bg-white shadow-lg border-2 border-border/50 hover:shadow-xl hover:border-primary/30 transition-all">
              <img 
                src="/assets/logo.png" 
                alt="ContentAnonymity.com" 
                className="h-20 w-auto object-contain max-w-[300px] drop-shadow-md"
                style={{ imageRendering: 'crisp-edges' }}
              />
            </div>
          </div>
          <CardTitle>Create Your Anonymous Account</CardTitle>
          <CardDescription className="space-y-2">
            <div>Join 10,000+ faceless creators building profitable businesses</div>
            <div className="flex items-center gap-2 text-xs text-primary font-semibold mt-2">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>No real name required • VPN & Tor friendly</span>
            </div>
          </CardDescription>
          <Progress value={(step / 2) * 100} className="mt-4" />
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {step === 1 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address <span className="text-muted-foreground">(Private - Never Shared)</span></Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    aria-required="true"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    autoComplete="email"
                    className={errors.email ? "border-destructive" : ""}
                  />
                  {errors.email && (
                    <p className="text-xs text-destructive" role="alert" id="email-error">{errors.email}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    🔒 Your email is kept private and never displayed publicly. We only use it for account verification and important updates.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    autoComplete="new-password"
                    required
                    aria-required="true"
                    aria-invalid={!!errors.password}
                    aria-describedby={errors.password ? "password-error" : "password-help"}
                    className={errors.password ? "border-destructive" : ""}
                  />
                  {errors.password ? (
                    <p className="text-xs text-destructive" role="alert" id="password-error">{errors.password}</p>
                  ) : (
                    <p className="text-xs text-muted-foreground" id="password-help">Must be at least 8 characters</p>
                  )}
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name">Creator Name / Pseudonym <span className="text-primary font-semibold">(This is your public identity)</span></Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Anonymous Creator, Mystic Writer, etc."
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    autoComplete="name"
                    className={errors.name ? "border-destructive" : ""}
                  />
                  {errors.name && (
                    <p className="text-xs text-destructive">{errors.name}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    ✨ Use any name you want — your real name is never required. This will be your public creator identity.
                  </p>
                  <p className="text-xs text-primary font-medium mt-2">
                    💡 Tip: You can skip this and add it later from your profile settings.
                  </p>
                </div>
                <div className="mt-4 p-4 rounded-lg glass border border-primary/20 bg-primary/5">
                  <div className="flex items-start gap-2">
                    <svg className="h-5 w-5 text-primary shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="text-xs text-muted-foreground">
                      <strong className="text-foreground">Privacy First:</strong> We don't log IP addresses, support VPN/Tor usage, and your email stays private. Your pseudonym is your public identity — protect your real identity while building your brand.
                    </div>
                  </div>
                </div>
              </>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  {step === 2 ? "Create Anonymous Account" : "Continue"} <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6">
            <Separator className="mb-4" />
            <Button 
              variant="outline" 
              className="w-full"
              onClick={async () => {
                setGoogleLoading(true);
                trackFormSubmit('google-signup', 'signup-page');
                try {
                  const result = await signInWithGoogle();
                  if (!result.error) {
                    trackSignup('google');
                  }
                  if (result.error) {
                    // Error already shown in toast with helpful message
                    // If it's the "provider not enabled" error, show additional help
                    if (result.error.message?.includes('provider is not enabled') || 
                        result.error.message?.includes('Unsupported provider')) {
                      // Error message already shown in context
                    }
                  }
                  // If no error, OAuth redirect will happen automatically
                } catch (error: any) {
                  // Fallback error handling
                  handleError(error, 'Failed to sign in with Google');
                } finally {
                  setGoogleLoading(false);
                }
              }}
              disabled={googleLoading || loading}
            >
              {googleLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </>
              )}
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
    </>
  );
}
