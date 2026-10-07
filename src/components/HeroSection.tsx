"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export default function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  // Force la lecture de la vidéo après montage (contournement iOS)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.play().catch(() => {
      // Si l'autoplay est bloqué, le poster reste affiché
    });
  }, []);

  const heroTitle = (
    <>
      <span className="block">
        Connaissez votre <span className="text-[#6366F1]">marché.</span>
      </span>
      <span className="block">
        Devancez la <span className="text-[#6366F1]">concurrence.</span>
      </span>
      <span className="block">
        Croissez en <span className="text-[#6366F1]">confiance.</span>
      </span>
    </>
  );

  return (
    <section className="relative z-10 min-h-[calc(100vh-4rem)] flex flex-col justify-center overflow-hidden pt-20 sm:pt-24 md:pt-28 pb-10 sm:pb-14 bg-[#FFFFFF]">
      {/* Fond décoratif */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-[#6366f1]/5 rounded-full blur-[150px]" />
        <div className="absolute top-1/4 right-0 w-[800px] h-[500px] bg-[#8b5cf6]/5 rounded-full blur-[120px]" />
        <div
          className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:32px_32px]"
          style={{
            maskImage:
              "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(0,0,0,0.05) 0%, transparent 100%)",
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mx-auto max-w-4xl text-left">
          {/* Titre */}
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold leading-[1.15] tracking-tight text-[#18181B] mb-4 md:mb-5"
          >
            {heroTitle}
          </motion.h1>

          {/* Sous-titre */}
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="max-w-2xl text-sm md:text-base text-[#475569] leading-relaxed mb-6 md:mb-8"
          >
            MakeItAds analyse votre activité, votre audience et votre marché
            pour construire la stratégie publicitaire complète derrière votre
            prochaine campagne. Prête à copier-coller, calibrée pour
            l&apos;Afrique.
          </motion.p>

          {/* Vidéo hero avec crop du haut */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.16, ease: "easeOut" }}
            className="relative w-full mb-8 md:mb-10"
          >
            {/* Halos décoratifs */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[70%] bg-gradient-to-br from-[#6366f1]/10 via-[#8b5cf6]/5 to-transparent blur-[100px] rounded-full -z-10" />

            <div className="relative">
              {/* Ombres sous la vidéo */}
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[90%] h-20 bg-[#0F172A]/10 blur-[40px] rounded-full" />
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[80%] h-12 bg-[#6366f1]/10 blur-[30px] rounded-full" />

              {/* Conteneur vidéo avec aspect ratio (crop du haut) */}
              <div
                className="relative z-10 overflow-hidden rounded-2xl md:rounded-3xl bg-[#0A0A0B]"
                style={{
                  aspectRatio: "1920 / 940",
                  boxShadow:
                    "0 25px 50px rgba(15, 23, 42, 0.15), 0 10px 20px rgba(99, 102, 241, 0.1)",
                }}
              >
                {/* Poster (avant chargement de la vidéo) */}
                {!videoLoaded && (
                  <img
                    src="/images/couv-X.png"
                    alt="MakeItAds Dashboard"
                    className="absolute inset-0 w-full h-full object-cover object-bottom"
                  />
                )}

                {/* Vidéo */}
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  poster="/images/couv-X.png"
                  onLoadedData={() => setVideoLoaded(true)}
                  className={`absolute inset-0 w-full h-full object-cover object-bottom transition-opacity duration-500 ${
                    videoLoaded ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <source src="/images/video/hero-demo.mp4" type="video/mp4" />
                </video>

                {/* Badge "Démo en direct" */}
                <div className="pointer-events-none absolute left-3 top-3 z-20 flex items-center gap-1.5 rounded-full border border-white/20 bg-black/60 px-2.5 py-1 backdrop-blur-md">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-500 opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-rose-500" />
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-white">
                    Démo en direct
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Boutons CTA */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.24 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 w-full max-w-md"
          >
            <Link
              href="/dashboard"
              className="group flex items-center justify-center gap-2 rounded-full bg-[#6366F1] px-5 py-2.5 text-xs md:text-sm font-semibold text-white shadow-md shadow-[#6366F1]/25 hover:bg-[#5558e6] transition-colors w-full sm:w-auto"
            >
              Obtenir une démo
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <a
              href="#how-it-works"
              className="flex items-center justify-center gap-2 rounded-full border border-gray-200 bg-white px-5 py-2.5 text-xs md:text-sm font-medium text-[#0F172A] hover:bg-gray-50 transition-colors w-full sm:w-auto"
            >
              Découvrez comment ça marche
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}