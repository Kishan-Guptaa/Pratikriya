"use client";

import Link from "next/link";
import { useUser } from "~/hooks/api/auth";
import { Button } from "~/components/ui/button";
import { ArrowRight } from "lucide-react";

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

  return (
    <div className="min-h-screen flex flex-col relative bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 flex h-20 items-center justify-between px-6 md:px-12 lg:px-24 bg-background/80 backdrop-blur-md border-b-2 border-foreground/10">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-full bg-primary flex items-center justify-center text-white font-bold font-caveat text-xl">
            P
          </div>
          <span className="text-2xl font-caveat font-bold text-foreground">
            Pratikriya
          </span>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <Button asChild className="rounded-full px-6 font-semibold border-2 border-foreground shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-[2px] hover:translate-x-[2px] transition-all">
              <Link href="/dashboard">
                Dashboard <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="ghost" className="font-semibold hidden sm:inline-flex font-patrick-hand text-lg">
                <Link href="/login">Log in</Link>
              </Button>
              <Button asChild className="rounded-full px-6 font-bold bg-primary text-white border-2 border-foreground shadow-[4px_4px_0px_#2d2638] dark:shadow-[4px_4px_0px_#f5f3f7] hover:shadow-none hover:translate-y-1 hover:translate-x-1 transition-all">
                <Link href="/signup">Sign up free</Link>
              </Button>
            </>
          )}
        </div>
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
