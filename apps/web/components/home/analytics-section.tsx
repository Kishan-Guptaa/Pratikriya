import { BarChart3, PieChart, Users } from "lucide-react";

export function AnalyticsSection() {
  return (
    <section className="py-24 px-6 relative bg-slate-50 dark:bg-[#130f1d] room-backyard bg-opacity-40">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-caveat font-bold text-foreground">
            Doodle Your Data
          </h2>
          <p className="text-xl text-muted-foreground font-patrick-hand mt-4">
            Analytics doesn't have to be boring.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Stat 1 */}
          <div className="glass-panel p-8 rounded-3xl border-4 border-foreground shadow-[8px_8px_0px_#2d2638] dark:shadow-[8px_8px_0px_#f5f3f7] flex flex-col items-center justify-center text-center rotate-1 hover:-rotate-1 transition-transform">
            <div className="size-20 rounded-full border-4 border-primary border-dashed flex items-center justify-center mb-4 text-primary animate-[spin_10s_linear_infinite]">
              <Users className="size-8 animate-[spin_10s_linear_infinite_reverse]" />
            </div>
            <h3 className="text-4xl font-black font-geist-sans mb-2">2.4M</h3>
            <p className="font-patrick-hand text-xl text-muted-foreground">Responses Collected</p>
          </div>

          {/* Stat 2 */}
          <div className="glass-panel p-8 rounded-3xl border-4 border-foreground shadow-[8px_8px_0px_#2d2638] dark:shadow-[8px_8px_0px_#f5f3f7] flex flex-col items-center justify-center text-center -rotate-2 hover:rotate-2 transition-transform">
            <div className="relative size-20 mb-4 flex items-center justify-center">
               <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full text-accent -rotate-90">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="12" strokeDasharray="180 251.2" strokeLinecap="round" className="opacity-80" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke="var(--color-secondary)" strokeWidth="12" strokeDasharray="70 251.2" strokeDashoffset="-180" strokeLinecap="round" />
               </svg>
               <PieChart className="size-6 text-foreground z-10" />
            </div>
            <h3 className="text-4xl font-black font-geist-sans mb-2">12K</h3>
            <p className="font-patrick-hand text-xl text-muted-foreground">Forms Created</p>
          </div>

          {/* Stat 3 */}
          <div className="glass-panel p-8 rounded-3xl border-4 border-foreground shadow-[8px_8px_0px_#2d2638] dark:shadow-[8px_8px_0px_#f5f3f7] flex flex-col items-center justify-center text-center rotate-2 hover:-rotate-2 transition-transform">
            <div className="flex items-end gap-2 h-20 mb-4 text-secondary border-b-4 border-l-4 border-foreground p-2 rounded-bl-xl">
              <div className="w-4 bg-secondary h-8 rounded-t-sm animate-pulse" />
              <div className="w-4 bg-primary h-12 rounded-t-sm animate-pulse delay-75" />
              <div className="w-4 bg-accent h-16 rounded-t-sm animate-pulse delay-150" />
              <div className="w-4 bg-green-400 h-10 rounded-t-sm animate-pulse delay-300" />
            </div>
            <h3 className="text-4xl font-black font-geist-sans mb-2">99%</h3>
            <p className="font-patrick-hand text-xl text-muted-foreground">Completion Rate</p>
          </div>
        </div>
      </div>
    </section>
  );
}
