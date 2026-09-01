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
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=500&h=500&fit=crop",
    quote: "J'ai enfin compris comment vraiment cibler mes clients. Les résultats parlent d'eux-mêmes - mes ventes ont triplé en trois mois!",
  },
  {
    id: 2,
    firstName: "Kofi",
    age: 35,
    sector: "Services numériques",
    country: "Ghana",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop",
    quote: "L'analyse concurrentielle m'a montré exactement où je me trompais. Maintenant chaque décision est confiante et basée sur des données.",
  },
  {
    id: 3,
    firstName: "Fatima",
    age: 31,
    sector: "Cosmétiques",
    country: "Côte d'Ivoire",
    image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=500&h=500&fit=crop",
    quote: "Mon budget était gaspillé. Maintenant chaque franc compte vraiment. MakeItAds a littéralement sauvé mon entreprise.",
  },
  {
    id: 4,
    firstName: "Jean-Baptiste",
    age: 42,
    sector: "Immobilier",
    country: "Cameroun",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&h=500&fit=crop",
    quote: "Textes publicitaires prêts à utiliser, basés sur de vraies données. Du travail professionnel en 24h. Impressionné.",
  },
  {
    id: 5,
    firstName: "Oumou",
    age: 26,
    sector: "Coaching",
    country: "Mali",
    image: "https://images.unsplash.com/photo-1554224311-beee415c201f?w=500&h=500&fit=crop",
    quote: "Je croyais maîtriser le marketing. MakeItAds m'a humiliée - dans le bon sens. Il y a tant à apprendre et maintenant j'ai la route.",
  },
  {
    id: 6,
    firstName: "Adeyemi",
    age: 38,
    sector: "Formation",
    country: "Nigeria",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop",
    quote: "Calibré pour l'Afrique, c'est vraiment vrai. Exemples, devises, audiences - tout fait sens pour mon marché.",
  },
  {
    id: 7,
    firstName: "Aïssatou",
    age: 29,
    sector: "Bien-être",
    country: "Sénégal",
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=500&h=500&fit=crop",
    quote: "Support WhatsApp 24/7 = game changer. Je pose une question à 2h du matin et j'ai une réponse utile avant l'aube.",
  },
  {
    id: 8,
    firstName: "Ibrahim",
    age: 33,
    sector: "Agro-alimentaire",
    country: "Burkina Faso",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&h=500&fit=crop",
    quote: "Les chiffres que je reçois me permettent de convaincre mes associés. Pas de promesses creuses, juste des données solides.",
  },
  {
    id: 9,
    firstName: "Nadia",
    age: 27,
    sector: "Mode",
    country: "Maroc",
    image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=500&h=500&fit=crop",
    quote: "J'ai testé MakeItAds pour trois projets. Chaque stratégie était adaptée à MON contexte unique, pas du copier-coller.",
  },
  {
    id: 10,
    firstName: "Hassan",
    age: 31,
    sector: "Logistique",
    country: "Égypte",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop",
    quote: "ROI clair après une semaine. Les chiffres parlent d'eux-mêmes. Facile à défendre auprès de mon équipe.",
  },
  {
    id: 11,
    firstName: "Fatoumata",
    age: 32,
    sector: "Restauration",
    country: "Guinée",
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=500&h=500&fit=crop",
    quote: "Je n'étais pas technophile, mais l'interface est si intuitive que j'ai pu utiliser du premier coup. Et ça a marché!",
  },
  {
    id: 12,
    firstName: "Kwakwa",
    age: 29,
    sector: "Technologie",
    country: "Ghana",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&h=500&fit=crop",
    quote: "J'ai lancé trois startups. MakeItAds est l'outil que j'aurais aimé avoir à mes deux premières tentatives.",
  },
  {
    id: 13,
    firstName: "Zainab",
    age: 26,
    sector: "Beauté",
    country: "Côte d'Ivoire",
    image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=500&h=500&fit=crop",
    quote: "Instagram croît, mais je ne savais pas convertir. MakeItAds a transformé mes followers en clients payants.",
  },
  {
    id: 14,
    firstName: "Amadou",
    age: 40,
    sector: "Conseils",
    country: "Mali",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop",
    quote: "Après 20 ans d'expérience, cette plateforme m'a encore enseigné. L'honnêteté de l'approche, le respect des données - c'est rare.",
  },
  {
    id: 15,
    firstName: "Mariam",
    age: 34,
    sector: "Santé",
    country: "Cameroun",
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=500&h=500&fit=crop",
    quote: "Pas de fausse promesse - c'est vrai. Les résultats dépendent du travail, pas du miracle. Je l'aime pour ça.",
  },
  {
    id: 16,
    firstName: "Moustapha",
    age: 36,
    sector: "Éducation",
    country: "Mauritanie",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&h=500&fit=crop",
    quote: "Je recommande MakeItAds à TOUS mes collègues entrepreneurs. C'est ma première recommandation pour une raison.",
  },
  {
    id: 17,
    firstName: "Awa",
    age: 25,
    sector: "Digital",
    country: "Sénégal",
    image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=500&h=500&fit=crop",
    quote: "À mon âge, ma première vraie campagne. MakeItAds me donne la confiance et les outils pour réussir.",
  },
  {
    id: 18,
    firstName: "Diallo",
    age: 44,
    sector: "Commerce",
    country: "Guinée Bissau",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop",
    quote: "30 ans d'expérience sur le terrain. Je vois que MakeItAds comprend VRAIMENT comment les gens achètent en Afrique.",
  },
  {
    id: 19,
    firstName: "Yacine",
    age: 30,
    sector: "RH",
    country: "Sénégal",
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=500&h=500&fit=crop",
    quote: "Femme dans les affaires, j'apprécie qu'on me traite comme une professionnelle compétente. Sans condescendance.",
  },
  {
    id: 20,
    firstName: "Seydou",
    age: 28,
    sector: "Startup",
    country: "Togo",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&h=500&fit=crop",
    quote: "Les autres outils promettaient tout. MakeItAds promet peu et livre beaucoup. C'est l'inverse du reste, et j'aime ça.",
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
