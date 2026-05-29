import { Pencil, PaintBucket, Send, Inbox, PieChart } from "lucide-react";

export function TimelineSection() {
  const steps = [
    { icon: <Pencil className="size-5" />, title: "Create Form", desc: "Jot down your questions." },
    { icon: <PaintBucket className="size-5" />, title: "Customize Design", desc: "Add your unique colors and scribbles." },
    { icon: <Send className="size-5" />, title: "Share Link", desc: "Send it off like a paper airplane." },
    { icon: <Inbox className="size-5" />, title: "Collect Responses", desc: "Watch the mailbox fill up." },
    { icon: <PieChart className="size-5" />, title: "Analyze Insights", desc: "Understand your data with doodles." },
  ];

  return (
    <section id="timeline-section" className="py-12 md:py-16 px-6 relative bg-slate-50 dark:bg-[#130f1d] room-study-room bg-opacity-50">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-caveat font-bold text-foreground text-center mb-8 bg-white/80 dark:bg-black/80 inline-block px-6 py-1.5 rounded-full border-2 border-dashed border-foreground/50 shadow-sm transform -rotate-1 relative z-10">
          How it Works
        </h2>

        <img src="https://api.dicebear.com/7.x/open-peeps/png?seed=Sophie&size=192" alt="Scribble Character" className="absolute bottom-10 right-0 hidden lg:block size-48 opacity-80 pointer-events-none" />

        <div className="relative border-l-4 border-foreground ml-4 md:ml-8 space-y-8 pb-8">
          {steps.map((step, idx) => (
            <div key={idx} className="relative pl-8 md:pl-12">
              {/* Timeline Node */}
              <div className="absolute -left-[18px] top-1.5 size-8 rounded-full bg-white dark:bg-black border-4 border-foreground flex items-center justify-center shadow-sm">
                <span className="font-bold font-caveat text-sm">{idx + 1}</span>
              </div>

              {/* Doodle Arrow (except last) */}
              {idx < steps.length - 1 && (
                <div className="absolute -left-10 top-10 text-primary/30 rotate-90 scale-y-[-1] font-bold text-3xl hidden md:block">
                  &#10549;
                </div>
              )}

              {/* Content Card */}
              <div className="bg-white dark:bg-black p-4 rounded-lg border-2 border-foreground shadow-[3px_3px_0px_rgba(0,0,0,0.1)] relative" style={{ borderRadius: "2% 95% 4% 92% / 94% 4% 92% 5%"}}>
                <div className="absolute -top-2.5 right-6 w-10 h-5 bg-yellow-200/50 backdrop-blur-sm rotate-3 border border-black/10 shadow-sm" />
                
                <div className="flex items-center gap-4">
                  <div className="text-primary size-8 flex items-center justify-center">
                    {step.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold font-geist-sans">{step.title}</h3>
                    <p className="text-muted-foreground font-patrick-hand text-sm">{step.desc}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
