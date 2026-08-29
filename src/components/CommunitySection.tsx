"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CommunitySection() {
  return (
    <section className="relative z-10 py-16 md:py-24 px-4 sm:px-6 bg-[#FFFFFF]">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-2xl overflow-hidden border border-[#E7E7EB] bg-[#FFFFFF] shadow-sm"
        >
          {/* ✅ Image horizontale pleine largeur, personnes africaines, sans superposition */}
          <div className="relative w-full aspect-[16/9] md:aspect-[2/1] bg-[#F7F7F8]">
            <Image
              src="https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?auto=format&fit=crop&w=1200&h=600&q=80"
              alt="Entrepreneurs africains en collaboration"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* ✅ Bloc texte juste en bas, épuré, sans bulles ni avatars */}
          <div className="p-6 sm:p-8 md:p-10 text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#18181B] mb-4 leading-tight">
              Rejoignez la communauté des entrepreneurs qui passent à l'action.
            </h2>
            <p className="text-sm sm:text-base text-[#71717A] max-w-2xl leading-relaxed mb-8 mx-auto md:mx-0">
              Échangez des stratégies, obtenez des retours en temps réel et réseautez avec des pairs qui scalent leur business en Afrique, exactement comme vous.
            </p>
            
            <div className="flex justify-center md:justify-start">
              <Link 
                href="https://t.me/MakeItAds_Pro" 
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 rounded-lg bg-[#6366F1] px-6 py-3 text-sm font-semibold text-white hover:bg-[#5558e6] transition-colors shadow-sm shadow-[#6366F1]/20"
              >
                Rejoindre le canal Telegram
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}