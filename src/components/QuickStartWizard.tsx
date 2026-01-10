import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X, CheckCircle2, ArrowRight, FileText, Image as ImageIcon, Zap, Rocket, Clock, Sparkles } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";

interface QuickStartStep {
  id: number;
  title: string;
  description: string;
  icon: any;
  estimatedTime: string;
  action?: () => void;
  completed: boolean;
  skippable?: boolean;
}

export default function QuickStartWizard({ open, onComplete }: { open: boolean; onComplete: () => void }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [startTime] = useState(Date.now());
  const [steps, setSteps] = useState<QuickStartStep[]>([
    {
      id: 1,
      title: "Set Your Creator Profile",
      description: "Choose your pseudonym and profile settings (30 seconds)",
      icon: Sparkles,
      estimatedTime: "30s",
      completed: false,
      action: () => navigate('/dashboard/profile'),
      skippable: true
    },
    {
      id: 2,
      title: "Create Your First Post",
      description: "Publish your first piece of content (2-3 minutes)",
      icon: FileText,
      estimatedTime: "2-3 min",
      completed: false,
      action: () => navigate('/dashboard/content-creation?new=true'),
      skippable: false
    },
    {
      id: 3,
      title: "Set Up Your First Email Newsletter",
      description: "Build your subscriber list (1 minute)",
      icon: Zap,
      estimatedTime: "1 min",
      completed: false,
      action: () => navigate('/dashboard/newsletter?setup=true'),
      skippable: true
    },
    {
      id: 4,
      title: "Choose Your Monetization Plan",
      description: "Set up subscription tiers or pricing (1 minute)",
      icon: Rocket,
      estimatedTime: "1 min",
      completed: false,
      action: () => navigate('/dashboard/monetization'),
      skippable: true
    }
  ]);

  const handleStepComplete = (stepId: number) => {
    setSteps(prev => prev.map(step => 
      step.id === stepId ? { ...step, completed: true } : step
    ));
    
    // Auto-advance to next step
    const currentIndex = steps.findIndex(s => s.id === stepId);
    if (currentIndex < steps.length - 1) {
      setTimeout(() => setCurrentStep(currentIndex + 1), 500);
    } else {
      // All steps complete
      const totalTime = Math.round((Date.now() - startTime) / 1000);
      handleComplete(totalTime);
    }
  };

  const handleSkip = (stepId: number) => {
    const step = steps.find(s => s.id === stepId);
    if (step?.skippable) {
      handleStepComplete(stepId);
    }
  };

  const handleComplete = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const timeString = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
    
    // Show completion message
    setTimeout(() => {
      onComplete();
      navigate('/dashboard?quickstart=complete&time=' + timeString);
    }, 1000);
  };

  const completedCount = steps.filter(s => s.completed).length;
  const progress = (completedCount / steps.length) * 100;
  const currentStepData = steps[currentStep];

  if (!currentStepData) return null;

  const Icon = currentStepData.icon;

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="py-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <Badge variant="secondary" className="mb-2">
                Quick Start: Step {currentStep + 1} of {steps.length}
              </Badge>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Estimated: {steps.reduce((acc, s) => acc + parseInt(s.estimatedTime), 0)} minutes total</span>
              </div>
            </div>
            <button 
              onClick={onComplete} 
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>{completedCount} of {steps.length} completed</span>
              <span>{Math.round(progress)}% complete</span>
            </div>
          </div>

          {/* Current Step */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl gradient-primary mb-4 shadow-glow animate-scale-in">
              <Icon className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2 gradient-text">
              {currentStepData.title}
            </h2>
            <p className="text-muted-foreground mb-4">{currentStepData.description}</p>
            <Badge variant="outline" className="gap-1">
              <Clock className="h-3 w-3" />
              {currentStepData.estimatedTime}
            </Badge>
          </div>

          {/* Step Content */}
          <Card className="mb-6">
            <CardContent className="p-6">
              {currentStepData.id === 1 && (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Set up your public creator identity. Remember: <strong>your real name is never required.</strong> Use a pseudonym that represents your brand.
                  </p>
                  <div className="flex items-start gap-3 p-4 rounded-lg glass border border-primary/20 bg-primary/5">
                    <Sparkles className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div className="text-sm text-muted-foreground">
                      <strong className="text-foreground">Pro Tip:</strong> Choose a memorable pseudonym that matches your niche. You can always change it later, but consistency helps build your brand.
                    </div>
                  </div>
                </div>
              )}

              {currentStepData.id === 2 && (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Create and publish your first piece of content. We've pre-populated a template to help you get started quickly.
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <Card className="border-primary/20 bg-primary/5">
                      <CardContent className="p-4 text-center">
                        <FileText className="h-8 w-8 mx-auto mb-2 text-primary" />
                        <p className="text-sm font-semibold">Blog Post</p>
                        <p className="text-xs text-muted-foreground mt-1">Quick start template</p>
                      </CardContent>
                    </Card>
                    <Card className="border-primary/20 bg-primary/5">
                      <CardContent className="p-4 text-center">
                        <ImageIcon className="h-8 w-8 mx-auto mb-2 text-primary" />
                        <p className="text-sm font-semibold">With Images</p>
                        <p className="text-xs text-muted-foreground mt-1">Rich media content</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {currentStepData.id === 3 && (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Build your email list to grow your audience. Set up your first newsletter campaign or automatic email notifications for new posts.
                  </p>
                  <div className="p-4 rounded-lg glass border border-primary/20">
                    <div className="flex items-start gap-3">
                      <Zap className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <div className="text-sm text-muted-foreground">
                        <strong className="text-foreground">Automatic Setup Available:</strong> Enable "Email subscribers when I publish" to automatically notify your audience of new content.
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentStepData.id === 4 && (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Monetize your content with subscription tiers or one-time payments. Choose your pricing strategy.
                  </p>
                  <div className="space-y-2">
                    <Card className="border-primary/20 hover:border-primary/40 transition-colors cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold">Subscription Tiers</p>
                            <p className="text-xs text-muted-foreground">Monthly recurring revenue</p>
                          </div>
                          <Badge>Recommended</Badge>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="border-primary/20 hover:border-primary/40 transition-colors cursor-pointer">
                      <CardContent className="p-4">
                        <div>
                          <p className="font-semibold">One-Time Payments</p>
                          <p className="text-xs text-muted-foreground">Tips, donations, pay-per-view</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3">
            {currentStepData.skippable && (
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => handleSkip(currentStepData.id)}
              >
                Skip for Now
              </Button>
            )}
            <Button
              className={`${currentStepData.skippable ? 'flex-1' : 'w-full'} gradient-primary hover:shadow-glow`}
              onClick={() => {
                if (currentStepData.action) {
                  currentStepData.action();
                  // Mark as completed after navigation
                  setTimeout(() => handleStepComplete(currentStepData.id), 500);
                } else {
                  handleStepComplete(currentStepData.id);
                }
              }}
            >
              {currentStepData.id === steps.length ? 'Complete Setup' : 'Continue'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {/* Completed Steps Indicator */}
          {completedCount > 0 && (
            <div className="mt-6 pt-6 border-t">
              <p className="text-sm font-semibold mb-3">Completed Steps:</p>
              <div className="flex flex-wrap gap-2">
                {steps.filter(s => s.completed).map(step => (
                  <Badge key={step.id} variant="outline" className="gap-1">
                    <CheckCircle2 className="h-3 w-3 text-green-500" />
                    {step.title}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

