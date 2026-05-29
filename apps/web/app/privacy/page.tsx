"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { useUser } from "~/hooks/api/auth";
import { Button } from "~/components/ui/button";
import {
  ArrowLeft,
  ArrowRight,
  Search,
  Shield,
  Mail,
  Cookie,
  Database,
  UserCheck,
  HelpCircle,
  AlertTriangle,
  Lock
} from "lucide-react";
import { Footer } from "~/components/home/footer";

interface PolicySection {
  id: string;
  title: string;
  badge: string;
  color: string;
  content: React.ReactNode;
  keywords: string[];
}

export default function PrivacyPolicyPage() {
  const { user, isLoading } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSection, setActiveSection] = useState("intro");

  const sections: PolicySection[] = useMemo(() => [
    {
      id: "intro",
      title: "1. Introduction",
      badge: "Welcome",
      color: "bg-pastel-blue",
      keywords: ["introduction", "welcome", "agreement", "consent", "platform", "pratikriya"],
      content: (
        <div className="space-y-3 font-patrick-hand text-base leading-relaxed">
          <p>
            Welcome to <strong>Pratikriya Forms</strong>! We build playful, hand-drawn form solutions to help you collect and manage feedback.
          </p>
          <p>
            Your privacy is extremely important to us. This Privacy Policy explain how we collect, use, and protect your personal information when you use our platform.
          </p>
          <p className="bg-pastel-blue/20 p-3 rounded-xl border border-dashed border-primary">
            By accessing or using Pratikriya Forms, you acknowledge and agree that you have read, understood, and consent to the collection and processing of your data as outlined in this policy.
          </p>
        </div>
      )
    },
    {
      id: "collect",
      title: "2. Information We Collect",
      badge: "Data Collection",
      color: "bg-pastel-pink",
      keywords: ["collect", "account", "email", "profile", "password", "google", "github", "oauth", "form data", "ip address", "cookies"],
      content: (
        <div className="space-y-4 font-patrick-hand text-base">
          <p>We collect several types of information to provide you with a smooth and secure form-building experience:</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="border-2 border-foreground p-3.5 rounded-xl bg-white shadow-[2px_2px_0px_#000]">
              <h5 className="font-bold font-caveat text-lg text-primary mb-1">Account Details</h5>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Full Name / Display Name</li>
                <li>Email Address (for logins & updates)</li>
                <li>Profile Picture (via OAuth/Gravatar)</li>
                <li>Encrypted passwords (hashed using bcrypt)</li>
              </ul>
            </div>

            <div className="border-2 border-foreground p-3.5 rounded-xl bg-white shadow-[2px_2px_0px_#000]">
              <h5 className="font-bold font-caveat text-lg text-secondary mb-1">Auth & OAuth Data</h5>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Google login integration tokens</li>
                <li>GitHub login integration tokens</li>
                <li>OAuth account basic profile metadata</li>
              </ul>
            </div>

            <div className="border-2 border-foreground p-3.5 rounded-xl bg-white shadow-[2px_2px_0px_#000]">
              <h5 className="font-bold font-caveat text-lg text-accent mb-1">Form & Response Data</h5>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Forms created (schemas, questions, layouts)</li>
                <li>Answers & response submissions received</li>
                <li>User-uploaded files attached to form fields</li>
              </ul>
            </div>

            <div className="border-2 border-foreground p-3.5 rounded-xl bg-white shadow-[2px_2px_0px_#000]">
              <h5 className="font-bold font-caveat text-lg text-yellow-600 mb-1">Technical & Usage logs</h5>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>IP Address & geolocation approximations</li>
                <li>Browser types & device specifications</li>
                <li>Session activity, page views, and click records</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "use",
      title: "3. How We Use Your Information",
      badge: "Processing",
      color: "bg-pastel-yellow",
      keywords: ["use", "purpose", "processing", "improvement", "account", "support", "fraud", "analytics"],
      content: (
        <div className="space-y-3 font-patrick-hand text-base">
          <p>We process your data to fulfill our services and protect our platform. Specifically, we use it to:</p>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <span className="inline-flex size-5 rounded-full bg-emerald-100 border border-emerald-500 text-emerald-700 items-center justify-center shrink-0 font-bold text-xs mt-0.5">✓</span>
              <span>Create and manage your user account.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="inline-flex size-5 rounded-full bg-emerald-100 border border-emerald-500 text-emerald-700 items-center justify-center shrink-0 font-bold text-xs mt-0.5">✓</span>
              <span>Deliver, customize, and improve the form-building platform and submissions dashboard.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="inline-flex size-5 rounded-full bg-emerald-100 border border-emerald-500 text-emerald-700 items-center justify-center shrink-0 font-bold text-xs mt-0.5">✓</span>
              <span>Process form submissions and forward response webhook notifications.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="inline-flex size-5 rounded-full bg-emerald-100 border border-emerald-500 text-emerald-700 items-center justify-center shrink-0 font-bold text-xs mt-0.5">✓</span>
              <span>Monitor analytics to detect performance bottlenecks or scale resources.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="inline-flex size-5 rounded-full bg-emerald-100 border border-emerald-500 text-emerald-700 items-center justify-center shrink-0 font-bold text-xs mt-0.5">✓</span>
              <span>Identify and block malicious behavior, automated spam submission bots, and security vulnerabilities.</span>
            </li>
          </ul>
        </div>
      )
    },
    {
      id: "cookies",
      title: "4. Cookies & Tracking",
      badge: "Cookies",
      color: "bg-orange-100",
      keywords: ["cookies", "tracking", "session", "essential", "analytics", "opt-out"],
      content: (
        <div className="space-y-3 font-patrick-hand text-base">
          <p>
            We use cookies to maintain your authentication sessions, store visual preferences, and gather basic anonymous performance metrics.
          </p>
          <div className="border-3 border-foreground rounded-2xl overflow-hidden shadow-[2px_2px_0px_#000]">
            <table className="w-full text-left border-collapse text-xs md:text-sm">
              <thead>
                <tr className="bg-slate-100 border-b-2 border-foreground font-bold">
                  <th className="p-2 border-r border-foreground">Cookie Category</th>
                  <th className="p-2">Role & Purpose</th>
                </tr>
              </thead>
              <tbody className="divide-y border-foreground bg-white">
                <tr>
                  <td className="p-2 border-r border-foreground font-bold">Essential & Session</td>
                  <td className="p-2">Keeps you signed in between page loads. Required for basic security and core dashboard components.</td>
                </tr>
                <tr>
                  <td className="p-2 border-r border-foreground font-bold">Performance & Analytics</td>
                  <td className="p-2">Collects anonymized page visitor tracking to monitor server speeds and page errors.</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground pt-1">
            You can block cookies in your browser settings. However, disabling essential cookies will prevent you from signing in to the dashboard.
          </p>
        </div>
      )
    },
    {
      id: "sharing",
      title: "5. Data Sharing & Third Parties",
      badge: "Sharing Limits",
      color: "bg-emerald-100",
      keywords: ["sharing", "third party", "sell data", "google auth", "github auth", "hosting", "database", "legal"],
      content: (
        <div className="space-y-3 font-patrick-hand text-base">
          <p className="font-bold text-slate-800">
            We do NOT sell, rent, or trade your personal data to ad networks or third-party marketers.
          </p>
          <p>We only share data with essential backend services required to run Pratikriya:</p>
          <ul className="list-disc list-inside space-y-1 text-sm pl-2 text-muted-foreground">
            <li><strong>Cloud Hosting Providers:</strong> AWS / Vercel to host page data and form files.</li>
            <li><strong>Authentication Providers:</strong> Google and GitHub for single sign-on security.</li>
            <li><strong>Database Services:</strong> PostgreSQL databases to store schemas and submissions.</li>
            <li><strong>Legal Compliance:</strong> When required under local law to address policy abuse or law enforcement requests.</li>
          </ul>
        </div>
      )
    },
    {
      id: "security",
      title: "6. Data Storage & Security",
      badge: "Security",
      color: "bg-red-100",
      keywords: ["security", "storage", "encryption", "https", "hashing", "database", "access controls"],
      content: (
        <div className="space-y-3 font-patrick-hand text-base">
          <p>
            We enforce robust technical security protocols to protect your accounts and prevent unauthorized data modifications:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div className="p-3 border-2 border-foreground rounded-xl bg-white shadow-[2px_2px_0px_#000]">
              <div className="font-bold text-sm mb-1 text-red-600 flex items-center gap-1"><Lock className="size-3.5" /> HTTPS SSL</div>
              <p className="text-xs text-muted-foreground">All connections and form data payloads are encrypted in transit via SSL protocols.</p>
            </div>
            <div className="p-3 border-2 border-foreground rounded-xl bg-white shadow-[2px_2px_0px_#000]">
              <div className="font-bold text-sm mb-1 text-red-600 flex items-center gap-1"><Shield className="size-3.5" /> Password Hashes</div>
              <p className="text-xs text-muted-foreground">User passwords are hashed with salts before storing in databases, preventing plain text exposure.</p>
            </div>
            <div className="p-3 border-2 border-foreground rounded-xl bg-white shadow-[2px_2px_0px_#000]">
              <div className="font-bold text-sm mb-1 text-red-600 flex items-center gap-1"><Database className="size-3.5" /> DB Protections</div>
              <p className="text-xs text-muted-foreground">Database nodes are protected behind strict VPC access firewall rules and connection tokens.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "rights",
      title: "7. Your Rights & Options",
      badge: "User Rights",
      color: "bg-purple-100",
      keywords: ["rights", "delete account", "export data", "update profile", "privacy rights"],
      content: (
        <div className="space-y-3 font-patrick-hand text-base">
          <p>We respect your ownership over your data. You hold the following capabilities:</p>
          <ul className="list-disc list-inside space-y-1 text-sm pl-2 text-muted-foreground font-patrick-hand">
            <li><strong>Inspect Data:</strong> Review all submissions and form layouts on your dashboard.</li>
            <li><strong>Modify Data:</strong> Edit profile credentials and form definitions inside settings.</li>
            <li><strong>Delete Forms:</strong> Delete individual forms and historical responses instantly.</li>
            <li><strong>Account Deletion:</strong> Terminate your account completely, which schedules complete removal of associated form databases.</li>
            <li><strong>Data Export:</strong> Download form submissions in structured JSON/CSV formatting.</li>
          </ul>
        </div>
      )
    },
    {
      id: "retention",
      title: "8. Data Retention Policy",
      badge: "Retention",
      color: "bg-blue-100",
      keywords: ["retention", "period", "duration", "account existence", "backups"],
      content: (
        <div className="space-y-3 font-patrick-hand text-base">
          <p>
            We retain account data as long as your account remains active. Once you initiate account deletion:
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm pl-2 text-muted-foreground">
            <li>Your account, forms, and responses are marked for removal.</li>
            <li>Complete purging from live databases occurs within 30 business days.</li>
            <li>Encrypted temporary daily backups are retained for up to 90 days before permanent overwrite cycle.</li>
          </ul>
        </div>
      )
    },
    {
      id: "children",
      title: "9. Children's Privacy Guidelines",
      badge: "Children",
      color: "bg-pink-100",
      keywords: ["children", "under 13", "coppa", "parental consent"],
      content: (
        <div className="space-y-2 font-patrick-hand text-base">
          <p>
            Pratikriya Forms does not intentionally harvest data from children under the age of 13.
          </p>
          <p className="bg-yellow-50 p-2.5 rounded-xl border border-yellow-300 text-xs text-yellow-800 flex items-start gap-2">
            <AlertTriangle className="size-4 shrink-0 mt-0.5" />
            <span>If we discover that a user under 13 has submitted credentials without verified parental consent, we will delete that account immediately.</span>
          </p>
        </div>
      )
    },
    {
      id: "changes",
      title: "10. Policy Changes & Updates",
      badge: "Policy Changes",
      color: "bg-teal-100",
      keywords: ["changes", "updates", "modification", "notice", "notify"],
      content: (
        <div className="space-y-2 font-patrick-hand text-base">
          <p>
            We may adjust this policy occasionally to align with database updates or legal demands.
          </p>
          <p>
            For minor changes, we will adjust the "Last Updated" timestamp at the top. For major changes affecting data sharing or storage, we will send an email update or add a prominent dashboard notification.
          </p>
        </div>
      )
    },
    {
      id: "contact",
      title: "11. Contact & Support",
      badge: "Contact",
      color: "bg-pastel-yellow",
      keywords: ["contact", "support", "email", "owner", "query"],
      content: (
        <div className="space-y-3 font-patrick-hand text-base">
          <p>For questions or assistance regarding your account data, reach out directly:</p>
          <div className="p-4 border-2 border-foreground rounded-2xl bg-white shadow-[2px_2px_0px_#000] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase">Support Email</p>
              <p className="text-lg font-bold text-slate-800">kishangupta.code@gmail.com</p>
            </div>
            <Button asChild className="border-2 border-foreground shadow-[2px_2px_0px_#000] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all text-xs font-bold bg-pastel-pink text-[#2d2638] rounded-xl h-9">
              <Link href="/contact">Go to Contact Page</Link>
            </Button>
          </div>
        </div>
      )
    },
    {
      id: "gdpr",
      title: "12. Modern SaaS: GDPR & Cookie Compliance",
      badge: "SaaS / GDPR",
      color: "bg-indigo-100",
      keywords: ["gdpr", "saas", "cookie policy", "dpa", "ai usage", "refund", "content moderation", "eu citizens"],
      content: (
        <div className="space-y-4 font-patrick-hand text-base">
          <div className="p-3 border border-foreground/20 rounded-xl bg-white/50">
            <h6 className="font-bold text-sm mb-1 text-primary">GDPR & UK GDPR</h6>
            <p className="text-xs text-muted-foreground leading-relaxed">
              For users in the European Union, we serve as the "data processor" for form submissions you receive, and "data controller" for account data. You possess rights to object to processing, request data portability, and file regulator complaints.
            </p>
          </div>

          <div className="p-3 border border-foreground/20 rounded-xl bg-white/50">
            <h6 className="font-bold text-sm mb-1 text-secondary">AI Usage Policy</h6>
            <p className="text-xs text-muted-foreground leading-relaxed">
              If you utilize our optional AI form generation assistant tools, your prompts are processed securely. Your form submission response data is NOT used to train third-party AI models.
            </p>
          </div>

          <div className="p-3 border border-foreground/20 rounded-xl bg-white/50">
            <h6 className="font-bold text-sm mb-1 text-accent">Refund Policy</h6>
            <p className="text-xs text-muted-foreground leading-relaxed">
              We offer a 14-day refund window on paid subscription plans if you are unsatisfied. Refund requests can be filed by emailing our support team.
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
          <div className="inline-flex size-14 items-center justify-center rounded-full bg-pastel-pink border-3 border-foreground shadow-[3px_3px_0px_#000] mb-2 rotate-[-6deg]">
            <Shield className="size-7 text-foreground" />
          </div>
          <h1 className="text-4xl md:text-5xl font-caveat font-extrabold text-slate-800">
            Privacy Policy
          </h1>
          <p className="text-base text-slate-600 font-patrick-hand max-w-md mx-auto">
            Your data belongs to you. Here's a transparent guide explaining how we collect, store, and process data on Pratikriya.
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
            placeholder="Search privacy topics (e.g. 'cookies', 'delete')..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-10 pr-4 bg-white border-3 border-foreground rounded-2xl text-sm text-slate-800 placeholder-slate-500 shadow-[3px_3px_0px_#000] focus:shadow-none focus:translate-x-[1.5px] focus:translate-y-[1.5px] outline-none transition-all font-patrick-hand font-medium"
          />
        </div>

        {/* Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8 items-start">

          {/* Index Sidebar - Sticky on desktop, hidden on mobile queries */}
          <aside className="hidden lg:block sticky top-24 bg-white border-3 border-foreground rounded-2xl p-4 shadow-[4px_4px_0px_#000] space-y-3 shrink-0">
            <h4 className="font-caveat text-lg font-bold border-b-2 border-foreground/10 pb-1 text-slate-700">
              Policy Sections
            </h4>
            <nav className="flex flex-col gap-1.5 max-h-[400px] overflow-y-auto scrollbar-thin">
              {filteredSections.map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => {
                    setActiveSection(sec.id);
                    document.getElementById(sec.id)?.scrollIntoView({ behavior: "smooth", block: "center" });
                  }}
                  className={`text-left text-xs font-patrick-hand font-bold px-2.5 py-1.5 rounded-lg border transition-all truncate ${activeSection === sec.id
                      ? "bg-pastel-yellow border-foreground border-2 shadow-[1.5px_1.5px_0px_#000] text-foreground"
                      : "border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                    }`}
                >
                  {sec.title}
                </button>
              ))}
              {filteredSections.length === 0 && (
                <span className="text-[10px] text-muted-foreground font-patrick-hand">No sections found</span>
              )}
            </nav>
          </aside>

          {/* Notepad Policy Body */}
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
                  <span className={`text-[10px] font-bold px-2 py-0.5 border border-foreground rounded-full shadow-[1px_1px_0px_#000] rotate-2 ${sec.color}`}>
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
                  src="https://api.dicebear.com/7.x/open-peeps/svg?seed=oops"
                  alt="No results avatar"
                  className="size-36 mx-auto animate-bounce opacity-80"
                />
                <h4 className="font-caveat text-2xl font-bold text-slate-800">No Privacy Sections Found</h4>
                <p className="text-sm font-patrick-hand text-muted-foreground max-w-sm mx-auto">
                  We couldn't find any policy matches for "{searchQuery}". Try searching for terms like "cookies", "delete", or "sharing".
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
