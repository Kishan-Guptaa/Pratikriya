import { Check } from "lucide-react";
import { Button } from "~/components/ui/button";

export function PricingSection() {
  const plans = [
    {
      name: "Starter Room",
      price: "Free",
      desc: "Perfect for testing the waters.",
      features: ["Unlimited forms", "100 responses/mo", "Basic templates"],
      border: "border-primary",
      color: "bg-primary text-white",
      rotation: "rotate-1",
      popular: false
    },
    {
      name: "Creator Room",
      price: "$12",
      period: "/mo",
      desc: "Everything you need to build like a pro.",
      features: ["Unlimited responses", "Custom branding", "Advanced analytics", "Logic jumps"],
      border: "border-accent",
      color: "bg-accent text-white",
      rotation: "-rotate-1",
      popular: true
    },
    {
      name: "Master Room",
      price: "$39",
      period: "/mo",
      desc: "For serious form builders and teams.",
      features: ["Everything in Creator", "Team collaboration", "Priority support", "Custom integrations"],
      border: "border-foreground",
      color: "bg-foreground text-background",
      rotation: "rotate-2",
      popular: false
    }
  ];

  return (
    <section id="pricing" className="py-12 md:py-16 px-6 relative bg-background">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8 relative">
          <h2 className="text-3xl md:text-4xl font-caveat font-bold text-foreground">
            Simple Pricing
          </h2>
          <img src="https://api.dicebear.com/7.x/open-peeps/png?seed=George&size=128" alt="Scribble Character" className="absolute -top-16 right-1/4 hidden lg:block size-32 opacity-90 rotate-[15deg] pointer-events-none" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center max-w-4xl mx-auto">
          {plans.map((plan, idx) => (
            <div 
              key={idx} 
              className={`relative bg-white dark:bg-black p-5 rounded-[2rem] border-4 ${plan.border} shadow-[4px_4px_0px_#2d2638] dark:shadow-[4px_4px_0px_#f5f3f7] ${plan.rotation} transition-transform hover:scale-105 z-10 max-w-md mx-auto w-full ${plan.popular ? 'md:scale-105 z-20 md:-translate-y-4 shadow-[6px_6px_0px_#ff7ee2]' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-accent text-white px-3 py-0.5 rounded-full font-bold font-caveat text-lg border-2 border-foreground">
                  Most Loved
                </div>
              )}
              <h3 className="text-2xl font-bold font-geist-sans mb-2">{plan.name}</h3>
              <p className="text-muted-foreground font-patrick-hand mb-4 text-sm">{plan.desc}</p>
              <div className="mb-4">
                <span className="text-4xl font-black">{plan.price}</span>
                {plan.period && <span className="text-muted-foreground text-sm ml-1">{plan.period}</span>}
              </div>
              
              <ul className="space-y-2.5 mb-6 text-sm">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 font-medium">
                    <Check className={`size-4 shrink-0 ${plan.popular ? 'text-accent' : 'text-primary'}`} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                disabled={plan.price !== "Free"}
                className={`w-full h-10 rounded-xl text-base font-bold border-2 border-foreground shadow-[3px_3px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-0.5 hover:translate-x-0.5 transition-all ${plan.color} ${plan.price !== "Free" ? "opacity-70 cursor-not-allowed" : ""}`}
              >
                {plan.price === "Free" ? `Get Started` : "Coming Soon"}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
