import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Sparkles, Send, Cloud, MousePointer2 } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-[75vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden room-living-room py-12">
      {/* Doodle Decorations */}
      <div className="absolute top-10 left-10 text-primary/40 animate-pulse">
        <Cloud className="size-16" strokeWidth={1} />
      </div>
      <div className="absolute top-20 right-10 text-accent/40 animate-pulse delay-700">
        <Cloud className="size-20" strokeWidth={1} />
      </div>
      <div className="absolute bottom-20 left-1/4 text-secondary/60">
        <Send className="size-8 rotate-[-20deg]" />
      </div>
      <div className="absolute top-1/4 right-1/4 text-primary/60">
        <Sparkles className="size-6" />
      </div>
      
      {/* Floating Elements (Paper airplane, pencil doodle) */}
      <div className="absolute top-1/4 left-1/3 w-24 h-24 border-2 border-dashed border-primary/20 rounded-full animate-[spin_10s_linear_infinite]" />
      
      {/* Scribble Character */}
      <img src="https://api.dicebear.com/7.x/open-peeps/png?seed=Mimi&flip=true&size=192" alt="Scribble Character" className="absolute bottom-[-10px] right-[-10px] md:right-[-20px] size-36 md:size-48 opacity-60 animate-in slide-in-from-right duration-1000 z-0 pointer-events-none" />
      
      <div className="relative z-10 max-w-3xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/80 dark:bg-black/80 border-2 border-primary/50 text-primary font-bold shadow-[3px_3px_0px_#7b61ff] -rotate-1 text-sm">
          <Sparkles className="size-4" />
          <span>The easiest way to collect responses</span>
        </div>
        
        <h1 className="text-5xl md:text-6xl font-black tracking-tight text-foreground font-caveat leading-[1.1]">
          Create Forms That <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-secondary">Feel Fun</span>
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground font-patrick-hand max-w-xl mx-auto leading-relaxed">
          Not boring forms. Create playful, interactive experiences that your users will actually enjoy filling out.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild size="lg" className="rounded-2xl px-8 h-12 text-base font-bold bg-primary hover:bg-primary/90 text-white shadow-[4px_4px_0px_#b56cff] hover:shadow-[2px_2px_0px_#b56cff] hover:translate-y-0.5 hover:translate-x-0.5 transition-all">
            <Link href="/signup">
              Start Creating
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-2xl px-8 h-12 text-base font-bold border-2 border-foreground bg-white dark:bg-black shadow-[4px_4px_0px_#2d2638] dark:shadow-[4px_4px_0px_#f5f3f7] hover:shadow-[2px_2px_0px_#2d2638] dark:hover:shadow-[2px_2px_0px_#f5f3f7] hover:translate-y-0.5 hover:translate-x-0.5 transition-all text-foreground hover:bg-white dark:hover:bg-black hover:text-foreground">
            <Link href="#templates">
              Explore Templates
            </Link>
          </Button>
        </div>
      </div>
      
      {/* Hand drawn arrow pointing down */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-foreground/50">
        <MousePointer2 className="size-8 rotate-180" strokeWidth={1.5} />
      </div>
    </section>
  );
}
