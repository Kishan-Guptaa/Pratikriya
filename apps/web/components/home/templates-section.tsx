"use client";

import { useState } from "react";
import { TEMPLATES_DATA } from "~/lib/templates";

export function TemplatesSection() {
  const [showAll, setShowAll] = useState(false);
  const templates = TEMPLATES_DATA;

  const displayedTemplates = showAll ? templates : templates.slice(0, 6);

  return (
    <section id="templates" className="py-12 md:py-16 px-6 relative bg-background overflow-hidden">
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-caveat font-bold text-foreground mb-1.5">
              Start with a Sketch
            </h2>
            <p className="text-base text-muted-foreground font-patrick-hand">
              Pick a hand-drawn template and make it yours.
            </p>
          </div>
          <button 
            onClick={() => setShowAll(!showAll)}
            className="text-primary font-bold font-patrick-hand text-lg hover:underline underline-offset-4 decoration-wavy"
          >
            {showAll ? "Show Less" : "View All Templates \u2192"}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all">
          {displayedTemplates.map((tpl, idx) => (
            <div 
              key={idx} 
              className={`w-full bg-white dark:bg-black p-4 border-2 border-foreground shadow-[3px_3px_0px_rgba(0,0,0,0.2)] hover:shadow-[6px_6px_0px_#7b61ff] transition-all hover:-translate-y-1 cursor-pointer ${tpl.border}`}
            >
              <div className={`size-10 rounded-xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center mb-3 ${tpl.color} border border-foreground/10`}>
                {tpl.icon}
              </div>
              <h3 className="text-xl font-bold font-geist-sans text-foreground">{tpl.title}</h3>
              <div className="mt-3 h-1 w-10 bg-foreground/20 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
