"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { useUser } from "~/hooks/api/auth";
import { Button } from "~/components/ui/button";
import { 
  ArrowLeft, 
  ArrowRight, 
  Search, 
  FileText, 
  Mail, 
  UserCheck, 
  AlertOctagon,
  Scale,
  XCircle,
  HelpCircle
} from "lucide-react";
import { Footer } from "~/components/home/footer";

interface TermsSection {
  id: string;
  title: string;
  badge: string;
  color: string;
  content: React.ReactNode;
  keywords: string[];
}

export default function TermsOfUsePage() {
  const { user, isLoading } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSection, setActiveSection] = useState("acceptance");

  const sections: TermsSection[] = useMemo(() => [
    {
      id: "acceptance",
      title: "1. Acceptance of Terms",
      badge: "Agreement",
      color: "bg-pastel-blue",
      keywords: ["acceptance", "agreement", "terms", "agree", "using", "platform", "consent"],
      content: (
        <div className="space-y-3 font-patrick-hand text-base leading-relaxed">
          <p>
            Welcome to <strong>Pratikriya Forms</strong>! These Terms of Use govern your access to and usage of our form creation platform, templates, analytics dashboards, and custom webhook integrations.
          </p>
          <p className="bg-pastel-blue/20 p-3 rounded-xl border border-dashed border-primary">
            By signing up, creating forms, or using any feature on Pratikriya, you explicitly agree to comply with and be bound by these Terms. If you do not agree, please do not access or use the platform.
          </p>
        </div>
      )
    },
    {
      id: "eligibility",
      title: "2. Eligibility Requirements",
      badge: "Eligibility",
      color: "bg-pastel-pink",
      keywords: ["eligibility", "age", "13", "accuracy", "laws", "requirements"],
      content: (
        <div className="space-y-2 font-patrick-hand text-base">
          <p>To use our services, you must satisfy the following conditions:</p>
          <ul className="space-y-1.5 pl-2 text-sm text-muted-foreground list-disc list-inside">
            <li>You must be at least <strong>13 years of age</strong> (or the minimum legal age in your jurisdiction).</li>
            <li>You must provide accurate, complete, and current registration information when setting up your account.</li>
            <li>Your use of the services must not violate any applicable local, state, or international laws or regulations.</li>
          </ul>
        </div>
      )
    },
    {
      id: "accounts",
      title: "3. User Accounts & Security",
      badge: "Accounts",
      color: "bg-pastel-yellow",
      keywords: ["accounts", "security", "credentials", "password", "activities", "responsibility"],
      content: (
        <div className="space-y-3 font-patrick-hand text-base">
          <p>
            When you create an account on Pratikriya, you are fully responsible for preserving your account's credentials:
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-sm text-muted-foreground pl-2">
            <li><strong>Credential Security:</strong> Keep your login passwords or OAuth integration sessions highly secure.</li>
            <li><strong>Activity Responsibility:</strong> You are liable for all actions, forms created, and responses collected under your account.</li>
            <li><strong>Unauthorized Access:</strong> Notify us immediately at <em>kishangupta.code@gmail.com</em> if you detect any unauthorized access or breach of credentials.</li>
          </ul>
        </div>
      )
    },
    {
      id: "acceptable-use",
      title: "4. Acceptable Use Policy",
      badge: "Restrictions",
      color: "bg-orange-100",
      keywords: ["acceptable use", "malware", "abuse", "unauthorized", "illegal", "copyright", "harassment", "bots", "restrictions"],
      content: (
        <div className="space-y-3 font-patrick-hand text-base">
          <p>To maintain a friendly, secure playground for everyone, you explicitly agree that you will <strong>NOT</strong>:</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            <div className="p-3 border-2 border-foreground rounded-xl bg-white shadow-[2px_2px_0px_#000] flex gap-2">
              <XCircle className="size-4 text-red-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-xs text-slate-800 block">Upload Malware</strong>
                <span className="text-xs text-muted-foreground">Distribute viruses, worms, trojans, or destructive code.</span>
              </div>
            </div>

            <div className="p-3 border-2 border-foreground rounded-xl bg-white shadow-[2px_2px_0px_#000] flex gap-2">
              <XCircle className="size-4 text-red-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-xs text-slate-800 block">System Abuse</strong>
                <span className="text-xs text-muted-foreground">Attempt to overload, spam, or DDoS server instances.</span>
              </div>
            </div>

            <div className="p-3 border-2 border-foreground rounded-xl bg-white shadow-[2px_2px_0px_#000] flex gap-2">
              <XCircle className="size-4 text-red-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-xs text-slate-800 block">Hacking & Intrusion</strong>
                <span className="text-xs text-muted-foreground">Access databases or user accounts without explicit permission.</span>
              </div>
            </div>

            <div className="p-3 border-2 border-foreground rounded-xl bg-white shadow-[2px_2px_0px_#000] flex gap-2">
              <XCircle className="size-4 text-red-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-xs text-slate-800 block">Illegal Content</strong>
                <span className="text-xs text-muted-foreground">Submit forms collecting phishing credentials, fraud, or hate speech.</span>
              </div>
            </div>

            <div className="p-3 border-2 border-foreground rounded-xl bg-white shadow-[2px_2px_0px_#000] flex gap-2">
              <XCircle className="size-4 text-red-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-xs text-slate-800 block">Copyright Violations</strong>
                <span className="text-xs text-muted-foreground">Infringe patents, trademarks, or proprietary code of others.</span>
              </div>
            </div>

            <div className="p-3 border-2 border-foreground rounded-xl bg-white shadow-[2px_2px_0px_#000] flex gap-2">
              <XCircle className="size-4 text-red-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-xs text-slate-800 block">Scraper Bots</strong>
                <span className="text-xs text-muted-foreground">Use automated scripts/bots to scrape submission endpoints.</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "ownership",
      title: "5. Form Content & Ownership",
      badge: "Data Ownership",
      color: "bg-emerald-100",
      keywords: ["ownership", "content", "submissions", "permission", "license", "storage"],
      content: (
        <div className="space-y-3 font-patrick-hand text-base">
          <p>
            You retain absolute ownership and intellectual property rights over all form schemas, titles, descriptions, and submission response payloads collected by your forms.
          </p>
          <p className="bg-emerald-50 border border-emerald-300 p-2.5 rounded-xl text-xs text-emerald-800">
            <strong>License Grant:</strong> You grant Pratikriya Forms a worldwide, non-exclusive, royalty-free license to host, store, transfer, display, and process your forms and submissions solely for the purpose of providing the service to you.
          </p>
        </div>
      )
    },
    {
      id: "intellectual-property",
      title: "6. Intellectual Property rights",
      badge: "Brand IP",
      color: "bg-red-100",
      keywords: ["intellectual property", "ip", "logo", "brand", "ui design", "source code", "assets"],
      content: (
        <div className="space-y-2 font-patrick-hand text-base">
          <p>
            All intellectual property rights in and to Pratikriya Forms—including our brand logo, application name, neobrutalist hand-drawn UI design tokens, custom illustrations, codebase, and documentation—are owned exclusively by Pratikriya and Kishan Gupta.
          </p>
          <p>
            You may not clone, distribute, reverse-engineer, or sell any visual assets or structural code without our explicit written consent.
          </p>
        </div>
      )
    },
    {
      id: "availability",
      title: "7. Service Availability & Uptime",
      badge: "Uptime",
      color: "bg-purple-100",
      keywords: ["availability", "uptime", "interruption", "guarantee", "maintenance"],
      content: (
        <div className="space-y-2 font-patrick-hand text-base">
          <p>
            We strive to maintain high availability and keep your form endpoints running 24/7.
          </p>
          <p>
            However, we do not guarantee uninterrupted, lag-free service. The platform is provided on an "as-is" and "as-available" basis. We may occasionally perform scheduled maintenance, database upgrades, or security updates that cause temporary downtime.
          </p>
        </div>
      )
    },
    {
      id: "suspension",
      title: "8. Account Suspension & Ban Policies",
      badge: "Suspensions",
      color: "bg-blue-100",
      keywords: ["suspension", "ban", "policy violation", "fraud", "illegal content"],
      content: (
        <div className="space-y-2 font-patrick-hand text-base">
          <p>
            We reserve the right to suspend, lock, or permanently delete your account and associated forms immediately, without prior notice, if:
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm pl-2 text-muted-foreground font-patrick-hand">
            <li>You violate any clause of our Acceptable Use policy.</li>
            <li>Your forms are flagged for harvesting phishing passwords or credentials.</li>
            <li>We detect fraudulent activity or server abuse origins on your account.</li>
            <li>Ordered by local law enforcement or regulatory legal authorities.</li>
          </ul>
        </div>
      )
    },
    {
      id: "liability",
      title: "9. Limitation of Liability",
      badge: "Liability Limit",
      color: "bg-pink-100",
      keywords: ["liability", "limitation", "loss", "data loss", "damages", "warranties"],
      content: (
        <div className="space-y-3 font-patrick-hand text-base">
          <p>
            To the maximum extent permitted by law, Pratikriya Forms and Kishan Gupta shall not be held liable for:
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm pl-2 text-muted-foreground font-patrick-hand">
            <li>Any loss of data, form submissions, or uploaded files.</li>
            <li>Service interruptions, network lag, or server downtime.</li>
            <li>Bugs, errors, or security breaches conducted by third parties.</li>
            <li>Form submission contents generated by your respondents.</li>
          </ul>
        </div>
      )
    },
    {
      id: "termination",
      title: "10. Account Termination",
      badge: "Termination",
      color: "bg-teal-100",
      keywords: ["termination", "terminate", "delete account", "cancel subscription"],
      content: (
        <div className="space-y-2 font-patrick-hand text-base">
          <p>
            <strong>By User:</strong> You can delete your account and cancel your subscription at any time directly through the dashboard Settings tab. All forms and responses will be queued for permanent database removal.
          </p>
          <p>
            <strong>By Us:</strong> We reserve the right to modify or terminate Pratikriya's services at any time, with reasonable notice for paid subscribers where possible.
          </p>
        </div>
      )
    },
    {
      id: "governing-law",
      title: "11. Governing Law & Dispute Resolution",
      badge: "Governing Law",
      color: "bg-indigo-100",
      keywords: ["governing law", "jurisdiction", "india", "disputes", "legal"],
      content: (
        <div className="space-y-2 font-patrick-hand text-base">
          <p>
            These Terms of Use shall be governed by, construed, and enforced in accordance with the <strong>laws of India</strong>, without regard to conflict of law principles.
          </p>
          <p>
            Any legal actions, disputes, or proceedings arising out of or related to Pratikriya Forms shall be filed exclusively in the courts located in New Delhi, India.
          </p>
        </div>
      )
    },
    {
      id: "contact",
      title: "12. Contact Information",
      badge: "Contact",
      color: "bg-pastel-yellow",
      keywords: ["contact", "support", "email", "website", "company"],
      content: (
        <div className="space-y-3 font-patrick-hand text-base">
          <p>For questions or disputes regarding these Terms of Use, get in touch with the owner:</p>
          <div className="p-4 border-2 border-foreground rounded-2xl bg-white shadow-[2px_2px_0px_#000] space-y-2">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase">Support Email</p>
              <p className="text-base font-bold text-slate-800">kishangupta.code@gmail.com</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase">Developer Website</p>
              <p className="text-base font-bold text-slate-800">
                <a href="https://kishann.dev" target="_blank" className="underline hover:text-primary">kishann.dev</a>
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "saas-addons",
      title: "13. Premium SaaS & AI Policies",
      badge: "SaaS Addons",
      color: "bg-pastel-blue",
      keywords: ["refund", "refunds", "cancel", "ai policy", "cookie policy", "gdpr", "saas addons"],
      content: (
        <div className="space-y-3 font-patrick-hand text-base">
          <div className="p-3 border border-foreground/20 rounded-xl bg-white/50">
            <h6 className="font-bold text-sm mb-1 text-primary">Refund Policy</h6>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Paid plans are billed on a recurring monthly or annual basis. You can cancel at any time. We offer a full refund within 14 days of your initial purchase if you are unsatisfied. Refund requests can be directed to support.
            </p>
          </div>

          <div className="p-3 border border-foreground/20 rounded-xl bg-white/50">
            <h6 className="font-bold text-sm mb-1 text-secondary">AI Generation Guidelines</h6>
            <p className="text-xs text-muted-foreground leading-relaxed">
              When utilizing our AI-assisted form generators, you must review the generated fields. We are not liable for inaccurate form fields or logic flaws created by AI tools.
            </p>
          </div>
        </div>
      )
    }
  ], []);

  const filteredSections = useMemo(() => {
    if (!searchQuery) return sections;
    const query = searchQuery.toLowerCase().trim();
    return sections.filter(
      (sec) =>
        sec.title.toLowerCase().includes(query) ||
        sec.keywords.some((kw) => kw.includes(query))
    );
  }, [searchQuery, sections]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header navbar */}
      <header className="sticky top-0 z-50 flex h-20 items-center justify-between px-6 md:px-12 lg:px-24 bg-white/80 backdrop-blur-md border-b-2 border-foreground/10">
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <div className="size-8 rounded-full bg-primary flex items-center justify-center text-white font-bold font-caveat text-xl border-2 border-foreground shadow-[1px_1px_0px_#000]">
            P
          </div>
          <span className="text-2xl font-caveat font-bold text-foreground leading-none mt-1">
            Pratikriya
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <Link 
            href="/" 
            className="text-xs font-bold text-muted-foreground hover:text-foreground font-patrick-hand flex items-center gap-1 hover:underline transition-colors"
          >
            <ArrowLeft className="size-3.5" /> Back to Home
          </Link>

          {isLoading ? (
            <div className="h-9 w-24 bg-muted animate-pulse rounded-xl border-2 border-foreground/10" />
          ) : user ? (
            <Button asChild size="sm" className="rounded-xl border-2 border-foreground shadow-[3px_3px_0px_#000] hover:shadow-none hover:translate-y-0.5 hover:translate-x-0.5 transition-all text-xs font-bold">
              <Link href="/dashboard">
                Dashboard <ArrowRight className="ml-1.5 size-3.5" />
              </Link>
            </Button>
          ) : (
            <Button asChild size="sm" className="rounded-xl border-2 border-foreground shadow-[3px_3px_0px_#000] hover:shadow-none hover:translate-y-0.5 hover:translate-x-0.5 transition-all text-xs font-bold bg-primary text-white">
              <Link href="/login">Log In</Link>
            </Button>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 md:px-8 py-10">
        
        {/* Page Hero */}
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex size-14 items-center justify-center rounded-full bg-pastel-yellow border-3 border-foreground shadow-[3px_3px_0px_#000] mb-2 rotate-[6deg]">
            <FileText className="size-7 text-foreground" />
          </div>
          <h1 className="text-4xl md:text-5xl font-caveat font-extrabold text-slate-800">
            Terms of Use
          </h1>
          <p className="text-base text-slate-600 font-patrick-hand max-w-md mx-auto">
            Please read these terms carefully before accessing or using Pratikriya Forms. They describe your rights and responsibilities.
          </p>
          <div className="inline-block text-xs font-bold px-3 py-1 bg-white border-2 border-foreground rounded-full shadow-[1.5px_1.5px_0px_#000]">
            Last Updated: May 29, 2026
          </div>
        </div>

        {/* Section Search Utility */}
        <div className="max-w-md mx-auto mb-8 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search terms (e.g. 'refund', 'copyright', 'abuse')..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-10 pr-4 bg-white border-3 border-foreground rounded-2xl text-sm text-slate-800 placeholder-slate-500 shadow-[3px_3px_0px_#000] focus:shadow-none focus:translate-x-[1.5px] focus:translate-y-[1.5px] outline-none transition-all font-patrick-hand font-medium"
          />
        </div>

        {/* Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8 items-start">
          
          {/* Index Sidebar - Sticky on desktop, hidden on mobile */}
          <aside className="hidden lg:block sticky top-24 bg-white border-3 border-foreground rounded-2xl p-4 shadow-[4px_4px_0px_#000] space-y-3 shrink-0">
            <h4 className="font-caveat text-lg font-bold border-b-2 border-foreground/10 pb-1 text-slate-700">
              Terms Outline
            </h4>
            <nav className="flex flex-col gap-1.5 max-h-[400px] overflow-y-auto scrollbar-thin">
              {filteredSections.map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => {
                    setActiveSection(sec.id);
                    document.getElementById(sec.id)?.scrollIntoView({ behavior: "smooth", block: "center" });
                  }}
                  className={`text-left text-xs font-patrick-hand font-bold px-2.5 py-1.5 rounded-lg border transition-all truncate ${
                    activeSection === sec.id
                      ? "bg-pastel-yellow border-foreground border-2 shadow-[1.5px_1.5px_0px_#000] text-foreground"
                      : "border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                  }`}
                >
                  {sec.title}
                </button>
              ))}
              {filteredSections.length === 0 && (
                <span className="text-[10px] text-muted-foreground font-patrick-hand">No terms found</span>
              )}
            </nav>
          </aside>

          {/* Notepad Terms Body */}
          <div className="space-y-6">
            {filteredSections.map((sec) => (
              <section
                key={sec.id}
                id={sec.id}
                onMouseEnter={() => setActiveSection(sec.id)}
                className="bg-white border-3 border-foreground rounded-3xl p-5 md:p-6 shadow-[6px_6px_0px_#000] relative overflow-hidden transition-all duration-200"
              >
                {/* Visual Neobrutalist Sticker Badge */}
                <div className="absolute top-4 right-4 flex items-center gap-1.5">
                  <span className={`text-[10px] font-bold px-2 py-0.5 border border-foreground rounded-full shadow-[1px_1px_0px_#000] rotate-[-2deg] ${sec.color}`}>
                    {sec.badge}
                  </span>
                </div>

                <h3 className="font-caveat text-2xl font-bold text-slate-800 mb-4 border-b border-dashed border-foreground/20 pb-2 pr-24">
                  {sec.title}
                </h3>
                
                <div className="text-slate-700">
                  {sec.content}
                </div>
              </section>
            ))}

            {filteredSections.length === 0 && (
              <div className="bg-white border-3 border-foreground rounded-3xl p-10 text-center shadow-[6px_6px_0px_#000] space-y-4">
                <img 
                  src="https://api.dicebear.com/7.x/open-peeps/svg?seed=oops-terms" 
                  alt="No results avatar" 
                  className="size-36 mx-auto animate-bounce opacity-80" 
                />
                <h4 className="font-caveat text-2xl font-bold text-slate-800">No Terms Found</h4>
                <p className="text-sm font-patrick-hand text-muted-foreground max-w-sm mx-auto">
                  We couldn't find any terms for "{searchQuery}". Try searching for terms like "refund", "suspend", or "abuse".
                </p>
                <Button 
                  onClick={() => setSearchQuery("")} 
                  variant="outline" 
                  className="border-2 border-foreground font-bold h-9 text-xs"
                >
                  Clear Search
                </Button>
              </div>
            )}
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
