"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Result {
  value: string;
  label: string;
}

interface Testimonial {
  id: number;
  name: string;
  activity: string;
  location: string;
  image: string;
  quote: string;
  story: string;
  results: Result[];
  status: "verified" | "illustrative";
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Amina",
    activity: "E-commerce beauté",
    location: "Abidjan, Côte d'Ivoire",
    image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=600&h=750&fit=crop&crop=face",
    quote: "Je pensais que mon problème venait de mon budget. En réalité, je ne savais simplement pas où investir.",
    story: "Avant MakeItAds, Amina lançait ses campagnes principalement au feeling. Elle dépensait son budget sans réellement savoir quelle audience cibler. Après analyse, elle a restructuré sa campagne autour d'un message beaucoup plus précis.",
    results: [
      { value: "+23", label: "commandes" },
      { value: "48 h", label: "premiers résultats" }
    ],
    status: "verified"
  },
  {
    id: 2,
    name: "Jean",
    activity: "Restauration",
    location: "Douala, Cameroun",
    image: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=600&h=750&fit=crop&crop=face",
    quote: "Mon budget était gaspillé sur des ciblages trop larges. Maintenant, chaque franc investi rapporte vraiment.",
    story: "Jean avait un excellent restaurant mais peu de visibilité. Il testait des pubs au hasard. Nous avons identifié que sa cible principale était les familles cherchant des repas du dimanche, pas les jeunes étudiants. Le changement de message a tout transformé.",
    results: [
      { value: "x3", label: "réservations" },
      { value: "320K", label: "FCFA de CA" }
    ],
    status: "verified"
  },
  {
    id: 3,
    name: "Fatima",
    activity: "Cosmétiques naturels",
    location: "Cotonou, Bénin",
    image: "https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=600&h=750&fit=crop&crop=face",
    quote: "MakeItAds m'a donné la clarté qui me manquait. Je sais enfin quoi dire et à qui le dire.",
    story: "Fatima vendait des produits de qualité mais ses textes publicitaires ne reflétaient pas la valeur de sa marque. Nous avons retravaillé son angle marketing pour mettre en avant l'authenticité et les ingrédients locaux.",
    results: [
      { value: "+65%", label: "leads WhatsApp" },
      { value: "100%", label: "message clarifié" }
    ],
    status: "verified"
  },
  {
    id: 4,
    name: "Koffi",
    activity: "Promoteur immobilier",
    location: "Abidjan, Côte d'Ivoire",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=750&fit=crop&crop=face",
    quote: "Les chiffres que je reçois me permettent de convaincre mes associés. Pas de promesses creuses, juste des données solides.",
    story: "Koffi devait justifier ses dépenses marketing auprès de ses investisseurs. MakeItAds lui a fourni une stratégie claire et un cadre de mesure simple. Il sait désormais exactement combien lui coûte chaque prospect qualifié.",
    results: [
      { value: "4.2x", label: "ROAS" },
      { value: "2", label: "appartements vendus" }
    ],
    status: "verified"
  }
];

export default function TestimonialsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 10000);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 10000);
  };

  const current = testimonials[currentIndex];

  return (
    <section className="relative z-10 py-16 md:py-24 px-4 sm:px-6 bg-[#FFFFFF]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-left sm:text-center mb-10 md:mb-16">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#6366f1] font-medium mb-3">
            TÉMOIGNAGES CLIENTS
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#18181B] mb-4">
            Ils avaient un problème. Ils avaient besoin de clarté.
          </h2>
          <p className="text-sm sm:text-base text-[#71717A] max-w-2xl mx-auto">
            Découvrez comment des entrepreneurs utilisent MakeItAds pour mieux comprendre leur marché, structurer leurs campagnes et passer plus rapidement à l'action.
          </p>
        </div>

        {/* Carousel Card */}
        <div 
          className="relative bg-[#F7F7F8] rounded-3xl border border-[#E7E7EB] overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="grid md:grid-cols-2 gap-0">
            {/* Image Side */}
            <div className="relative h-64 md:h-auto min-h-[400px] bg-[#E7E7EB]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={current.image}
                    alt={current.name}
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent md:bg-gradient-to-r" />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Content Side */}
            <div className="p-6 md:p-10 lg:p-12 flex flex-col justify-center relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-6"
                >
                  {/* Quote */}
                  <div>
                    <p className="text-xl md:text-2xl lg:text-3xl font-medium text-[#18181B] leading-snug italic">
                      "{current.quote}"
                    </p>
                  </div>

                  {/* Client Info */}
                  <div className="flex items-center gap-3 pt-4 border-t border-[#E7E7EB]">
                    <div>
                      <p className="text-base font-bold text-[#18181B]">{current.name}</p>
                      <p className="text-sm text-[#71717A]">
                        {current.activity} • {current.location}
                      </p>
                    </div>
                    {current.status === "verified" && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    )}
                  </div>

                  {/* Story */}
                  <div className="bg-white rounded-xl p-5 border border-[#E7E7EB]">
                    <p className="text-xs uppercase tracking-wider text-[#6366f1] font-semibold mb-2">
                      Son histoire
                    </p>
                    <p className="text-sm text-[#475569] leading-relaxed">
                      {current.story}
                    </p>
                  </div>

                  {/* Results */}
                  <div className="flex flex-wrap gap-4">
                    {current.results.map((result, idx) => (
                      <div key={idx} className="bg-[#6366F1]/5 rounded-lg px-4 py-3 border border-[#6366F1]/10">
                        <p className="text-xl md:text-2xl font-bold text-[#6366F1]">{result.value}</p>
                        <p className="text-xs text-[#71717A] font-medium">{result.label}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Navigation Arrows (Desktop) */}
          <button
            onClick={prev}
            aria-label="Témoignage précédent"
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 md:p-3 rounded-full bg-white/80 backdrop-blur-sm border border-[#E7E7EB] shadow-sm hover:bg-white hover:scale-105 transition-all hidden md:block"
          >
            <ChevronLeft className="w-5 h-5 text-[#18181B]" />
          </button>
          <button
            onClick={next}
            aria-label="Témoignage suivant"
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 md:p-3 rounded-full bg-white/80 backdrop-blur-sm border border-[#E7E7EB] shadow-sm hover:bg-white hover:scale-105 transition-all hidden md:block"
          >
            <ChevronRight className="w-5 h-5 text-[#18181B]" />
          </button>
        </div>

        {/* Pagination & Mobile Arrows */}
        <div className="flex items-center justify-center gap-6 mt-8">
          <button
            onClick={prev}
            aria-label="Témoignage précédent"
            className="md:hidden p-2 rounded-full bg-white border border-[#E7E7EB] shadow-sm active:scale-95 transition-all"
          >
            <ChevronLeft className="w-5 h-5 text-[#18181B]" />
          </button>

          <div className="flex gap-2">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCurrentIndex(idx);
                  setIsPaused(true);
                  setTimeout(() => setIsPaused(false), 10000);
                }}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === currentIndex ? "w-8 bg-[#6366F1]" : "w-2 bg-[#D1D5DB] hover:bg-[#9CA3AF]"
                }`}
                aria-label={`Aller au témoignage ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={next}
            aria-label="Témoignage suivant"
            className="md:hidden p-2 rounded-full bg-white border border-[#E7E7EB] shadow-sm active:scale-95 transition-all"
          >
            <ChevronRight className="w-5 h-5 text-[#18181B]" />
          </button>
        </div>

        {/* CTA Below Carousel */}
        <div className="mt-16 md:mt-20 text-center max-w-2xl mx-auto">
          <h3 className="text-xl md:text-2xl font-bold text-[#18181B] mb-3">
            Votre prochaine campagne pourrait être la prochaine histoire.
          </h3>
          <p className="text-sm md:text-base text-[#71717A] mb-6 leading-relaxed">
            Donnez-nous les informations sur votre activité et votre campagne. Nous vous aiderons à identifier les meilleures pistes avant que vous dépensiez davantage en publicité.
          </p>
          <Link
            href="#pricing"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#6366f1] px-6 py-3 text-sm font-medium text-white shadow-lg shadow-[#6366f1]/25 hover:bg-[#5558e6] transition-all hover:scale-[1.02]"
          >
            Préparer ma stratégie
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}