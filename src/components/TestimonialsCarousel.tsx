"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";

interface Testimonial {
  id: number;
  firstName: string;
  age: number;
  sector: string;
  country: string;
  image: string;
  quote: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    firstName: "Amara",
    age: 28,
    sector: "E-commerce",
    country: "Sénégal",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    quote: "MakeItAds m'a permis de dépasser ma première stratégie au hasard. Les recommandations sont précises et je vois déjà des résultats en deux semaines.",
  },
  {
    id: 2,
    firstName: "Kofi",
    age: 35,
    sector: "Services numériques",
    country: "Ghana",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    quote: "L'analyse concurrentielle seule vaut le prix. Je connais maintenant exactement ce que font mes rivaux et comment les surpasser.",
  },
  {
    id: 3,
    firstName: "Fatima",
    age: 31,
    sector: "Cosmétiques",
    country: "Côte d'Ivoire",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
    quote: "Ma campagne coûtait trop cher pour rien. Grâce à MakeItAds, j'ai réduit mon budget de 40% et augmenté mes conversions.",
  },
  {
    id: 4,
    firstName: "Jean",
    age: 42,
    sector: "Immobilier",
    country: "Cameroun",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
    quote: "Les textes publicitaires sont prêts à copier-coller. C'est du travail professionnel livré en 24h. Parfait pour les entrepreneurs.",
  },
  {
    id: 5,
    firstName: "Oumou",
    age: 26,
    sector: "Coaching",
    country: "Mali",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    quote: "Je pensais que je comprendre le marketing en ligne. MakeItAds m'a ouvert les yeux sur ce que je ratais vraiment.",
  },
  {
    id: 6,
    firstName: "Charlotte",
    age: 29,
    sector: "Bien-être",
    country: "Belgique",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    quote: "Support prioritaire sur WhatsApp = game changer. Mes questions trouvent toujours une réponse rapide et pertinente.",
  },
  {
    id: 7,
    firstName: "Adeyemi",
    age: 38,
    sector: "Formation",
    country: "Nigeria",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
    quote: "Calibré pour l'Afrique = vraiment vrai. Les exemples, les devises, les audiences... tout fait sens pour notre marché.",
  },
  {
    id: 8,
    firstName: "Marie",
    age: 34,
    sector: "Mode",
    country: "France",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
    quote: "J'utilise MakeItAds pour mes trois projets différents. Chaque fois, la stratégie est adaptée au contexte spécifique.",
  },
  {
    id: 9,
    firstName: "Moussa",
    age: 33,
    sector: "Agro-alimentaire",
    country: "Burkina Faso",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    quote: "Les statistiques que je reçois m'aident à justifier mon budget auprès de mes associés. Données claires, persuasives.",
  },
  {
    id: 10,
    firstName: "Laure",
    age: 27,
    sector: "Agence marketing",
    country: "Suisse",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    quote: "Je recommande MakeItAds à tous mes clients freelance. Ils ont accès à une expertise qu'ils ne pourraient pas se payer.",
  },
  {
    id: 11,
    firstName: "Ibrahim",
    age: 45,
    sector: "Restauration",
    country: "Guinée",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
    quote: "Simple, direct, efficace. Pas de blabla marketing. Juste de la stratégie applicable demain matin.",
  },
  {
    id: 12,
    firstName: "Sophie",
    age: 30,
    sector: "Santé",
    country: "Luxembourg",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
    quote: "Le centre d'aide et la FAQ ont répondu à 90% de mes questions avant même que je les pose.",
  },
  {
    id: 13,
    firstName: "Kwame",
    age: 29,
    sector: "Technologie",
    country: "Kenya",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    quote: "Scalable. Petit budget ou gros, la méthodologie fonctionne. J'ai utilisé MakeItAds à trois étapes différentes de ma croissance.",
  },
  {
    id: 14,
    firstName: "Nadia",
    age: 26,
    sector: "Événementiel",
    country: "Maroc",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    quote: "Les variantes de textes = profit. Tester plusieurs angles rapidement, c'est comment j'ai trouvé le message qui convertit.",
  },
  {
    id: 15,
    firstName: "David",
    age: 36,
    sector: "Consulting",
    country: "Canada",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
    quote: "Aucune fausse promesse. Aucune statistique gonflée. Juste de la vraie stratégie qui marche ou qui marche pas.",
  },
  {
    id: 16,
    firstName: "Aïssatou",
    age: 32,
    sector: "Éducation",
    country: "Togo",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
    quote: "Outil essentiellement pour les entrepreneurs africains. Mais les règles fondamentales? Universelles et puissantes.",
  },
  {
    id: 17,
    firstName: "Hassan",
    age: 31,
    sector: "Logistique",
    country: "Égypte",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    quote: "Retour sur investissement clair après une semaine. Les chiffres parlent d'eux-mêmes. C'est un test facile à justifier.",
  },
  {
    id: 18,
    firstName: "Emma",
    age: 28,
    sector: "Branding",
    country: "Pays-Bas",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    quote: "L'interface est belle, mais c'est le contenu qui tue. Chaque élément a une raison. Pas de remplissage.",
  },
  {
    id: 19,
    firstName: "Aliou",
    age: 27,
    sector: "SaaS",
    country: "Mauritanie",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
    quote: "Cycle de feedback rapide. Paiement, stratégie, implémentation, résultats. Tout en une semaine.",
  },
  {
    id: 20,
    firstName: "Lisa",
    age: 33,
    sector: "Consultance RH",
    country: "Allemagne",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
    quote: "MakeItAds m'a donné confiance pour lancer ma première vraie campagne. C'est un partenaire, pas un outil.",
  },
];

interface TestimonialsCarouselProps {
  placement?: "top" | "bottom";
}

export default function TestimonialsCarousel({ placement = "top" }: TestimonialsCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [autoPlay, setAutoPlay] = useState(true);
  const [itemsToShow, setItemsToShow] = useState(6);

  useEffect(() => {
    // Set items to show based on window size
    const updateItemsToShow = () => {
      setItemsToShow(typeof window !== "undefined" && window.innerWidth < 768 ? 4 : 6);
    };
    
    updateItemsToShow();
    window.addEventListener("resize", updateItemsToShow);
    return () => window.removeEventListener("resize", updateItemsToShow);
  }, []);

  useEffect(() => {
    if (!autoPlay) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [autoPlay]);

  const next = () => {
    setCurrent((prev) => (prev + 1) % testimonials.length);
    setAutoPlay(false);
  };

  const prev = () => {
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setAutoPlay(false);
  };

  const selected = testimonials.find((t) => t.id === selectedId);

  const getVisibleTestimonials = () => {
    const result = [];
    for (let i = 0; i < itemsToShow; i++) {
      result.push(testimonials[(current + i) % testimonials.length]);
    }
    return result;
  };

  return (
    <>
      <section className={`relative z-10 py-8 md:py-12 px-4 sm:px-6 ${placement === "top" ? "bg-white border-b border-[#E7E7EB]" : "bg-[#F7F7F8]"}`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#6366f1] font-medium mb-2">Témoignages clients</p>
              <h3 className="text-lg md:text-2xl font-bold text-[#18181B]">
                Nos clients se font {placement === "top" ? "connaître" : "confiance"}
              </h3>
            </div>
            <div className="flex gap-2 md:gap-3">
              <button
                onClick={prev}
                className="p-2 md:p-2.5 rounded-full bg-white border border-[#E7E7EB] hover:bg-[#F7F7F8] transition-all"
              >
                <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 text-[#18181B]" />
              </button>
              <button
                onClick={next}
                className="p-2 md:p-2.5 rounded-full bg-white border border-[#E7E7EB] hover:bg-[#F7F7F8] transition-all"
              >
                <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-[#18181B]" />
              </button>
            </div>
          </div>

          <div className="flex gap-3 md:gap-4 overflow-hidden">
            {getVisibleTestimonials().map((testimonial) => (
              <motion.button
                key={testimonial.id}
                onClick={() => setSelectedId(testimonial.id)}
                className="flex-shrink-0 group cursor-pointer"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full ring-2 ring-[#E7E7EB] group-hover:ring-[#6366f1] transition-all overflow-hidden">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.firstName}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-[10px] md:text-xs font-medium text-[#18181B] text-center mt-2 truncate max-w-[60px] md:max-w-[80px]">
                  {testimonial.firstName}
                </p>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {selectedId && selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end md:items-center justify-center p-4"
            onClick={() => setSelectedId(null)}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="w-full md:w-96 bg-white rounded-3xl md:rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-48 md:h-64 bg-gradient-to-br from-[#6366f1] to-[#8b5cf6]">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full ring-4 ring-white overflow-hidden">
                    <Image
                      src={selected.image}
                      alt={selected.firstName}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                </div>
                <button
                  onClick={() => setSelectedId(null)}
                  className="absolute top-3 right-3 p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 md:p-8">
                <div className="mb-4">
                  <h4 className="text-xl md:text-2xl font-bold text-[#18181B] mb-1">{selected.firstName}</h4>
                  <p className="text-sm text-[#71717A]">
                    {selected.age} ans • {selected.sector} • {selected.country}
                  </p>
                </div>

                <blockquote className="mb-6">
                  <p className="text-base md:text-lg text-[#18181B] leading-relaxed italic">"{selected.quote}"</p>
                </blockquote>

                <div className="flex items-center gap-3 p-3 md:p-4 bg-[#F7F7F8] rounded-lg">
                  <div className="flex-1">
                    <p className="text-[10px] uppercase tracking-wider text-[#6366f1] font-medium">Résultat</p>
                    <p className="text-sm md:text-base font-semibold text-[#18181B]">Stratégie appliquée et optimisée</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
