import { useState } from "react";
import { X, CheckCircle2, Rocket, Target, Zap } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const steps = [
  {
    icon: Target,
    title: "Choose Your Goal",
    description: "What do you want to achieve?",
    options: ["Build YouTube Channel", "Create Digital Products", "Start Blog", "Affiliate Marketing"]
  },
  {
    icon: Zap,
    title: "Select Your Niche",
    description: "What interests you most?",
    options: ["Finance", "Tech & AI", "Lifestyle", "Business", "Health & Fitness"]
  },
  {
    icon: Rocket,
    title: "You're All Set!",
    description: "Here's your personalized roadmap"
  }
];

export default function OnboardingModal({ open, onComplete }: { open: boolean; onComplete: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState<string[]>([]);

  const handleSelect = (option: string) => {
    const newSelections = [...selections];
    newSelections[currentStep] = option;
    setSelections(newSelections);
    
    if (currentStep < steps.length - 1) {
      setTimeout(() => setCurrentStep(currentStep + 1), 300);
    }
  };

  const step = steps[currentStep];
  const Icon = step.icon;

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-2xl">
        <div className="py-6">
          <div className="flex items-center justify-between mb-6">
            <Badge variant="secondary">Step {currentStep + 1} of {steps.length}</Badge>
            {currentStep === steps.length - 1 && (
              <button onClick={onComplete} className="text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-4">
              <Icon className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-2">{step.title}</h2>
            <p className="text-muted-foreground">{step.description}</p>
          </div>

          {currentStep < steps.length - 1 ? (
            <div className="grid grid-cols-2 gap-3">
              {step.options?.map((option) => (
                <Card
                  key={option}
                  className={`cursor-pointer transition-all hover:border-primary ${
                    selections[currentStep] === option ? 'border-primary bg-primary/5' : ''
                  }`}
                  onClick={() => handleSelect(option)}
                >
                  <CardContent className="p-4 text-center">
                    <p className="font-medium">{option}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <Card className="bg-muted/50">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold mb-1">Your Goal: {selections[0]}</p>
                      <p className="text-sm text-muted-foreground">We've customized your dashboard</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold mb-1">Your Niche: {selections[1]}</p>
                      <p className="text-sm text-muted-foreground">Recommended courses are ready</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Button size="lg" className="w-full" onClick={onComplete}>
                Go to Dashboard
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
