"use client";

import { motion } from "framer-motion";
import { ArrowRight, MapPin, Briefcase, Users } from "lucide-react";
import Link from "next/link";
import GlobalNavbar from "@/components/shared/GlobalNavbar";
import GlobalFooter from "@/components/shared/GlobalFooter";

const jobs = [
  {
    title: "Ingénieur(e) IA & Prompt Engineering",
    department: "Produit & Tech",
    location: "Remote / Afrique",
    type: "Temps plein",
  },
  {
    title: "Growth Marketing Manager",
    department: "Marketing",
    location: "Remote / Afrique",
    type: "Temps plein",
  },
  {
    title: "Customer Success Manager",
    department: "Support Client",
    location: "Remote / Afrique",
    type: "Temps plein",
  },
];

export default function CareersPage() {
  return (
    <main className="min-h-screen bg-[#F7F7F8] text-[#18181B]">
      <GlobalNavbar />

      {/* Hero */}
      <section className="relative z-10 pt-28 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#6366F1]/20 bg-[#6366F1]/5 px-4 py-1.5 text-xs font-medium text-[#6366F1] mb-6">
              <Users className="h-3.5 w-3.5" />
              Nous recrutons
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-[#18181B]">
              Construisez le futur du{" "}
              <span className="text-[#6366F1]">
                marketing en Afrique
              </span>
            </h1>
            <p className="text-lg text-[#71717A] max-w-2xl mx-auto">
              Rejoignez une équipe passionnée qui démocratise l'accès à des stratégies publicitaires de haute qualité pour les entrepreneurs locaux.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Jobs List */}
      <section className="relative z-10 px-6 pb-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-[#18181B] mb-8">Postes ouverts</h2>
          <div className="space-y-4">
            {jobs.map((job, i) => (
              <motion.div
                key={job.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl border border-[#E7E7EB] bg-[#FFFFFF] p-6 hover:border-[#6366F1]/30 hover:shadow-sm transition-all group"
              >
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-[#18181B] mb-2 group-hover:text-[#6366F1] transition-colors">{job.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-[#71717A]">
                      <span className="flex items-center gap-1"><Briefcase className="h-3.5 w-3.5" />{job.department}</span>
                      <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{job.location}</span>
                      <span>{job.type}</span>
                    </div>
                  </div>
                  <Link href="/contact" className="inline-flex items-center gap-2 rounded-full border border-[#E7E7EB] bg-[#FFFFFF] px-5 py-2 text-sm font-semibold text-[#18181B] hover:bg-[#F7F7F8] hover:border-[#6366F1]/30 transition-all">
                    Postuler <ArrowRight className="h-4 w-4" />
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
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-3xl border border-[#E7E7EB] bg-[#FFFFFF] p-12 shadow-sm">
            <h2 className="text-3xl font-bold text-[#18181B] mb-4">Vous ne trouvez pas votre rôle ?</h2>
            <p className="text-[#71717A] mb-6">Nous sommes toujours à la recherche de talents motivés. Envoyez-nous votre CV et vos motivations.</p>
            <Link href="/contact" className="inline-flex items-center gap-2 rounded-full bg-[#6366F1] px-8 py-4 text-sm font-bold text-white hover:bg-[#5558e6] transition-all shadow-sm shadow-[#6366F1]/25">
              Nous contacter <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      <GlobalFooter />
    </main>
  );
}