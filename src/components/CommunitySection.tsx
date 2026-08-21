"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Users, MessageCircle } from "lucide-react";

export default function CommunitySection() {
  return (
    <section className="relative z-10 py-16 md:py-24 px-4 sm:px-6 bg-[#FFFFFF]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-[28px] overflow-hidden border border-[#E7E7EB] bg-[#FFFFFF] shadow-[0_10px_40px_rgba(24,24,27,0.06)]"
        >
          {/* ✅ Image fiable, horizontale et authentique (remplacée pour garantir l'affichage) */}
          <div className="relative w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden bg-[#F7F7F8]">
            <Image
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&h=600&q=80"
              alt="Communauté MakeItAds - Entrepreneurs en collaboration"
              fill
              className="object-cover"
              priority
            />
            {/* Overlay dégradé pour lisibilité du texte (conservé pour le contraste) */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#18181B]/90 via-[#18181B]/40 to-transparent" />
            
            {/* Contenu textuel sur l'image */}
            <div className="absolute bottom-0 left-0 p-6 sm:p-10 md:p-12 w-full">
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-white">
                  <Users className="h-3.5 w-3.5" /> Rejoignez la communauté
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 leading-tight max-w-2xl">
                Rejoignez la communauté des entrepreneurs qui passent à l'action.
              </h2>
              <p className="text-sm sm:text-base text-white/80 max-w-xl leading-relaxed">
                Échangez des stratégies, obtenez des retours en temps réel et réseau avec des pairs qui scalent leur business en Afrique, exactement comme vous.
              </p>
            </div>
          </div>

          {/* Barre d'action en bas */}
          <div className="p-6 sm:p-8 md:p-10 bg-[#FFFFFF] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              {/* Avatars empilés */}
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-[#FFFFFF] bg-[#F7F7F8] flex items-center justify-center overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] opacity-80" />
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 text-sm text-[#71717A]">
                <MessageCircle className="h-4 w-4 text-[#6366F1]" />
                <span className="font-medium">Discussions actives chaque jour</span>
              </div>
            </div>
            
            <Link 
              href="https://t.me/MakeItAds_Pro" 
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-full bg-[#18181B] px-6 py-3 text-sm font-bold text-white hover:bg-[#6366F1] transition-colors shadow-lg shadow-[#18181B]/10"
            >
              Rejoindre le canal Telegram
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}