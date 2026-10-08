"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export default function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const markReady = () => {
      setVideoReady(true);
      video.play().catch(() => {});
    };

    if (video.readyState >= 3) {
      markReady();
      return;
    }

    video.addEventListener("loadeddata", markReady);
    video.addEventListener("canplay", markReady);
    video.addEventListener("playing", markReady);

    video.load();
    video.play().catch(() => {});

    const timeout = setTimeout(markReady, 2000);

    return () => {
      video.removeEventListener("loadeddata", markReady);
      video.removeEventListener("canplay", markReady);
      video.removeEventListener("playing", markReady);
      clearTimeout(timeout);
    };
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
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold leading-[1.15] tracking-tight text-[#18181B] mb-4 md:mb-5"
          >
            {heroTitle}
          </motion.h1>

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

          {/* VIDÉO HERO */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.16, ease: "easeOut" }}
            className="relative w-full mb-8 md:mb-10"
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[80%] bg-gradient-to-br from-[#6366f1]/15 via-[#8b5cf6]/10 to-transparent blur-[120px] rounded-full -z-10" />

            <div className="relative">
              <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-[95%] h-24 bg-[#0F172A]/15 blur-[60px] rounded-full" />
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[85%] h-16 bg-[#6366f1]/15 blur-[40px] rounded-full" />

              <div className="relative z-10 rounded-3xl p-[1.5px] bg-gradient-to-br from-white/90 via-[#6366F1]/30 to-[#8B5CF6]/40 shadow-2xl">
                <div
                  className="relative overflow-hidden rounded-3xl bg-[#0A0A0B]"
                  style={{ aspectRatio: "1920 / 780" }}
                >
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ objectPosition: "center bottom" }}
                  >
                    <source src="/images/video/hero-demo.mp4" type="video/mp4" />
                  </video>

                  <img
                    src="/images/couv-X.png"
                    alt="MakeItAds Dashboard"
                    className={`absolute inset-0 w-full h-full object-cover object-bottom transition-opacity duration-700 ${
                      videoReady ? "opacity-0 pointer-events-none" : "opacity-100"
                    }`}
                  />

                  <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/10 via-transparent to-transparent" />

                  {/* ═══════════════════════════════════════ */}
                  {/* CURSEUR ROUNDED SQUARE + GLOW NÉON BLEU */}
                  {/* ═══════════════════════════════════════ */}
                  <motion.div
                    className="pointer-events-none absolute z-30"
                    initial={{ top: "65%", left: "30%", opacity: 0 }}
                    animate={{
                      top: ["65%", "55%", "40%", "38%", "55%", "65%"],
                      left: ["30%", "45%", "55%", "70%", "75%", "30%"],
                      opacity: [0, 1, 1, 1, 1, 0],
                    }}
                    transition={{
                      duration: 14,
                      repeat: Infinity,
                      ease: "easeInOut",
                      times: [0, 0.15, 0.35, 0.55, 0.8, 1],
                    }}
                  >
                    {/* Conteneur du curseur avec translation pour centrer le point chaud */}
                    <div className="relative -translate-x-2 -translate-y-2">
                      {/* Glow néon bleu externe (couche 1, large) */}
                      <div
                        className="absolute inset-0 rounded-[10px]"
                        style={{
                          boxShadow:
                            "0 0 24px 4px rgba(99,102,241,0.65), 0 0 48px 8px rgba(99,102,241,0.35)",
                          transform: "scale(1.15)",
                        }}
                      />

                      {/* Rounded square blanc glossy */}
                      <div
                        className="relative flex h-9 w-9 items-center justify-center rounded-[10px] border border-white/90"
                        style={{
                          background:
                            "linear-gradient(145deg, #FFFFFF 0%, #F1F5F9 50%, #E0E7FF 100%)",
                          boxShadow:
                            "0 0 0 1px rgba(255,255,255,0.9) inset, 0 1px 2px rgba(255,255,255,0.8) inset, 0 8px 20px rgba(99,102,241,0.35), 0 4px 8px rgba(15,23,42,0.15)",
                        }}
                      >
                        {/* Reflet glossy en haut */}
                        <div
                          className="pointer-events-none absolute inset-x-1 top-0.5 h-3 rounded-t-[8px]"
                          style={{
                            background:
                              "linear-gradient(to bottom, rgba(255,255,255,0.95), rgba(255,255,255,0))",
                          }}
                        />

                        {/* Flèche navy centrée */}
                        <svg
                          width="16"
                          height="18"
                          viewBox="0 0 16 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="relative z-10"
                        >
                          <path
                            d="M2 1.5L2 15L5.5 11.5L8.5 17L10.5 16L7.5 10.5H13L2 1.5Z"
                            fill="#0F172A"
                            stroke="#0F172A"
                            strokeWidth="1"
                            strokeLinejoin="round"
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>

                      {/* Halo pulsant qui tourne autour */}
                      <motion.div
                        className="absolute inset-0 rounded-[10px] border-2 border-[#6366F1]/50"
                        animate={{
                          scale: [1, 1.3, 1],
                          opacity: [0.5, 0, 0.5],
                        }}
                        transition={{
                          duration: 2.2,
                          repeat: Infinity,
                          ease: "easeOut",
                        }}
                      />
                    </div>
                  </motion.div>

                  {/* Effets "click" violets */}
                  <motion.div
                    className="pointer-events-none absolute z-20 h-14 w-14 rounded-full border-2 border-[#6366F1]"
                    initial={{ top: "38%", left: "70%", opacity: 0, scale: 0.3 }}
                    animate={{ opacity: [0, 0.9, 0], scale: [0.3, 1.5, 2] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      repeatDelay: 6.5,
                      ease: "easeOut",
                    }}
                    style={{ transform: "translate(-50%, -50%)" }}
                  />
                  <motion.div
                    className="pointer-events-none absolute z-20 h-14 w-14 rounded-full border-2 border-[#8B5CF6]"
                    initial={{ top: "55%", left: "45%", opacity: 0, scale: 0.3 }}
                    animate={{ opacity: [0, 0.7, 0], scale: [0.3, 1.5, 2] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      repeatDelay: 14,
                      delay: 3,
                      ease: "easeOut",
                    }}
                    style={{ transform: "translate(-50%, -50%)" }}
                  />
                </div>
              </div>

              <div className="pointer-events-none absolute inset-x-12 top-full h-16 bg-gradient-to-b from-[#6366F1]/10 to-transparent blur-2xl" />
            </div>
          </motion.div>

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