"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Mail, MessageSquare, Send, CheckCircle2 } from "lucide-react";
import { sendContactMessage } from "./actions";
import { Footer } from "~/components/home/footer";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("message", message);

    const result = await sendContactMessage(formData);
    
    setIsSubmitting(false);
    if (result.success) {
      setIsSuccess(true);
      setName("");
      setEmail("");
      setMessage("");
      setTimeout(() => setIsSuccess(false), 5000);
    } else {
      setErrorMsg(result.error || "Failed to send message.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center py-16 px-6 relative overflow-hidden">
        <div className="w-full max-w-4xl z-10 space-y-6">
        <div className="text-center space-y-2">
          <Link href="/" className="text-sm font-bold text-primary font-patrick-hand hover:underline decoration-wavy underline-offset-4">
            &larr; Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-caveat font-bold text-slate-800">
            Let's Talk!
          </h1>
          <p className="text-base text-slate-600 font-patrick-hand max-w-lg mx-auto">
            Have a question, feedback, or just want to say hi? We'd love to hear from you. Drop us a message below.
          </p>
        </div>

        <div className="grid md:grid-cols-[1fr_1.5fr] gap-6">
          {/* Contact Info Card */}
          <div className="bg-white border-4 border-foreground shadow-[8px_8px_0px_#2d2638] rounded-3xl p-6 rotate-[-1deg] flex flex-col gap-6 h-fit">
            <div>
              <h3 className="text-xl font-bold font-caveat tracking-wider text-slate-800 mb-4">Contact the Owner</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-full bg-pastel-yellow border-2 border-foreground flex items-center justify-center shrink-0">
                    <Mail className="size-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider leading-tight">Email Us</p>
                    <p className="text-xs font-bold text-slate-800">kishangupta.code@gmail.com</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-full bg-pastel-pink border-2 border-foreground flex items-center justify-center shrink-0">
                    <MessageSquare className="size-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider leading-tight">Socials</p>
                    <p className="text-xs font-bold text-slate-800">@pratikriya_app</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-auto pt-4 border-t-2 border-dashed border-slate-200">
              <p className="text-xs font-patrick-hand text-slate-500 text-center">
                We usually respond within 24 hours!
              </p>
            </div>
          </div>

          {/* Contact Form Card */}
          <div className="bg-white border-4 border-foreground shadow-[8px_8px_0px_#2d2638] rounded-3xl p-6 rotate-[1deg]">
            <h3 className="text-xl font-bold font-caveat tracking-wider text-slate-800 mb-4">Send a Message</h3>
            
            {isSuccess ? (
              <div className="bg-green-50 border-2 border-green-500 rounded-2xl p-6 flex flex-col items-center justify-center text-center h-[280px]">
                <CheckCircle2 className="size-12 text-green-500 mb-3" />
                <h4 className="text-xl font-bold font-caveat text-green-800">Message Sent!</h4>
                <p className="text-xs font-semibold text-green-700 mt-2">Thanks for reaching out. We'll get back to you soon.</p>
              </div>
            ) : (
              <form className="space-y-3" onSubmit={handleSubmit}>
                {errorMsg && (
                  <div className="p-2 bg-red-50 text-red-600 text-xs font-bold border border-red-200 rounded-lg">
                    {errorMsg}
                  </div>
                )}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Your Name</label>
                  <Input 
                    placeholder="e.g. John Doe" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={isSubmitting}
                    className="bg-slate-50 border-2 border-slate-200 focus:border-[#7b61ff] rounded-xl h-10 px-3 text-xs font-semibold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Email Address</label>
                  <Input 
                    type="email"
                    placeholder="e.g. john@example.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isSubmitting}
                    className="bg-slate-50 border-2 border-slate-200 focus:border-[#7b61ff] rounded-xl h-10 px-3 text-xs font-semibold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Message</label>
                  <Textarea 
                    placeholder="How can we help you?" 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    disabled={isSubmitting}
                    className="bg-slate-50 border-2 border-slate-200 focus:border-[#7b61ff] rounded-xl p-3 text-xs font-semibold min-h-[80px]"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-[#7b61ff] hover:bg-[#684ff0] text-white font-bold h-10 rounded-xl text-base border-2 border-foreground shadow-[4px_4px_0px_#2d2638] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all flex items-center justify-center gap-2 mt-3 disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:translate-x-0 disabled:hover:shadow-[4px_4px_0px_#2d2638]"
                >
                  {isSubmitting ? "Sending..." : "Send Message"} {!isSubmitting && <Send className="size-4" />}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
      </div>
      <Footer />
    </div>
  );
}
