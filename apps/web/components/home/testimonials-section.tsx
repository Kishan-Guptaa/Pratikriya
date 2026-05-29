import { Heart } from "lucide-react";

export function TestimonialsSection() {
  const testimonials = [
    { text: "Pratikriya made form creation feel like fun!", author: "Rahul", type: "polaroid", rotation: "-rotate-3", avatar: "https://api.dicebear.com/7.x/open-peeps/png?seed=Rahul&size=64" },
    { text: "Finally, a form builder that doesn't put me to sleep.", author: "Sneha", type: "sticky", color: "bg-yellow-200", rotation: "rotate-2", avatar: "https://api.dicebear.com/7.x/open-peeps/png?seed=Sneha&size=64" },
    { text: "My users actually enjoy filling these out. Mind blown", author: "Amit", type: "polaroid", rotation: "rotate-1", avatar: "https://api.dicebear.com/7.x/open-peeps/png?seed=Amit&size=64" },
    { text: "It's like doodling on a notepad, but it actually works.", author: "Priya", type: "sticky", color: "bg-pink-200", rotation: "-rotate-2", avatar: "https://api.dicebear.com/7.x/open-peeps/png?seed=Priya&size=64" },
  ];

  return (
    <section className="py-12 md:py-16 px-6 relative bg-background overflow-hidden">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 relative">
          <Heart className="absolute -top-5 left-1/2 -translate-x-1/2 size-6 text-red-500 fill-red-500 animate-pulse" />
          <h2 className="text-3xl md:text-4xl font-caveat font-bold text-foreground">
            Wall of Love
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((t, idx) => {
            if (t.type === "polaroid") {
              return (
                <div key={idx} className={`bg-white dark:bg-slate-200 p-3 pb-10 shadow-lg ${t.rotation} border border-slate-300 dark:border-slate-400 relative hover:scale-105 transition-transform z-10`}>
                  <div className="bg-slate-100 dark:bg-slate-300 w-full aspect-square mb-3 flex items-center justify-center p-3 border border-slate-200 dark:border-slate-400">
                    <p className="font-patrick-hand text-lg text-center text-slate-800 leading-snug">"{t.text}"</p>
                  </div>
                  <div className="absolute bottom-2.5 left-0 w-full flex items-center justify-center gap-2">
                    <img src={t.avatar} alt={t.author} className="size-6 rounded-full border border-slate-400 bg-white" />
                    <span className="font-caveat text-lg font-bold text-slate-900">— {t.author}</span>
                  </div>
                </div>
              );
            } else {
              return (
                <div key={idx} className={`${t.color} text-slate-900 p-4 shadow-md ${t.rotation} relative hover:scale-105 transition-transform z-10 flex flex-col justify-between`} style={{ borderRadius: "0 0 10% 0 / 0 0 10% 0" }}>
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-8 h-3.5 bg-white/40 shadow-sm border border-black/5" />
                  <p className="font-patrick-hand text-lg leading-relaxed mb-3">"{t.text}"</p>
                  <div className="flex items-center justify-end gap-1.5 mt-auto">
                    <span className="font-caveat text-lg font-bold text-slate-900">— {t.author}</span>
                    <img src={t.avatar} alt={t.author} className="size-6 rounded-full border border-black/20 bg-white/50" />
                  </div>
                </div>
              );
            }
          })}
        </div>
      </div>
    </section>
  );
}
