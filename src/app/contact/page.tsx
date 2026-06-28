"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Building2, 
  Mail, 
  Phone, 
  MessageSquare, 
  Users, 
  Shield, 
  Zap, 
  CheckCircle2, 
  Loader2,
  Globe,
  Clock,
  Award
} from "lucide-react";
import GlobalNavbar from "@/components/shared/GlobalNavbar";
import GlobalFooter from "@/components/shared/GlobalFooter";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    teamSize: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <main className="min-h-screen bg-[#05050a] text-white">
      <GlobalNavbar />

      <div className="pt-28 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-medium text-amber-400 mb-6">
              <Building2 className="h-3.5 w-3.5" />
              Enterprise Solutions
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              Let's build something great together
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Get a personalized demo and discover how MakeItAds can transform your marketing strategy.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column - Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {!submitted ? (
                <div className="rounded-2xl border border-white/10 bg-[#0a0a14] p-8">
                  <h2 className="text-2xl font-bold mb-6">Get in touch</h2>

                  {error && (
                    <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-[#6366f1] transition-colors"
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Work Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-[#6366f1] transition-colors"
                        placeholder="john@company.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Company Name *
                      </label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        required
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-[#6366f1] transition-colors"
                        placeholder="Acme Inc."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-[#6366f1] transition-colors"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Team Size *
                      </label>
                      <select
                        name="teamSize"
                        value={formData.teamSize}
                        onChange={handleChange}
                        required
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-[#6366f1] transition-colors"
                      >
                        <option value="">Select team size</option>
                        <option value="1-10">1-10 employees</option>
                        <option value="11-50">11-50 employees</option>
                        <option value="51-200">51-200 employees</option>
                        <option value="201-500">201-500 employees</option>
                        <option value="500+">500+ employees</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        How can we help? *
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={4}
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-[#6366f1] transition-colors resize-none"
                        placeholder="Tell us about your business goals and challenges..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full rounded-xl bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] py-3 text-sm font-bold text-white hover:shadow-lg hover:shadow-[#8b5cf6]/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        "Request a Demo"
                      )}
                    </button>
                  </form>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-12 text-center"
                >
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 mb-6">
                    <CheckCircle2 className="h-8 w-8 text-emerald-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-4">
                    Thank you!
                  </h2>
                  <p className="text-slate-300 mb-6">
                    We've received your message and will get back to you within 24 hours.
                  </p>
                  <p className="text-sm text-slate-400">
                    In the meantime, feel free to explore our{" "}
                    <a href="/pricing" className="text-[#6366f1] hover:underline">
                      pricing plans
                    </a>
                    .
                  </p>
                </motion.div>
              )}
            </motion.div>

            {/* Right Column - Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-6"
            >
              {/* Enterprise Features */}
              <div className="rounded-2xl border border-white/10 bg-[#0a0a14] p-8">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Award className="h-5 w-5 text-amber-400" />
                  Enterprise Features
                </h3>
                <div className="space-y-4">
                  {[
                    { icon: Users, text: "Unlimited team collaboration" },
                    { icon: Shield, text: "Advanced security & compliance" },
                    { icon: Zap, text: "Custom AI model training" },
                    { icon: Globe, text: "Multi-brand management" },
                    { icon: Clock, text: "24/7 priority support" },
                    { icon: MessageSquare, text: "Dedicated account manager" },
                  ].map((feature, i) => {
                    const Icon = feature.icon;
                    return (
                      <div key={i} className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center flex-shrink-0">
                          <Icon className="h-4 w-4 text-amber-400" />
                        </div>
                        <span className="text-sm text-slate-300">{feature.text}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Contact Info */}
              <div className="rounded-2xl border border-white/10 bg-[#0a0a14] p-8">
                <h3 className="text-xl font-bold mb-6">Prefer to talk?</h3>
                <div className="space-y-4">
                  <a
                    href="mailto:enterprise@makeitads.com"
                    className="flex items-center gap-3 text-slate-300 hover:text-white transition-colors"
                  >
                    <Mail className="h-5 w-5 text-[#6366f1]" />
                    <span className="text-sm">enterprise@makeitads.com</span>
                  </a>
                  <a
                    href="tel:+15550000000"
                    className="flex items-center gap-3 text-slate-300 hover:text-white transition-colors"
                  >
                    <Phone className="h-5 w-5 text-[#6366f1]" />
                    <span className="text-sm">+1 (555) 000-0000</span>
                  </a>
                </div>
              </div>

              {/* Response Time */}
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6">
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-emerald-200 mb-1">
                      Fast Response Time
                    </p>
                    <p className="text-xs text-emerald-400/80">
                      Our team typically responds within 24 hours on business days.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <GlobalFooter />
    </main>
  );
}