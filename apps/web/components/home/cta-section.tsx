import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Star, Send, PartyPopper } from "lucide-react";

export function CtaSection() {
  return (
    <section className="relative py-16 md:py-20 px-6 room-rooftop-party text-white overflow-hidden flex flex-col items-center justify-center text-center">
      {/* Stars and decorations */}
      <div className="absolute inset-0 bg-black/40 pointer-events-none" />
      <Star className="absolute top-10 left-1/4 text-yellow-300 animate-pulse size-5" />
      <Star className="absolute top-20 right-1/4 text-yellow-200 animate-pulse delay-300 size-3" />
      <Star className="absolute bottom-10 left-1/3 text-yellow-400 animate-pulse delay-700 size-6" />
      
      {/* Floating Paper Airplane */}
      <div className="absolute top-1/2 left-10 text-white/50 animate-bounce">
        <Send className="size-8 rotate-45" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto">
        <div className="inline-flex items-center justify-center size-14 rounded-full bg-white/10 backdrop-blur-md border-2 border-white/20 mb-4">
          <PartyPopper className="size-7 text-yellow-300" />
        </div>
        
        <h2 className="text-3xl md:text-4xl font-caveat font-bold mb-3 leading-tight">
          Ready to create forms differently?
        </h2>
        
        <p className="text-base text-white/80 font-patrick-hand mb-8 max-w-xl mx-auto">
          Join thousands of others making forms fun again. It takes less than a minute to get started.
        </p>
        
        <Button asChild size="lg" className="rounded-full px-8 h-12 text-base font-bold bg-white text-black hover:bg-white/90 shadow-[4px_4px_0px_rgba(255,255,255,0.3)] hover:shadow-none hover:translate-y-0.5 hover:translate-x-0.5 transition-all">
          <Link href="/signup">
            Enter Pratikriya
          </Link>
        </Button>
      </div>
    </section>
  );
}
