"use client";

import { useState } from "react";
import Link from "next/link";
import { useUser } from "~/hooks/api/auth";
import { Button } from "~/components/ui/button";
import { ArrowRight, Menu, X } from "lucide-react";

import { HeroSection } from "~/components/home/hero-section";
import { HouseTourSection } from "~/components/home/house-tour-section";
import { WhySection } from "~/components/home/why-section";
import { DemoSection } from "~/components/home/demo-section";
import { TemplatesSection } from "~/components/home/templates-section";
import { TimelineSection } from "~/components/home/timeline-section";
import { TestimonialsSection } from "~/components/home/testimonials-section";
import { PricingSection } from "~/components/home/pricing-section";
import { CtaSection } from "~/components/home/cta-section";
import { Footer } from "~/components/home/footer";

export default function Home() {
  const { user } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col relative bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 flex h-20 items-center justify-between px-6 md:px-12 lg:px-24 bg-background/80 backdrop-blur-md border-b-2 border-foreground/10">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-full bg-primary flex items-center justify-center text-white font-bold font-caveat text-xl border-2 border-foreground shadow-[1px_1px_0px_#000]">
            P
          </div>
          <span className="text-2xl font-caveat font-bold text-foreground">
            Pratikriya
          </span>
        </div>

        {/* Center Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 font-patrick-hand text-xl text-muted-foreground">
          <Link href="#features" className="hover:text-foreground hover:underline underline-offset-4 decoration-wavy transition-all">
            Features
          </Link>
          <Link href="#templates" className="hover:text-foreground hover:underline underline-offset-4 decoration-wavy transition-all">
            Templates
          </Link>
          <Link href="#pricing" className="hover:text-foreground hover:underline underline-offset-4 decoration-wavy transition-all">
            Pricing
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          {/* Desktop Action Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <Button asChild className="rounded-full px-6 font-semibold border-2 border-foreground shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-[2px] hover:translate-x-[2px] transition-all">
                <Link href="/dashboard">
                  Dashboard <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="ghost" className="font-semibold font-patrick-hand text-lg">
                  <Link href="/login">Log in</Link>
                </Button>
                <Button asChild className="rounded-full px-6 font-bold bg-primary text-white border-2 border-foreground shadow-[4px_4px_0px_#2d2638] dark:shadow-[4px_4px_0px_#f5f3f7] hover:shadow-none hover:translate-y-1 hover:translate-x-1 transition-all">
                  <Link href="/signup">Sign up free</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex md:hidden items-center justify-center size-10 rounded-full border-2 border-foreground bg-white dark:bg-zinc-950 text-foreground shadow-[2.5px_2.5px_0px_rgba(0,0,0,1)] dark:shadow-[2.5px_2.5px_0px_rgba(255,255,255,1)] hover:shadow-none hover:translate-y-[2.5px] hover:translate-x-[2.5px] transition-all active:translate-y-[2px]"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>

        {/* Mobile Dropdown Sheet */}
        {mobileMenuOpen && (
          <div className="absolute top-20 left-4 right-4 z-40 bg-white dark:bg-zinc-950 border-2 border-foreground p-6 rounded-2xl shadow-[4px_4px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_rgba(255,255,255,1)] flex flex-col gap-4 animate-in slide-in-from-top-4 duration-200 md:hidden">
            <nav className="flex flex-col gap-2 font-patrick-hand text-xl text-center">
              <Link 
                href="#features" 
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 hover:text-primary transition-colors border-b border-foreground/5"
              >
                Features
              </Link>
              <Link 
                href="#templates" 
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 hover:text-primary transition-colors border-b border-foreground/5"
              >
                Templates
              </Link>
              <Link 
                href="#pricing" 
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 hover:text-primary transition-colors border-b border-foreground/5"
              >
                Pricing
              </Link>
            </nav>

            <div className="flex flex-col gap-3 pt-2">
              {user ? (
                <Button asChild onClick={() => setMobileMenuOpen(false)} className="w-full rounded-full py-5 font-bold border-2 border-foreground shadow-[3px_3px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-[1px] hover:translate-x-[1px] transition-all bg-white text-foreground hover:bg-slate-50 dark:bg-zinc-900 dark:text-white">
                  <Link href="/dashboard" className="flex items-center justify-center gap-2">
                    Dashboard <ArrowRight className="size-4" />
                  </Link>
                </Button>
              ) : (
                <>
                  <Button asChild variant="outline" onClick={() => setMobileMenuOpen(false)} className="w-full rounded-full py-5 font-bold border-2 border-foreground bg-white dark:bg-zinc-950 text-foreground shadow-[3px_3px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_rgba(255,255,255,1)] hover:shadow-none hover:translate-y-[1px] hover:translate-x-[1px] transition-all">
                    <Link href="/login" className="flex justify-center">Log in</Link>
                  </Button>
                  <Button asChild onClick={() => setMobileMenuOpen(false)} className="w-full rounded-full py-5 font-bold bg-primary text-white border-2 border-foreground shadow-[3px_3px_0px_#2d2638] dark:shadow-[3px_3px_0px_#f5f3f7] hover:shadow-none hover:translate-y-[1px] hover:translate-x-[1px] transition-all">
                    <Link href="/signup" className="flex justify-center">Sign up free</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content Sections */}
      <main className="flex-1 pt-20">
        <HeroSection />
        <HouseTourSection />
        <WhySection />
        <DemoSection />
        <TemplatesSection />
        <TimelineSection />
        <TestimonialsSection />
        <PricingSection />
        <CtaSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
