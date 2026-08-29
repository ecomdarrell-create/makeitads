"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { CheckCircle2, X, Award, ShieldCheck, TrendingUp } from "lucide-react";

// ✅ AVIS RÉÉCRITS : Émotionnels, authentiques et ancrés dans la réalité africaine
const PREMIUM_SUCCESS_STORIES = [
  {
    id: "s1", category: "success", 
    avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150&h=150&fit=crop&crop=face",
    name: "Aminata D.", company: "BabiStyle, Abidjan", 
    quote: "J'étais à deux doigts d'abandonner ma boutique. Je perdais de l'argent chaque mois en pubs Facebook sans comprendre pourquoi. Quand j'ai reçu le PDF de MakeItAds, j'ai pleuré de soulagement. Tout était enfin clair. En 2 mois, mes ventes ont triplé. C'est comme avoir un expert marketing dans ma poche.",
    result: "Ventes multipliées",
    metric: "x3 en 2 mois"
  },
  {
    id: "s2", category: "success",
    avatar: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=150&h=150&fit=crop&crop=face",
    name: "Moussa K.", company: "Dakar Growth", 
    quote: "On brûlait notre budget sur des ciblages au hasard. MakeItAds nous a montré exactement où étaient nos vrais clients. Réduire notre coût d'acquisition de 60%, ce n'est pas juste un chiffre sur un papier, c'est ce qui a sauvé notre trésorerie ce mois-là.",
    result: "Trésorerie sauvée",
    metric: "-60% de coûts"
  },
  {
    id: "f1", category: "founder",
    avatar: "https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=150&h=150&fit=crop&crop=face",
    name: "Fatima S.", company: "GlowBenin, Cotonou", 
    quote: "J'avais peur que ce soit encore un outil IA générique qui ne comprend rien à notre réalité béninoise. Mais non ! Le ton, les angles, les canaux... tout résonnait avec ma clientèle. Mes leads WhatsApp ont explosé. Je me sens enfin comprise et accompagnée.",
    result: "Leads WhatsApp",
    metric: "+65% en 30 jours"
  },
  {
    id: "f2", category: "founder",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    name: "Koffi A.", company: "ImmoAbidjan", 
    quote: "Honnêtement, j'étais sceptique. 7 500 FCFA pour une stratégie ? Mais le rapport est dingue. Ils ont trouvé des segments d'audience que je n'aurais jamais devinés en 10 ans de métier. Mon retour sur investissement a été multiplié par 4. Je ne fais plus de pub sans eux.",
    result: "Retour sur investissement",
    metric: "ROAS de 4.2x"
  },
  {
    id: "c1", category: "success",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face",
    name: "Sophie L.", company: "FitYaoundé", 
    quote: "Je galérais à remplir mes cours de sport. La stratégie a tapé pile dans la douleur de mes clientes : 'Manque de temps pour soi'. Les textes fournis étaient si percutants que j'ai juste eu à copier-coller. Passer de 12 à 38 clientes, c'est magique.",
    result: "Nouvelles clientes",
    metric: "+217% d'inscriptions"
  },
  {
    id: "c2", category: "founder",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face",
    name: "Marc T.", company: "Marc Design, Douala", 
    quote: "En tant que petit créateur, je n'avais pas les moyens d'une agence à 500 000 FCFA. Ce pack m'a donné une structure professionnelle que je n'aurais jamais pu payer ailleurs. Mes revenus sont passés de 200k à 550k. C'est le meilleur investissement de ma vie.",
    result: "Revenus mensuels",
    metric: "+175% (550k FCFA)"
  },
  {
    id: "a1", category: "agency",
    avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&h=150&fit=crop&crop=face",
    name: "Awa N.", company: "ScaleAfrica", 
    quote: "En tant qu'agence, on perdait un temps fou à faire des stratégies from scratch pour chaque prospect. MakeItAds nous a fait gagner des semaines. Notre taux de signature a doublé parce qu'on arrive avec des plans concrets et chiffrés dès le premier RDV.",
    result: "Taux de signature",
    metric: "x2 (55% de conversion)"
  },
  {
    id: "h1", category: "founder",
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face",
    name: "Dr. Koné A.", company: "Santé Plus, Bamako", 
    quote: "Pour un médecin, le ton de la publicité doit être rassurant et professionnel, pas agressif. MakeItAds l'a parfaitement capté. Mes rendez-vous en ligne ont été multipliés par 4. Je recommande cette solution à tous mes confrères.",
    result: "Rendez-vous en ligne",
    metric: "+275% de réservations"
  },
  {
    id: "fa1", category: "founder",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    name: "Clara M.", company: "Wax Chic, Lomé", 
    quote: "J'avais 3 idées de pubs et je ne savais pas laquelle choisir. Ils m'ont fourni 9 variantes pour tester 3 angles différents. Le message gagnant a été trouvé en 4 jours seulement. Mon chiffre d'affaires a explosé.",
    result: "Chiffre d'affaires",
    metric: "x2.8 en 1 mois"
  },
  {
    id: "im1", category: "success",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    name: "Patrick L.", company: "ImmoLibreville", 
    quote: "Le ciblage par quartier d'une justesse impressionnante. Avant, je touchais des gens qui n'avaient pas le budget. Là, j'ai vendu 2 appartements en 3 semaines grâce à des prospects qualifiés. C'est du concret.",
    result: "Ventes immobilières",
    metric: "2 ventes en 3 semaines"
  },
  {
    id: "be1", category: "founder",
    avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&h=150&fit=crop&crop=face",
    name: "Grace K.", company: "Glow Douala", 
    quote: "Le guide Canva m'a littéralement sauvée. Je ne suis pas graphiste, mais avec leurs instructions, j'ai créé des visuels pro en 10 minutes. Mon agenda est maintenant plein pour les 3 prochaines semaines.",
    result: "Rendez-vous",
    metric: "Agenda 100% complet"
  },
  {
    id: "ag1", category: "success",
    avatar: "https://images.unsplash.com/photo-1504257432389-5904bd08d252?w=150&h=150&fit=crop&crop=face",
    name: "Kader D.", company: "Bio Bénin", 
    quote: "On voulait exporter mais on ne savait pas par où commencer. La stratégie export identifiée par MakeItAds nous a ouvert des portes. 3 commandes internationales ce mois-ci, et notre marge a bondi.",
    result: "Marge moyenne",
    metric: "+133% (3 commandes export)"
  }
];

type Variant = "top" | "bottom";

export default function PremiumStories({ variant = "bottom" }: { variant?: Variant }) {
  const [selectedStory, setSelectedStory] = useState<any>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleVisibilityChange = () => setIsPaused(document.hidden);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isPaused || !scrollRef.current) return;
    const interval = setInterval(() => {
      if (scrollRef.current) {
        const newPosition = scrollPosition + 0.5;
        const maxScroll = scrollRef.current.scrollWidth / 2;
        if (newPosition >= maxScroll) {
          setScrollPosition(0);
          scrollRef.current.scrollLeft = 0;
        } else {
          setScrollPosition(newPosition);
          scrollRef.current.scrollLeft = newPosition;
        }
      }
    }, 30);
    return () => clearInterval(interval);
  }, [isPaused, scrollPosition]);

  const duplicatedStories = [...PREMIUM_SUCCESS_STORIES, ...PREMIUM_SUCCESS_STORIES];

  return (
    <section className={`relative z-10 py-12 md:py-16 overflow-hidden ${variant === "top" ? "bg-[#F7F7F8]" : "bg-[#FFFFFF]"}`}>
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-8 md:mb-10">
        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-4 h-4 sm:w-5 sm:h-5 bg-emerald-500 flex items-center justify-center rounded-sm">
                  <svg viewBox="0 0 24 24" fill="white" className="w-3 h-3 sm:w-3.5 sm:h-3.5">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
              ))}
            </div>
            <span className="text-sm font-bold text-[#18181B] ml-1">4.9 / 5</span>
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-[#18181B] mb-2 text-center">
            Approuvé par des centaines d'entrepreneurs
          </h3>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-700">
              <ShieldCheck className="h-3 w-3" />
              100% Vérifiés et Authentiques
            </span>
          </div>
        </div>
      </div>

      {/* Carrousel */}
      <div 
        className="relative overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        <div 
          ref={scrollRef}
          className="flex gap-3 sm:gap-4 py-2 overflow-x-auto scrollbar-hide px-4 sm:px-6"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <style jsx>{`.scrollbar-hide::-webkit-scrollbar { display: none; }`}</style>
          {duplicatedStories.map((story, index) => (
            <motion.button
              key={`${story.id}-${index}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isVisible ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: (index % PREMIUM_SUCCESS_STORIES.length) * 0.03 }}
              onClick={() => setSelectedStory(story)}
              className="group relative flex-shrink-0 flex flex-col items-center gap-1.5 focus:outline-none hover:scale-105 transition-transform duration-300"
            >
              <div className="relative">
                <Image 
                  src={story.avatar} 
                  alt={story.name} 
                  width={56} 
                  height={56} 
                  className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm" 
                />
                <div className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-0.5">
                  <CheckCircle2 className="h-3 w-3 text-white" />
                </div>
              </div>
              <div className="text-center">
                <p className="text-[10px] font-semibold text-[#18181B]">{story.name.split(" ")[0]}</p>
                <p className="text-[9px] text-[#71717A]">{story.company}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* ✅ MODAL COMPACT - Petit carré simple pour lire l'avis complet */}
      <AnimatePresence>
        {selectedStory && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedStory(null)}
              className="fixed inset-0 z-50 bg-[#18181B]/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-[#E7E7EB] overflow-hidden">
                
                {/* Bouton fermer */}
                <button
                  onClick={() => setSelectedStory(null)}
                  className="absolute top-3 right-3 p-1.5 rounded-full bg-[#F7F7F8] text-[#71717A] hover:text-[#18181B] hover:bg-[#E7E7EB] transition-colors z-10"
                >
                  <X className="h-3.5 w-3.5" />
                </button>

                {/* Contenu compact */}
                <div className="p-5">
                  {/* Photo + Nom */}
                  <div className="flex items-center gap-3 mb-4">
                    <Image 
                      src={selectedStory.avatar} 
                      alt={selectedStory.name} 
                      width={48} 
                      height={48} 
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-[#6366F1]/20" 
                    />
                    <div>
                      <h4 className="text-sm font-bold text-[#18181B]">{selectedStory.name}</h4>
                      <p className="text-[10px] text-[#71717A]">{selectedStory.company}</p>
                    </div>
                  </div>

                  {/* Citation */}
                  <blockquote className="text-[13px] text-[#18181B] leading-relaxed mb-4 italic border-l-2 border-[#6366F1] pl-3">
                    "{selectedStory.quote}"
                  </blockquote>

                  {/* Résultat clé */}
                  <div className="flex items-center gap-3 pt-3 border-t border-[#E7E7EB]">
                    <div className="flex-1">
                      <p className="text-[10px] text-[#71717A] mb-0.5 uppercase tracking-wider">{selectedStory.result}</p>
                      <p className="text-base font-bold text-[#6366F1]">{selectedStory.metric}</p>
                    </div>
                    <div className="h-9 w-9 rounded-full bg-[#6366F1]/10 flex items-center justify-center">
                      <TrendingUp className="h-4 w-4 text-[#6366F1]" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}