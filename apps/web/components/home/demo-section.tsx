import { Plus, GripHorizontal, Search, Settings } from "lucide-react";

export function DemoSection() {
  return (
    <section className="py-12 md:py-16 px-6 relative bg-primary/5 dark:bg-primary/10 overflow-hidden">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-caveat font-bold text-foreground mb-3">
          See how your forms come alive
        </h2>
        <p className="text-base text-muted-foreground font-patrick-hand mb-10">
          A sneak peek into the Pratikriya experience.
        </p>

        <div className="relative glass-panel rounded-3xl p-4 md:p-6 border-4 border-foreground shadow-[6px_6px_0px_#2d2638] dark:shadow-[6px_6px_0px_#f5f3f7] rotate-1 max-w-3xl mx-auto z-10">
          <img src="https://api.dicebear.com/7.x/open-peeps/png?seed=Oliver&size=144" alt="Scribble Character" className="absolute -top-12 -right-8 hidden lg:block size-36 opacity-90 rotate-[15deg] pointer-events-none -z-10" />

          {/* Fake Window Header */}
          <div className="flex items-center gap-2 mb-4 border-b-2 border-foreground/20 pb-3">
            <div className="size-3 rounded-full bg-red-400 border border-black/20" />
            <div className="size-3 rounded-full bg-yellow-400 border border-black/20" />
            <div className="size-3 rounded-full bg-green-400 border border-black/20" />
            <div className="ml-4 font-geist-mono text-xs text-foreground/50">pratikriya.app/builder</div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 text-left h-auto md:h-[340px]">
            {/* Fake Sidebar */}
            <div className="w-full md:w-44 bg-white/50 dark:bg-black/50 rounded-xl p-3 border-2 border-foreground/20 flex flex-col sm:flex-row md:flex-col gap-3 md:gap-2 justify-between">
              <div className="h-8 rounded-lg bg-primary/20 flex items-center px-3 gap-2 shrink-0 sm:w-1/4 md:w-auto">
                <Search className="size-3.5" /> <div className="h-1.5 w-12 bg-foreground/20 rounded" />
              </div>
              <div className="flex flex-col sm:flex-row md:flex-col gap-2 flex-1">
                <div className="h-8 rounded-lg bg-white dark:bg-black border-2 border-foreground shadow-sm flex items-center px-3 text-[10px] font-bold gap-2 flex-1 md:flex-none">
                  <span className="text-primary font-bold">Aa</span> Short Text
                </div>
                <div className="h-8 rounded-lg bg-white/50 dark:bg-black/50 border border-dashed border-foreground/50 flex items-center px-3 text-[10px] gap-2 flex-1 md:flex-none">
                  <span className="text-accent">○</span> Multiple Choice
                </div>
                <div className="h-8 rounded-lg bg-white/50 dark:bg-black/50 border border-dashed border-foreground/50 flex items-center px-3 text-[10px] gap-2 flex-1 md:flex-none">
                  <span className="text-secondary">*</span> Rating
                </div>
              </div>
              <div className="h-8 rounded-lg bg-primary text-white flex items-center justify-center font-bold font-patrick-hand text-base hover:scale-105 transition-transform cursor-pointer shrink-0 px-4 sm:w-1/4 md:w-auto mt-0 sm:mt-0 md:mt-auto">
                <Plus className="size-4 mr-1.5" /> Publish
              </div>
            </div>

            {/* Fake Canvas */}
            <div className="flex-1 bg-slate-50 dark:bg-[#130f1d] rounded-xl p-4 border-2 border-foreground/20 overflow-hidden relative h-[260px] sm:h-auto">
              <div className="absolute top-3 right-3 text-foreground/30">
                <Settings className="size-4" />
              </div>
              <div className="max-w-md mx-auto space-y-4 pt-2">
                <div className="text-center space-y-1.5">
                  <div className="h-6 w-3/4 mx-auto bg-foreground/10 rounded-lg" />
                  <div className="h-3.5 w-1/2 mx-auto bg-foreground/5 rounded-lg" />
                </div>

                <div className="bg-white dark:bg-black p-3 rounded-xl border-2 border-foreground shadow-[3px_3px_0px_rgba(0,0,0,0.1)] group cursor-move relative">
                  <div className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <GripHorizontal className="size-3.5 text-foreground/40" />
                  </div>
                  <div className="ml-6 space-y-2">
                    <div className="h-3 w-1/3 bg-foreground/20 rounded" />
                    <div className="h-8 w-full bg-slate-50 dark:bg-[#1b1626] border-2 border-dashed border-foreground/20 rounded-lg" />
                  </div>
                </div>

                <div className="bg-white/50 dark:bg-black/50 p-3 rounded-xl border-2 border-dashed border-foreground/20">
                  <div className="ml-6 space-y-2">
                    <div className="h-3 w-1/2 bg-foreground/10 rounded" />
                    <div className="flex gap-2">
                      <div className="size-3 rounded-full border-2 border-foreground/20" />
                      <div className="h-3 w-1/4 bg-foreground/10 rounded" />
                    </div>
                    <div className="flex gap-2">
                      <div className="size-3 rounded-full border-2 border-foreground/20" />
                      <div className="h-3 w-1/3 bg-foreground/10 rounded" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
