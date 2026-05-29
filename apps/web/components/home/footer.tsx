"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "~/lib/utils";
import {
  Github,
  Twitter,
  Mail,
  Send,
  CheckCircle2,
  Activity,
  Sparkles,
  Unplug,
  Link2,
  Type,
  ListTodo,
  Star,
  Paperclip,
  ClipboardList
} from "lucide-react";
import { Button } from "~/components/ui/button";

interface FormFieldItem {
  id: string;
  name: string;
  color: string;
  icon: React.ComponentType<any>;
  desc: string;
}

const FORM_FIELDS: FormFieldItem[] = [
  { id: "text", name: "Text Input", color: "#3b82f6", icon: Type, desc: "Standard text box for short written answers." },
  { id: "email", name: "Email Input", color: "#10b981", icon: Mail, desc: "Text field with automatic email validation checks." },
  { id: "rating", name: "Star Rating", color: "#eab308", icon: Star, desc: "Interactive star ratings for customer satisfaction." },
  { id: "file", name: "File Upload", color: "#f97316", icon: Paperclip, desc: "Upload field supporting screenshots, CVs, and documents." },
  { id: "choice", name: "Choice Selection", color: "#ec4899", icon: ListTodo, desc: "Multiple choice checkboxes or radio select lists." },
];

interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  const [fields, setFields] = useState<Record<string, boolean>>({
    text: true,
    email: true,
    rating: false,
    file: true,
    choice: false,
  });

  const [hovered, setHovered] = useState<string | null>(null);
  const [hoveredSocial, setHoveredSocial] = useState<string | null>(null);
  const [hoveredPortfolio, setHoveredPortfolio] = useState(false);

  // Newsletter form states
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const toggleField = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid triggering hover changes
    setFields(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    // Basic validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    setErrorMsg("");
    setIsSubmitting(true);

    // Mock API Call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubscribed(true);
    }, 1000);
  };

  const activeHoveredItem = hovered ? FORM_FIELDS.find(f => f.id === hovered) : null;

  return (
    <footer className={cn("relative border-t-4 border-foreground bg-background text-foreground pt-8 pb-4 px-6 md:px-12 lg:px-24 overflow-hidden", className)}>
      {/* Self-contained CSS for animations */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes footerFlow {
          from {
            stroke-dashoffset: 40;
          }
          to {
            stroke-dashoffset: 0;
          }
        }
        .animate-flow {
          stroke-dasharray: 8 4;
          animation: footerFlow 1.8s linear infinite;
        }
        .animate-flow-fast {
          stroke-dasharray: 6 3;
          animation: footerFlow 0.9s linear infinite;
        }
      `}} />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-4 items-start mb-8">

        {/* Left Column: Brand & Newsletter */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-full bg-primary flex items-center justify-center text-white font-bold font-caveat text-lg border-2 border-foreground shadow-[1.5px_1.5px_0px_#000]">
              P
            </div>
            <span className="text-2xl font-caveat font-bold">
              Pratikriya
            </span>
          </div>

          <p className="text-sm font-patrick-hand text-muted-foreground leading-relaxed max-w-sm">
            The playground for collecting feedback. Build beautiful forms, view live analytics, and send responses anywhere you work.
          </p>

          {/* Interactive Connect Form */}
          <div className="bg-white dark:bg-[#1a1424] border-2 border-foreground rounded-xl p-3.5 shadow-[3px_3px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_rgba(255,255,255,0.15)] relative overflow-hidden transition-all duration-300">
            {subscribed ? (
              <div className="text-center py-2.5 space-y-2 animate-in zoom-in-95 duration-300">
                <div className="inline-flex size-9 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border-2 border-foreground">
                  <CheckCircle2 className="size-4.5" />
                </div>
                <h4 className="font-caveat text-xl font-bold">You're Connected!</h4>
                <p className="text-xs font-patrick-hand text-muted-foreground">
                  We'll ping you with form design tips and updates.
                </p>
                <Button 
                  size="xs" 
                  variant="outline"
                  onClick={() => {
                    setSubscribed(false);
                    setEmail("");
                  }}
                  className="font-semibold text-[10px] border-2 border-foreground hover:bg-muted py-1 h-7"
                >
                  Reset Form
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <h4 className="font-caveat text-xl font-bold flex items-center gap-1.5">
                  <Sparkles className="size-3.5 text-accent" />
                  Connect with our newsletter
                </h4>
                <p className="text-xs font-patrick-hand text-muted-foreground">
                  Get tips on increasing form conversion rates.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-1.5 pt-0.5">
                  <div className="relative flex-1">
                    <input
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isSubmitting}
                      className="w-full h-8 px-2 rounded-md border-2 border-foreground bg-background text-xs outline-none placeholder:text-muted-foreground focus:border-primary disabled:opacity-50 transition-colors font-patrick-hand"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-8 px-3 text-xs font-bold bg-accent text-white border-2 border-foreground shadow-[1.5px_1.5px_0px_#000] hover:shadow-none hover:translate-y-[1px] hover:translate-x-[1px] active:translate-y-1 active:translate-x-1 transition-all rounded-md"
                  >
                    {isSubmitting ? (
                      <span className="size-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <span className="flex items-center gap-1">
                        Connect <Send className="size-2.5" />
                      </span>
                    )}
                  </Button>
                </div>
                {errorMsg && (
                  <p className="text-[10px] text-destructive font-patrick-hand font-semibold">{errorMsg}</p>
                )}
              </form>
            )}
          </div>
        </div>

        {/* Center/Middle Column: Connecting UI Integrations Hub */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center relative min-h-[220px]">
          <h3 className="text-base font-bold font-caveat mb-2 md:mb-0 lg:absolute lg:top-0 lg:left-1/2 lg:-translate-x-1/2">
            Form Structure Hub
          </h3>

          {/* Desktop SVG Connector View */}
          <div className="relative w-full max-w-[320px] h-[180px] hidden md:flex items-center justify-between z-10 pt-2">

            {/* SVG Connecting Paths */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 450 260" fill="none">
              {/* Text Input Connection */}
              <path
                d="M 60 45 C 160 45, 160 130, 225 130"
                stroke={fields.text ? "#7b61ff" : "var(--border)"}
                strokeWidth={hovered === "text" ? 3 : 2}
                className={fields.text ? (hovered === "text" ? "animate-flow-fast" : "animate-flow") : ""}
                opacity={fields.text ? (hovered === "text" ? 1 : 0.6) : 0.2}
                style={{ transition: "stroke 0.3s, stroke-width 0.3s, opacity 0.3s" }}
              />
              {/* Email Input Connection */}
              <path
                d="M 60 215 C 160 215, 160 130, 225 130"
                stroke={fields.email ? "#7b61ff" : "var(--border)"}
                strokeWidth={hovered === "email" ? 3 : 2}
                className={fields.email ? (hovered === "email" ? "animate-flow-fast" : "animate-flow") : ""}
                opacity={fields.email ? (hovered === "email" ? 1 : 0.6) : 0.2}
                style={{ transition: "stroke 0.3s, stroke-width 0.3s, opacity 0.3s" }}
              />
              {/* Star Rating Connection */}
              <path
                d="M 390 45 C 290 45, 290 130, 225 130"
                stroke={fields.rating ? "#7b61ff" : "var(--border)"}
                strokeWidth={hovered === "rating" ? 3 : 2}
                className={fields.rating ? (hovered === "rating" ? "animate-flow-fast" : "animate-flow") : ""}
                opacity={fields.rating ? (hovered === "rating" ? 1 : 0.6) : 0.2}
                style={{ transition: "stroke 0.3s, stroke-width 0.3s, opacity 0.3s" }}
              />
              {/* File Upload Connection */}
              <path
                d="M 390 215 C 290 215, 290 130, 225 130"
                stroke={fields.file ? "#7b61ff" : "var(--border)"}
                strokeWidth={hovered === "file" ? 3 : 2}
                className={fields.file ? (hovered === "file" ? "animate-flow-fast" : "animate-flow") : ""}
                opacity={fields.file ? (hovered === "file" ? 1 : 0.6) : 0.2}
                style={{ transition: "stroke 0.3s, stroke-width 0.3s, opacity 0.3s" }}
              />
              {/* Choice Connection */}
              <path
                d="M 225 215 L 225 130"
                stroke={fields.choice ? "#7b61ff" : "var(--border)"}
                strokeWidth={hovered === "choice" ? 3 : 2}
                className={fields.choice ? (hovered === "choice" ? "animate-flow-fast" : "animate-flow") : ""}
                opacity={fields.choice ? (hovered === "choice" ? 1 : 0.6) : 0.2}
                style={{ transition: "stroke 0.3s, stroke-width 0.3s, opacity 0.3s" }}
              />
            </svg>

            {/* Left nodes: Text & Email */}
            <div className="flex flex-col justify-between h-full z-10 w-20">
              {FORM_FIELDS.slice(0, 2).map((item) => {
                const IconComponent = item.icon;
                const isRequired = fields[item.id];
                return (
                  <div
                    key={item.id}
                    onMouseEnter={() => setHovered(item.id)}
                    onMouseLeave={() => setHovered(null)}
                    className={`p-1 rounded-lg border-2 border-foreground bg-white dark:bg-[#1a1424] flex flex-col items-center gap-0.5 shadow-[1.5px_1.5px_0px_#000] dark:shadow-[1.5px_1.5px_0px_#fff] cursor-pointer transition-all hover:-translate-y-0.5 ${isRequired ? "opacity-100" : "opacity-60"
                      }`}
                  >
                    <div
                      className="size-6 rounded-md flex items-center justify-center text-white shadow-[0.5px_0.5px_0px_#000]"
                      style={{ backgroundColor: item.color }}
                    >
                      <IconComponent className="size-3" />
                    </div>
                    <span className="text-[8px] font-bold tracking-tight">{item.name}</span>
                    <button
                      onClick={(e) => toggleField(item.id, e)}
                      className={`text-[7px] px-1 py-0.5 rounded-full border border-foreground font-bold ${isRequired
                          ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400"
                          : "bg-muted text-muted-foreground"
                        }`}
                    >
                      {isRequired ? "Required" : "Optional"}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Center Form Node */}
            <div className="z-10 flex flex-col items-center justify-center">
              <div className={`size-10 rounded-full border-2 border-foreground bg-primary flex items-center justify-center text-white shadow-[2px_2px_0px_#000] dark:shadow-[2px_2px_0px_#fff] relative ${Object.values(fields).some(Boolean) ? "animate-pulse" : ""
                }`}>
                <ClipboardList className="size-4.5" />
                {/* Ping rings if required field exists */}
                {Object.values(fields).some(Boolean) && (
                  <span className="absolute -inset-1 rounded-full border border-primary/40 animate-ping pointer-events-none" />
                )}
              </div>
              <div className="mt-2 bg-foreground text-background text-[8px] font-bold px-2 py-0.5 rounded-full shadow-[1px_1px_0px_rgba(0,0,0,0.15)] flex items-center gap-0.5">
                <Link2 className="size-2.5" />
                <span>Form Canvas</span>
              </div>
            </div>

            {/* Right nodes: Rating & File */}
            <div className="flex flex-col justify-between h-full z-10 w-20 items-end">
              {FORM_FIELDS.slice(2, 4).map((item) => {
                const IconComponent = item.icon;
                const isRequired = fields[item.id];
                return (
                  <div
                    key={item.id}
                    onMouseEnter={() => setHovered(item.id)}
                    onMouseLeave={() => setHovered(null)}
                    className={`p-1 rounded-lg border-2 border-foreground bg-white dark:bg-[#1a1424] flex flex-col items-center gap-0.5 shadow-[1.5px_1.5px_0px_#000] dark:shadow-[1.5px_1.5px_0px_#fff] cursor-pointer transition-all hover:-translate-y-0.5 ${isRequired ? "opacity-100" : "opacity-60"
                      }`}
                  >
                    <div
                      className="size-6 rounded-md flex items-center justify-center text-white shadow-[0.5px_0.5px_0px_#000]"
                      style={{ backgroundColor: item.color }}
                    >
                      <IconComponent className="size-3" />
                    </div>
                    <span className="text-[8px] font-bold tracking-tight">{item.name}</span>
                    <button
                      onClick={(e) => toggleField(item.id, e)}
                      className={`text-[7px] px-1 py-0.5 rounded-full border border-foreground font-bold ${isRequired
                          ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400"
                          : "bg-muted text-muted-foreground"
                        }`}
                    >
                      {isRequired ? "Required" : "Optional"}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Bottom node: Choice */}
            {FORM_FIELDS.slice(4, 5).map((item) => {
              const IconComponent = item.icon;
              const isRequired = fields[item.id];
              return (
                <div
                  key={item.id}
                  onMouseEnter={() => setHovered(item.id)}
                  onMouseLeave={() => setHovered(null)}
                  style={{ left: "50%", transform: "translateX(-50%)" }}
                  className={`absolute bottom-0 p-1 rounded-lg border-2 border-foreground bg-white dark:bg-[#1a1424] flex flex-col items-center gap-0.5 shadow-[1.5px_1.5px_0px_#000] dark:shadow-[1.5px_1.5px_0px_#fff] cursor-pointer transition-all hover:-translate-y-0.5 z-10 w-20 ${isRequired ? "opacity-100" : "opacity-60"
                    }`}
                >
                  <div
                    className="size-5 rounded-md flex items-center justify-center text-white shadow-[0.5px_0.5px_0px_#000]"
                    style={{ backgroundColor: item.color }}
                  >
                    <IconComponent className="size-2.5" />
                  </div>
                  <span className="text-[7px] font-bold tracking-tight">{item.name}</span>
                  <button
                    onClick={(e) => toggleField(item.id, e)}
                    className={`text-[6px] px-1 py-0.5 rounded-full border border-foreground font-bold ${isRequired
                        ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400"
                        : "bg-muted text-muted-foreground"
                      }`}
                  >
                    {isRequired ? "Required" : "Optional"}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Mobile Fallback View */}
          <div className="md:hidden grid grid-cols-5 gap-1.5 w-full pt-2">
            {FORM_FIELDS.map((item) => {
              const IconComponent = item.icon;
              const isRequired = fields[item.id];
              return (
                <button
                  key={item.id}
                  onClick={(e) => {
                    toggleField(item.id, e);
                    setHovered(hovered === item.id ? null : item.id);
                  }}
                  className={`p-1.5 rounded-lg border border-foreground flex flex-col items-center gap-1 transition-all ${isRequired ? "bg-primary/10 border-primary" : "bg-white dark:bg-zinc-900 opacity-60"
                    }`}
                >
                  <div
                    className="size-6 rounded-md flex items-center justify-center text-white"
                    style={{ backgroundColor: item.color }}
                  >
                    <IconComponent className="size-3" />
                  </div>
                  <span className="text-[8px] font-bold truncate max-w-full">{item.name}</span>
                </button>
              );
            })}
          </div>

          {/* Connection Status Description Card */}
          <div className="mt-3 md:mt-1.5 w-full max-w-[240px] bg-slate-50 dark:bg-zinc-900 border-2 border-foreground/10 rounded-xl p-2.5 text-center min-h-[50px] flex flex-col items-center justify-center transition-colors">
            {activeHoveredItem ? (
              <div className="animate-in fade-in slide-in-from-bottom-1 duration-200">
                <span
                  className="inline-block text-[9px] font-bold text-white px-1.5 py-0.5 rounded-md mb-0.5"
                  style={{ backgroundColor: activeHoveredItem.color }}
                >
                  {activeHoveredItem.name}
                </span>
                <p className="text-[10px] font-patrick-hand text-muted-foreground leading-tight">
                  {activeHoveredItem.desc}
                </p>
              </div>
            ) : (
              <div className="text-[10px] font-patrick-hand text-muted-foreground flex flex-col items-center leading-tight">
                <div className="flex items-center gap-1 font-bold">
                  {Object.values(fields).filter(Boolean).length > 0 ? (
                    <span className="flex items-center gap-0.5 text-primary">
                      <Sparkles className="size-2.5 animate-pulse" />
                      {Object.values(fields).filter(Boolean).length} Required
                    </span>
                  ) : (
                    <span className="flex items-center gap-0.5 text-muted-foreground">
                      <Unplug className="size-2.5" />
                      All Optional
                    </span>
                  )}
                </div>
                <p className="text-[9px] mt-0.5">Hover to inspect nodes or toggle state.</p>
              </div>
            )}
          </div>

          {/* Creative Scribble Illustration of kids sharing info */}
          <div className="mt-4 w-full max-w-[180px] bg-white dark:bg-zinc-800 border-2 border-foreground rounded-xl p-2 shadow-[2.5px_2.5px_0px_#000] dark:shadow-[2.5px_2.5px_0px_#fff] rotate-[-1.5deg] hover:rotate-0 hover:scale-[1.02] transition-all duration-300">
            <div className="relative aspect-square w-full rounded-lg overflow-hidden border border-foreground bg-white">
              <img
                src="/images/scribble_sharing.png"
                alt="Scribble kids sharing information"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="mt-1.5 text-center">
              <p className="font-caveat text-xs font-extrabold text-foreground leading-none">
                Exchanging feedback notes! 💬
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Site Navigation links & Developer Portfolio Card */}
        <div className="lg:col-span-4 flex flex-col gap-4 lg:pl-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-caveat text-lg font-bold border-b border-foreground/10 pb-0.5">Product</h4>
              <ul className="space-y-1 font-patrick-hand text-xs text-muted-foreground">
                <li>
                  <Link href="/#features" className="hover:text-foreground hover:underline transition-colors">Features</Link>
                </li>
                <li>
                  <Link href="/#templates" className="hover:text-foreground hover:underline transition-colors">Templates</Link>
                </li>
                <li>
                  <Link href="/#pricing" className="hover:text-foreground hover:underline transition-colors">Pricing</Link>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:text-foreground hover:underline transition-colors">Dashboard</Link>
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-caveat text-lg font-bold border-b border-foreground/10 pb-0.5">Company</h4>
              <ul className="space-y-1 font-patrick-hand text-xs text-muted-foreground">
                <li>
                  <Link href="https://kishann.dev" target="_blank" className="hover:text-foreground hover:underline transition-colors">Kishann.dev</Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-foreground hover:underline transition-colors">Contact</Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-foreground hover:underline transition-colors">Privacy Policy</Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-foreground hover:underline transition-colors">Terms of Use</Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Developer Portfolio Promo Card with scribble boy reading image */}
          <div className="relative mt-1">
            {hoveredPortfolio && (
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-pastel-yellow border-2 border-foreground text-[#2d2638] text-[9px] font-bold px-2 py-0.5 rounded-md shadow-[1px_1px_0px_#000] whitespace-nowrap animate-in zoom-in-95 duration-100 z-30">
                Check my portfolio! 🚀
              </div>
            )}
            <Link
              href="https://kishann.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="block group max-w-[180px] mx-auto lg:mx-0"
              onMouseEnter={() => setHoveredPortfolio(true)}
              onMouseLeave={() => setHoveredPortfolio(false)}
            >
              <div className="relative border-2 border-foreground rounded-xl overflow-hidden bg-pastel-yellow dark:bg-zinc-800 p-2 shadow-[2px_2px_0px_#000] dark:shadow-[2px_2px_0px_#fff] group-hover:shadow-none group-hover:translate-x-[1px] group-hover:translate-y-[1px] active:translate-x-[2px] active:translate-y-[2px] transition-all">
                <div className="relative aspect-[4/3] w-full rounded-lg overflow-hidden border border-foreground bg-white">
                  <img
                    src="/images/scribble_boy_reading.png"
                    alt="Kishan Gupta Portfolio"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-1 right-1 bg-pastel-pink border border-foreground px-1.5 py-0.2 rounded-full text-[8px] font-bold text-foreground rotate-6 shadow-[1px_1px_0px_#000]">
                    Owner 🚀
                  </div>
                </div>
                <div className="mt-1.5 text-center">
                  <span className="inline-block font-caveat text-xs font-extrabold text-foreground border-b border-dashed border-foreground/30 group-hover:border-foreground transition-all">
                    Kishann.dev
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Copyright & Socials */}
      <div className="max-w-7xl mx-auto pt-3.5 border-t border-foreground/10 flex flex-col sm:flex-row items-center justify-between gap-3">

        <p className="text-xs font-patrick-hand text-muted-foreground">
          © {new Date().getFullYear()} Pratikriya. Built by{" "}
          <a
            href="https://kishann.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground"
          >
            Kishann.dev
          </a>
          . All responses collected with love.
        </p>

        {/* Social Icons with Tooltips */}
        <div className="flex items-center gap-2 relative h-8">
          {hoveredSocial && (
            <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-pastel-yellow border-2 border-foreground text-[#2d2638] text-[8px] font-bold px-1.5 py-0.5 rounded-md shadow-[1px_1px_0px_#000] whitespace-nowrap animate-in zoom-in-95 duration-100">
              {hoveredSocial}
            </div>
          )}
          <a
            href="https://github.com/Kishan-Guptaa"
            target="_blank"
            rel="noreferrer"
            onMouseEnter={() => setHoveredSocial("GitHub")}
            onMouseLeave={() => setHoveredSocial(null)}
            className="size-7 rounded-full border-2 border-foreground bg-white dark:bg-zinc-800 text-foreground flex items-center justify-center hover:translate-y-[-1px] hover:-rotate-3 transition-all hover:bg-slate-100 dark:hover:bg-zinc-700 hover:text-foreground"
          >
            <Github className="size-3.5" />
          </a>
          <a
            href="https://x.com/T2_c0de"
            target="_blank"
            rel="noreferrer"
            onMouseEnter={() => setHoveredSocial("Twitter / X")}
            onMouseLeave={() => setHoveredSocial(null)}
            className="size-7 rounded-full border-2 border-foreground bg-white dark:bg-zinc-800 text-foreground flex items-center justify-center hover:translate-y-[-1px] hover:rotate-3 transition-all hover:bg-slate-100 dark:hover:bg-zinc-700 hover:text-foreground"
          >
            <Twitter className="size-3.5" />
          </a>
          <a
            href="mailto:kishangupta.code@gmail.com"
            onMouseEnter={() => setHoveredSocial("Email")}
            onMouseLeave={() => setHoveredSocial(null)}
            className="size-7 rounded-full border-2 border-foreground bg-white dark:bg-zinc-800 text-foreground flex items-center justify-center hover:translate-y-[-1px] hover:-rotate-3 transition-all hover:bg-slate-100 dark:hover:bg-zinc-700 hover:text-foreground"
          >
            <Mail className="size-3.5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
