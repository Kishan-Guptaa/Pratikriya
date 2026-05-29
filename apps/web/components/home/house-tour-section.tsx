import { ArrowRight, LayoutDashboard, FormInput, Library, Inbox, BarChart, CheckCircle2 } from "lucide-react";
import { cn } from "~/lib/utils";

const journeySteps = [
  {
    icon: <LayoutDashboard className="size-6" />,
    title: "Centralized Workspace",
    desc: "Your command center. Manage all your forms and workspaces in one place.",
    color: "text-primary"
  },
  {
    icon: <FormInput className="size-6" />,
    title: "Intuitive Builder",
    desc: "Design the perfect questions. Drag, drop, and publish in seconds.",
    color: "text-accent"
  },
  {
    icon: <Library className="size-6" />,
    title: "Smart Templates",
    desc: "Need inspiration? Start instantly with our pre-built template library.",
    color: "text-secondary"
  },
  {
    icon: <Inbox className="size-6" />,
    title: "Real-time Responses",
    desc: "Collect answers securely. View submissions as soon as they happen.",
    color: "text-blue-500"
  },
  {
    icon: <BarChart className="size-6" />,
    title: "Advanced Analytics",
    desc: "Visualize your data with powerful built-in charts and insights.",
    color: "text-green-500"
  }
];

export function HouseTourSection() {
  return (
    <section className="py-16 md:py-20 px-6 relative overflow-hidden bg-slate-50 dark:bg-[#130f1d]">
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-caveat font-bold text-foreground mb-3">
            The Pratikriya Workflow
          </h2>
          <p className="text-base text-muted-foreground font-patrick-hand">
            See how our platform works, step by step.
          </p>
          <img src="https://api.dicebear.com/7.x/open-peeps/png?seed=Mason&size=128" alt="Scribble Character" className="absolute -top-10 right-10 hidden lg:block size-32 opacity-50 pointer-events-none" />
        </div>

        <div className="relative">
          {/* Dashed doodle path (vertical line for simplicity on web, hidden on mobile) */}
          <div className="absolute left-1/2 top-0 bottom-0 w-1 border-l-4 border-dashed border-primary/30 -translate-x-1/2 hidden md:block" />

          <div className="space-y-8">
            {journeySteps.map((step, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <div key={idx} className={cn("relative flex items-center gap-6 md:gap-12", isEven ? "flex-col md:flex-row" : "flex-col md:flex-row-reverse")}>
                  {/* Timeline Dot */}
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-8 bg-white dark:bg-black border-2 border-foreground rounded-full hidden md:flex items-center justify-center z-10 shadow-[2px_2px_0px_#2d2638] dark:shadow-[2px_2px_0px_#f5f3f7]">
                    <span className="font-caveat font-bold text-base">{idx + 1}</span>
                  </div>

                  {/* Card Content */}
                  <div className="w-full md:w-1/2 flex justify-center">
                    <div className={cn(
                      "w-full max-w-sm rounded-3xl p-4 border-2 border-foreground shadow-[4px_4px_0px_#2d2638] dark:shadow-[4px_4px_0px_#f5f3f7] transition-transform hover:-translate-y-1 hover:rotate-1 bg-white dark:bg-black"
                    )}>
                      <div className="text-center space-y-3">
                        <div className="relative inline-block mx-auto">
                          <div className={cn("mx-auto size-12 rounded-full bg-slate-50 dark:bg-slate-900 border-2 border-foreground flex items-center justify-center", step.color)}>
                            {step.icon}
                          </div>
                          {/* Mobile-visible step number badge */}
                          <div className="absolute -top-1 -right-1 size-5 bg-primary text-white text-[10px] font-bold rounded-full border border-foreground flex items-center justify-center md:hidden shadow-sm">
                            {idx + 1}
                          </div>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold font-geist-sans mb-1">{step.title}</h3>
                          <p className="text-xs font-medium text-muted-foreground">{step.desc}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="hidden md:block w-1/2" />
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
