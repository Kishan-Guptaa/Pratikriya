import { Sparkles, Move, LineChart, Inbox, Smartphone, ClipboardList } from "lucide-react";

export function WhySection() {
  const cards = [
    { icon: <Sparkles className="size-5" />, title: "Beautiful Cartoon UI", desc: "Forms that look hand-drawn and feel incredibly playful.", color: "bg-yellow-100 dark:bg-yellow-900/30", rotation: "-rotate-2" },
    { icon: <Move className="size-5" />, title: "Easy Drag & Drop", desc: "Build forms intuitively without writing a single line of code.", color: "bg-pink-100 dark:bg-pink-900/30", rotation: "rotate-3" },
    { icon: <LineChart className="size-5" />, title: "Smart Analytics", desc: "Understand your audience with beautifully drawn charts.", color: "bg-blue-100 dark:bg-blue-900/30", rotation: "-rotate-1" },
    { icon: <Inbox className="size-5" />, title: "Real-Time Responses", desc: "Get notified instantly when someone drops an answer in the mailbox.", color: "bg-green-100 dark:bg-green-900/30", rotation: "rotate-2" },
    { icon: <Smartphone className="size-5" />, title: "Mobile Friendly", desc: "Looks amazing on every device, from massive monitors to tiny phones.", color: "bg-purple-100 dark:bg-purple-900/30", rotation: "-rotate-3" },
    { icon: <ClipboardList className="size-5" />, title: "Instant Blueprints", desc: "Bootstrap your workspace with pre-configured form templates.", color: "bg-orange-100 dark:bg-orange-900/30", rotation: "rotate-1" },
  ];

  return (
    <section id="features" className="py-12 md:py-16 px-6 relative bg-background scribble-bg">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-caveat font-bold text-foreground mb-8">
          Why Pratikriya?
        </h2>
        
        <img src="https://api.dicebear.com/7.x/open-peeps/png?seed=Jack&size=192" alt="Scribble Character" className="absolute -top-10 left-5 hidden lg:block size-48 opacity-80 rotate-[-10deg] pointer-events-none" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {cards.map((card, idx) => (
            <div 
              key={idx} 
              className={`relative p-5 rounded-lg border-2 border-dashed border-foreground/50 shadow-[4px_4px_0px_rgba(0,0,0,0.1)] transition-transform hover:scale-105 ${card.color} ${card.rotation}`}
              style={{
                borderRadius: "255px 15px 225px 15px/15px 225px 15px 255px" // Pencil border sketch effect
              }}
            >
              {/* Tape sticker */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-6 bg-white/40 backdrop-blur-sm rotate-[-5deg] border border-black/10 shadow-sm" />
              
              <div className="size-10 rounded-full bg-white dark:bg-black border-2 border-foreground flex items-center justify-center mx-auto mb-3 text-foreground shadow-sm">
                {card.icon}
              </div>
              <h3 className="text-xl font-bold font-geist-sans mb-2 text-foreground">{card.title}</h3>
              <p className="text-foreground/80 font-patrick-hand text-base leading-relaxed">
                {card.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
