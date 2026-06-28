"use client";

import { motion } from "framer-motion";
import { ArrowRight, MapPin, Briefcase, Users } from "lucide-react";
import Link from "next/link";
import GlobalNavbar from "@/components/shared/GlobalNavbar";
import GlobalFooter from "@/components/shared/GlobalFooter";

const jobs = [
  {
    title: "Senior Full-Stack Engineer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
  },
  {
    title: "Product Designer",
    department: "Design",
    location: "Remote",
    type: "Full-time",
  },
  {
    title: "Growth Marketing Manager",
    department: "Marketing",
    location: "Remote",
    type: "Full-time",
  },
  {
    title: "Customer Success Manager",
    department: "Customer Success",
    location: "Remote",
    type: "Full-time",
  },
];

export default function CareersPage() {
  return (
    <main className="min-h-screen bg-[#080810] text-white">
      <GlobalNavbar />

      {/* Hero */}
      <section className="relative z-10 pt-28 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#6366f1]/30 bg-[#6366f1]/10 px-4 py-1.5 text-xs font-medium text-[#a5b4fc] mb-6">
              <Users className="h-3.5 w-3.5" />
              We're Hiring
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Build the future of{" "}
              <span className="bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#38bdf8] bg-clip-text text-transparent">
                marketing intelligence
              </span>
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Join our team of passionate builders and help democratize AI-powered marketing for businesses worldwide.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Jobs List */}
      <section className="relative z-10 px-6 pb-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-8">Open Positions</h2>
          <div className="space-y-4">
            {jobs.map((job, i) => (
              <motion.div
                key={job.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl border border-white/10 bg-[#0f0f1a] p-6 hover:border-[#6366f1]/30 transition-all group"
              >
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#8b5cf6] transition-colors">{job.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-slate-400">
                      <span className="flex items-center gap-1"><Briefcase className="h-3.5 w-3.5" />{job.department}</span>
                      <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{job.location}</span>
                      <span>{job.type}</span>
                    </div>
                  </div>
                  <Link href="/contact" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-5 py-2 text-sm font-semibold text-white hover:bg-white/[0.06] transition-all">
                    Apply <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-6 pb-24">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#0f0f1a] to-[#1a1a2e] p-12">
            <h2 className="text-3xl font-bold text-white mb-4">Don't see your role?</h2>
            <p className="text-slate-400 mb-6">We're always looking for talented people. Send us your resume.</p>
            <Link href="/contact" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] px-8 py-4 text-sm font-bold text-white hover:scale-105 transition-all">
              Get in Touch <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      <GlobalFooter />
    </main>
  );
}