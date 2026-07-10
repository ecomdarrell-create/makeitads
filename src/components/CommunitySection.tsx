"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Users } from "lucide-react";

export default function CommunitySection() {
  return (
    <section id="community" className="relative z-10 overflow-hidden">
      {/* CONTAINER PLEIN ÉCRAN */}
      <div className="relative min-h-[600px] md:min-h-[700px] flex items-center justify-center px-4 sm:px-6 py-20 md:py-32">
        
        {/* IMAGE DE FOND PLEIN ÉCRAN */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/community-hero.webp"
            alt="The Boardroom - Exclusive Marketing Community"
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
            quality={90}
          />
          {/* Overlay sombre pour lisibilité */}
          <div className="absolute inset-0 bg-[#080810]/60" />
          {/* Gradient pour profondeur */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#080810] via-[#080810]/30 to-[#080810]/50" />
        </div>

        {/* CONTENU CENTRÉ */}
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-md px-4 py-1.5 mb-6">
              <Users className="h-3.5 w-3.5 text-white" />
              <span className="text-xs font-semibold text-white uppercase tracking-wider">
                Private Community
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-white leading-tight">
              Join{" "}
              <span className="bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#38bdf8] bg-clip-text text-transparent">
                The Boardroom
              </span>
            </h2>

            <p className="text-base sm:text-lg md:text-xl text-slate-200 leading-relaxed mb-10 max-w-2xl mx-auto">
              An exclusive circle of founders, marketers and decision-makers. Get the intelligence, strategies and connections that drive real growth.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/community"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#6366f1] px-8 py-4 text-sm font-bold text-white shadow-[0_0_40px_-10px_rgba(99,102,241,0.5)] hover:bg-[#5558e6] transition-all hover:scale-105 w-full sm:w-auto"
              >
                Discover The Boardroom
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <a
                href="https://t.me/makeitads"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm px-8 py-4 text-sm font-semibold text-white hover:bg-white/20 transition-all w-full sm:w-auto"
              >
                Join Telegram
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}