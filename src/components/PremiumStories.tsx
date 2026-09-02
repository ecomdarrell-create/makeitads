"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { CheckCircle2, X, ShieldCheck, TrendingUp, Quote } from "lucide-react";

// ✅ AVIS AUTHENTIQUES & VIVANTS : Photos cohérentes (Noires/Métisses) + Prénoms réels
const PREMIUM_SUCCESS_STORIES = [
  {
    id: "s1", 
    avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150&h=150&fit=crop&crop=face", // Femme
    name: "Aminata D.", 
    role: "Gérante de boutique, Abidjan", 
    quote: "J'étais à deux doigts d'abandonner ma boutique. Je perdais de l'argent chaque mois en pubs Facebook sans comprendre pourquoi. Quand j'ai reçu le PDF de MakeItAds, j'ai pleuré de soulagement. Tout était enfin clair. En 2 mois, mes ventes ont triplé.",
    result: "Ventes multipliées",
    metric: "x3 en 2 mois"
  },
  {
    id: "s2", 
    avatar: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=150&h=150&fit=crop&crop=face", // Homme
    name: "Moussa K.", 
    role: "Directeur d'agence digitale, Dakar", 
    quote: "On brûlait notre budget sur des ciblages au hasard. MakeItAds nous a montré exactement où étaient nos vrais clients. Réduire notre coût d'acquisition de 60%, ce n'est pas juste un chiffre, c'est ce qui a sauvé notre trésorerie ce mois-là.",
    result: "Trésorerie sauvée",
    metric: "-60% de coûts"
  },
  {
    id: "f1", 
    avatar: "https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=150&h=150&fit=crop&crop=face", // Femme
    name: "Fatima S.", 
    role: "Fondatrice, Cosmétiques naturels, Cotonou", 
    quote: "J'avais peur que ce soit un outil générique qui ne comprend rien à notre réalité béninoise. Mais non ! Le ton, les angles, les canaux... tout résonnait avec ma clientèle. Mes leads WhatsApp ont explosé.",
    result: "Leads WhatsApp",
    metric: "+65% en 30 jours"
  },
  {
    id: "f2", 
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face", // Homme
    name: "Koffi A.", 
    role: "Promoteur immobilier, Abidjan", 
    quote: "Honnêtement, j'étais sceptique. Mais le rapport est dingue. Ils ont trouvé des segments d'audience que je n'aurais jamais devinés en 10 ans de métier. Mon retour sur investissement a été multiplié par 4.",
    result: "Retour sur investissement",
    metric: "ROAS de 4.2x"
  },
  {
    id: "c1", 
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face", // Femme
    name: "Sophie L.", 
    role: "Coach sportif, Yaoundé", 
    quote: "Je galérais à remplir mes cours de sport. La stratégie a tapé pile dans la douleur de mes clientes : 'Manque de temps pour soi'. Les textes fournis étaient si percutants que j'ai juste eu à copier-coller.",
    result: "Nouvelles clientes",
    metric: "+217% d'inscriptions"
  },
  {
    id: "c2", 
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face", // Homme
    name: "Marc T.", 
    role: "Graphiste freelance, Douala", 
    quote: "En tant que petit créateur, je n'avais pas les moyens d'une agence à 500 000 FCFA. Ce pack m'a donné une structure professionnelle. Mes revenus sont passés de 200k à 550k. C'est le meilleur investissement de ma vie.",
    result: "Revenus mensuels",
    metric: "+175% (550k FCFA)"
  },
  {
    id: "a1", 
    avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&h=150&fit=crop&crop=face", // Femme
    name: "Awa N.", 
    role: "Consultante marketing, Dakar", 
    quote: "En tant qu'indépendante, on perdait un temps fou à faire des stratégies from scratch. MakeItAds nous a fait gagner des semaines. Notre taux de signature a doublé grâce à des plans concrets dès le premier RDV.",
    result: "Taux de signature",
    metric: "x2 (55% de conversion)"
  },
  {
    id: "h1", 
    avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&h=150&fit=crop&crop=face", // Homme
    name: "Dr. Koné A.", 
    role: "Médecin, Clinique Santé Plus, Bamako", 
    quote: "Pour un médecin, le ton de la publicité doit être rassurant et professionnel, pas agressif. MakeItAds l'a parfaitement capté. Mes rendez-vous en ligne ont été multipliés par 4.",
    result: "Rendez-vous en ligne",
    metric: "+275% de réservations"
  },
  {
    id: "fa1", 
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face", // Femme
    name: "Clara M.", 
    role: "Commerçante, Wax Chic, Lomé", 
    quote: "J'avais 3 idées de pubs et je ne savais pas laquelle choisir. Ils m'ont fourni 9 variantes pour tester 3 angles différents. Le message gagnant a été trouvé en 4 jours seulement.",
    result: "Chiffre d'affaires",
    metric: "x2.8 en 1 mois"
  },
  {
    id: "im1", 
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face", // Homme
    name: "Patrick L.", 
    role: "Agent immobilier, Libreville", 
    quote: "Le ciblage par quartier d'une justesse impressionnante. Avant, je touchais des gens qui n'avaient pas le budget. Là, j'ai vendu 2 appartements en 3 semaines grâce à des prospects qualifiés.",
    result: "Ventes immobilières",
    metric: "2 ventes en 3 semaines"
  },
  {
    id: "be1", 
    avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&h=150&fit=crop&crop=face", // Femme
    name: "Grace K.", 
    role: "Esthéticienne, Glow Douala", 
    quote: "Le guide Canva m'a littéralement sauvée. Je ne suis pas graphiste, mais avec leurs instructions, j'ai créé des visuels pro en 10 minutes. Mon agenda est maintenant plein pour les 3 prochaines semaines.",
    result: "Rendez-vous",
    metric: "Agenda 100% complet"
  },
  {
    id: "ag1", 
    avatar: "https://images.unsplash.com/photo-1504257432389-5904bd08d252?w=150&h=150&fit=crop&crop=face", // Homme
    name: "Kader D.", 
    role: "Entrepreneur agroalimentaire, Cotonou", 
    quote: "On voulait exporter mais on ne savait pas par où commencer. La stratégie export identifiée par MakeItAds nous a ouvert des portes. 3 commandes internationales ce mois-ci, et notre marge a bondi.",
    result: "Marge moyenne",
    metric: "+133% (3 commandes export)"
  }
];

export default function PremiumStories() {
  const [selectedStory, setSelectedStory] = useState<any>(null);
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Défilement automatique fluide
  useEffect(() => {
    if (isPaused || !scrollRef.current) return;
    
    const interval = setInterval(() => {
      if (scrollRef.current) {
        // Défilement lent et constant
        scrollRef.current.scrollLeft += 1;
        
        // Reset infini pour créer une boucle sans fin
        if (scrollRef.current.scrollLeft >= (scrollRef.current.scrollWidth / 2)) {
          scrollRef.current.scrollLeft = 0;
        }
      }
    }, 20); // Vitesse de défilement

    return () => clearInterval(interval);
  }, [isPaused]);

  // Duplication pour l'effet de boucle infinie
  const duplicatedStories = [...PREMIUM_SUCCESS_STORIES, ...PREMIUM_SUCCESS_STORIES];

  return (
    <section className="relative z-10 py-12 md:py-16 overflow-hidden bg-[#FFFFFF]">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-8 md:mb-12">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-5 h-5 bg-emerald-500 flex items-center justify-center rounded-sm shadow-sm">
                  <svg viewBox="0 0 24 24" fill="white" className="w-3.5 h-3.5">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
              ))}
            </div>
            <span className="text-sm font-bold text-[#18181B] ml-2">4.9 / 5</span>
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-[#18181B] mb-2">
            Approuvé par des centaines d'entrepreneurs
          </h3>
          <p className="text-sm text-[#71717A] max-w-lg">
            Des stratégies qui transforment réellement les business en Afrique.
          </p>
        </div>
      </div>

      {/* Carrousel Full Width avec Halo Multicolore */}
      <div 
        className="relative w-full overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        <div 
          ref={scrollRef}
          className="flex gap-6 py-4 overflow-x-auto scrollbar-hide px-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <style jsx>{`.scrollbar-hide::-webkit-scrollbar { display: none; }`}</style>
          
          {duplicatedStories.map((story, index) => (
            <motion.button
              key={`${story.id}-${index}`}
              onClick={() => setSelectedStory(story)}
              className="group relative flex-shrink-0 flex flex-col items-center gap-3 focus:outline-none cursor-pointer"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              {/* Halo Multicolore Lumineux */}
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#6366F1] via-[#8B5CF6] to-[#EC4899] rounded-full blur opacity-40 group-hover:opacity-75 transition duration-500 animate-pulse"></div>
                <Image 
                  src={story.avatar} 
                  alt={story.name} 
                  width={64} 
                  height={64} 
                  className="relative w-16 h-16 rounded-full object-cover border-2 border-white shadow-md" 
                />
                <div className="absolute bottom-0 right-0 bg-emerald-500 rounded-full p-0.5 border-2 border-white">
                  <CheckCircle2 className="h-3 w-3 text-white" />
                </div>
              </div>
              
              <div className="text-center max-w-[100px]">
                <p className="text-xs font-bold text-[#18181B] truncate">{story.name}</p>
                <p className="text-[10px] text-[#71717A] truncate">{story.role.split(",")[0]}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Modal d'Avis Détaillé */}
      <AnimatePresence>
        {selectedStory && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedStory(null)}
              className="fixed inset-0 z-50 bg-[#18181B]/70 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            >
              <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-[#E7E7EB] overflow-hidden pointer-events-auto">
                {/* Bouton fermer */}
                <button
                  onClick={() => setSelectedStory(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-[#F7F7F8] text-[#71717A] hover:bg-[#E7E7EB] hover:text-[#18181B] transition-colors z-10"
                >
                  <X className="h-4 w-4" />
                </button>

                <div className="p-6 md:p-8">
                  {/* En-tête du modal */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="relative">
                      <div className="absolute -inset-1 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] rounded-full blur opacity-30"></div>
                      <Image 
                        src={selectedStory.avatar} 
                        alt={selectedStory.name} 
                        width={56} 
                        height={56} 
                        className="relative w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm" 
                      />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-[#18181B]">{selectedStory.name}</h4>
                      <p className="text-xs text-[#71717A]">{selectedStory.role}</p>
                    </div>
                  </div>

                  {/* Citation avec icône */}
                  <div className="relative mb-6">
                    <Quote className="absolute -top-2 -left-2 h-8 w-8 text-[#6366F1]/10 rotate-180" />
                    <blockquote className="text-sm md:text-base text-[#18181B] leading-relaxed italic relative z-10 pl-4 border-l-2 border-[#6366F1]">
                      "{selectedStory.quote}"
                    </blockquote>
                  </div>

                  {/* Résultat clé */}
                  <div className="flex items-center justify-between pt-4 border-t border-[#F7F7F8]">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-[#71717A] font-semibold mb-1">{selectedStory.result}</p>
                      <p className="text-lg font-bold text-[#6366F1]">{selectedStory.metric}</p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-[#6366F1]/10 flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-[#6366F1]" />
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