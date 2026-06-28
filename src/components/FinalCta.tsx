"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export default function FinalCta() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setEmail("");
    }, 1500);
  };

  return (
    <motion.section
      id="try-now"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.65 }}
      className="relative overflow-hidden border-t border-white/5 bg-[#080810] py-24"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(99,102,241,0.16),_transparent_28%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,_rgba(139,92,246,0.1),_transparent_40%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,_rgba(56,189,248,0.08),_transparent_40%)]" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#0f0f1a] to-[#080810] overflow-hidden shadow-[0_40px_120px_rgba(0,0,0,0.4)] backdrop-blur-sm">
          <div className="grid lg:grid-cols-2">
            <div className="relative p-10 lg:p-14 flex flex-col justify-center">
              <div className="absolute -top-20 -left-20 h-60 w-60 rounded-full bg-[#6366f1]/20 blur-3xl" />

              <div className="relative space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <p className="text-sm font-bold uppercase tracking-[0.32em] text-[#8b5cf6]">Ready to launch</p>
                  <h2 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl leading-tight">
                    Your next campaign starts here.
                  </h2>
                </motion.div>

                <motion.p
                  className="max-w-xl text-lg leading-8 text-slate-300"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  Join 12,400+ entrepreneurs who stopped guessing and started growing.
                </motion.p>

                <motion.div
                  className="flex flex-wrap items-center gap-6 pt-4"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-3">
                      <img
                        src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100"
                        alt="User"
                        className="h-10 w-10 rounded-full border-2 border-[#080810] object-cover"
                      />
                      <img
                        src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100"
                        alt="User"
                        className="h-10 w-10 rounded-full border-2 border-[#080810] object-cover"
                      />
                      <img
                        src="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100"
                        alt="User"
                        className="h-10 w-10 rounded-full border-2 border-[#080810] object-cover"
                      />
                    </div>
                    <span className="text-sm font-bold text-slate-300">12,400+ users</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.962a1 1 0 0 0 .95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 0 0-.364 1.118l1.286 3.962c.3.921-.755 1.688-1.54 1.118l-3.385-2.46a1 1 0 0 0-1.176 0l-3.385 2.46c-.784.57-1.838-.197-1.539-1.118l1.286-3.962a1 1 0 0 0-.364-1.118L2.049 9.39c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 0 0 .95-.69l1.286-3.962z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm font-bold text-slate-300">4.9/5 rating</span>
                  </div>
                </motion.div>
              </div>

              <motion.form
                onSubmit={handleSubmit}
                className="mt-10 space-y-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-8 text-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6"
                  >
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-green-500 shadow-lg shadow-emerald-500/30 mb-4">
                      <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-white">You're in!</h3>
                    <p className="mt-2 text-sm text-slate-400">Check your email to get started.</p>
                  </motion.div>
                ) : (
                  <>
                    <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
                      <div className="relative">
                        <svg className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email"
                          required
                          className="w-full rounded-xl border border-white/10 bg-[#0b0b17]/90 pl-12 pr-4 py-4 text-sm text-slate-100 outline-none transition-all focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/20 placeholder:text-slate-600"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] px-6 py-4 text-sm font-bold text-white shadow-lg shadow-[#6366f1]/30 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-[#8b5cf6]/40 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="relative z-10 inline-flex items-center gap-2">
                          {isSubmitting ? (
                            <>
                              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                              </svg>
                              Sending...
                            </>
                          ) : (
                            <>
                              Get started free
                              <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                              </svg>
                            </>
                          )}
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-[#8b5cf6] to-[#38bdf8] opacity-0 transition-opacity group-hover:opacity-100" />
                      </button>
                    </div>
                    <p className="text-xs text-slate-500 text-center">
                      Free forever, No credit card, Cancel anytime
                    </p>
                  </>
                )}
              </motion.form>
            </div>

            <div className="relative hidden lg:block min-h-[500px]">
              <img
                src="https://images.pexels.com/photos/3184423/pexels-photo-3184423.jpeg?auto=compress&cs=tinysrgb&w=1200"
                alt="Entrepreneur working on strategy"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0f0f1a] via-[#0f0f1a]/60 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080810] via-transparent to-transparent" />
              
              <div className="absolute bottom-10 left-10 right-10">
                <div className="grid grid-cols-3 gap-4">
                  <div className="rounded-xl bg-white/10 backdrop-blur-md border border-white/20 p-4">
                    <div className="text-2xl font-bold text-white">+53%</div>
                    <div className="text-xs text-slate-300 mt-1">CTR boost</div>
                  </div>
                  <div className="rounded-xl bg-white/10 backdrop-blur-md border border-white/20 p-4">
                    <div className="text-2xl font-bold text-white">10x</div>
                    <div className="text-xs text-slate-300 mt-1">Faster</div>
                  </div>
                  <div className="rounded-xl bg-white/10 backdrop-blur-md border border-white/20 p-4">
                    <div className="text-2xl font-bold text-white">-40%</div>
                    <div className="text-xs text-slate-300 mt-1">Cost/lead</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}