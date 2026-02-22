import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  ArrowLeft,
  Check,
  Zap,
  Rocket,
  Infinity,
  CreditCard,
  Sparkles,
  Star
} from "lucide-react";

function Credits() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const creditPlans = [
    {
      id: "starter",
      name: "Starter",
      price: 5,
      credits: 1000,
      icon: Zap,
      color: "blue",
      popular: false,
      features: [
        "1,000 credits",
        "Basic contact management",
        "Tag organization",
        "Email support"
      ]
    },
    {
      id: "pro",
      name: "Pro",
      price: 10,
      credits: 2000,
      icon: Rocket,
      color: "purple",
      popular: true,
      features: [
        "2,000 credits",
        "Advanced analytics",
        "Priority support",
        "Bulk import/export"
      ]
    },
    {
      id: "unlimited",
      name: "Unlimited",
      price: 20,
      credits: "Unlimited",
      icon: Infinity,
      color: "amber",
      popular: false,
      features: [
        "Unlimited credits",
        "All Pro features",
        "API access",
        "Dedicated support"
      ]
    }
  ];

  const handlePlanSelect = (planId) => {
    setSelectedPlan(planId);
  };

  const handlePurchase = () => {
    if (!selectedPlan) {
      toast.warning("Please select a plan");
      return;
    }

    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      const plan = creditPlans.find(p => p.id === selectedPlan);
      toast.success(`Successfully purchased ${plan.name} plan!`);
      setIsProcessing(false);
      setSelectedPlan(null);
    }, 2000);
  };

  const getColorClasses = (color) => {
    const colors = {
      blue: {
        bg: "bg-blue-50",
        border: "border-blue-200",
        text: "text-blue-700",
        badge: "bg-blue-100 text-blue-700",
        button: "bg-blue-600 hover:bg-blue-700",
        icon: "text-blue-600"
      },
      purple: {
        bg: "bg-purple-50",
        border: "border-purple-200",
        text: "text-purple-700",
        badge: "bg-purple-100 text-purple-700",
        button: "bg-purple-600 hover:bg-purple-700",
        icon: "text-purple-600"
      },
      amber: {
        bg: "bg-amber-50",
        border: "border-amber-200",
        text: "text-amber-700",
        badge: "bg-amber-100 text-amber-700",
        button: "bg-amber-600 hover:bg-amber-700",
        icon: "text-amber-600"
      }
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
            {/*
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          */}
          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center justify-center p-2 bg-indigo-100 rounded-full mb-4">
              <Sparkles className="w-6 h-6 text-indigo-600" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-3">
              Upgrade Your Plan
            </h1>
            <p className="text-lg text-muted-foreground">
              Choose the plan that fits your needs. Get more credits to unlock powerful features.
            </p>
          </div>
        </div>

        {/* Credits Display */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-muted px-4 py-2 rounded-full">
            <CreditCard className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Current Credits: <span className="font-semibold text-foreground">150</span>
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {creditPlans.map((plan) => {
            const colors = getColorClasses(plan.color);
            const Icon = plan.icon;
            const isSelected = selectedPlan === plan.id;

            return (
              <Card
                key={plan.id}
                className={`relative overflow-hidden transition-all duration-200 ${
                  isSelected ? 'ring-2 ring-offset-2 ring-indigo-500' : ''
                } ${plan.popular ? 'scale-105 md:scale-110 z-10' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0">
                    <Badge className="rounded-none rounded-bl-lg rounded-tr-lg px-3 py-1 bg-indigo-600 text-white border-0">
                      <Star className="w-3 h-3 mr-1 inline" />
                      Most Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className={`${colors.bg} border-b ${colors.border}`}>
                  <div className="flex items-center justify-between">
                    <div className={`p-2 rounded-lg ${colors.bg}`}>
                      <Icon className={`w-6 h-6 ${colors.icon}`} />
                    </div>
                    <span className={`text-sm font-medium px-3 py-1 rounded-full ${colors.badge}`}>
                      {plan.name}
                    </span>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-foreground">${plan.price}</span>
                      <span className="text-muted-foreground">/one-time</span>
                    </div>
                    <p className="text-2xl font-semibold text-foreground mt-2">
                      {plan.credits} {typeof plan.credits === 'number' ? 'credits' : ''}
                    </p>
                  </div>
                </CardHeader>

                <CardContent className="pt-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter>
                  <Button
                    onClick={() => handlePlanSelect(plan.id)}
                    variant={isSelected ? "default" : "outline"}
                    className={`w-full ${
                      isSelected 
                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white' 
                        : `hover:${colors.button} hover:text-white`
                    }`}
                  >
                    {isSelected ? 'Selected' : `Get ${plan.name}`}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {/* Plan Details Note */}
        <div className="mt-10 text-center">
          <div className="inline-flex items-center gap-2 bg-muted/50 px-6 py-3 rounded-lg">
            <Infinity className="w-5 h-5 text-indigo-600" />
            <p className="text-muted-foreground">
              <span className="font-medium text-foreground">All plans are one-time purchases.</span> Credits never expire.
            </p>
          </div>
        </div>

        {/* Purchase Button (shows when plan selected) */}
        {selectedPlan && (
          <div className="fixed bottom-8 left-0 right-0 flex justify-center pointer-events-none">
            <Card className="shadow-lg border-indigo-200 pointer-events-auto max-w-md mx-auto">
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground">Selected Plan</p>
                    <p className="font-semibold text-foreground">
                      {creditPlans.find(p => p.id === selectedPlan)?.name} - $
                      {creditPlans.find(p => p.id === selectedPlan)?.price}
                    </p>
                  </div>
                  <Button
                    onClick={handlePurchase}
                    disabled={isProcessing}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[120px]"
                  >
                    {isProcessing ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Processing...
                      </div>
                    ) : (
                      'Complete Purchase'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* FAQ or Additional Info */}
        <div className="mt-16 text-center">
          <h2 className="text-xl font-semibold text-foreground mb-4">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto text-left">
            <div>
              <h3 className="font-medium text-foreground mb-2">Do credits expire?</h3>
              <p className="text-sm text-muted-foreground">
                No, credits never expire. Use them anytime you need.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-foreground mb-2">How do I use credits?</h3>
              <p className="text-sm text-muted-foreground">
                Each contact you add costs 1 credit. You can track your usage in the dashboard.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-foreground mb-2">Can I upgrade later?</h3>
              <p className="text-sm text-muted-foreground">
                Yes, you can purchase any plan at any time. Additional credits will be added to your balance.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-foreground mb-2">What payment methods?</h3>
              <p className="text-sm text-muted-foreground">
                We accept all major credit cards and PayPal for easy payment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Credits;