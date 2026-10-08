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

  // Force la lecture automatique de la vidéo
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");

    const tryPlay = () => {
      video.play().catch(() => {
        setTimeout(() => video.play().catch(() => {}), 300);
      });
    };

    const markReady = () => {
      setVideoReady(true);
      tryPlay();
    };

    if (video.readyState >= 2) markReady();

    video.addEventListener("loadeddata", markReady);
    video.addEventListener("canplay", markReady);
    video.addEventListener("playing", () => setVideoReady(true));

    tryPlay();
    video.load();

    // Fallback : relance la lecture au premier clic/touch/scroll (contrainte iOS)
    const handleInteraction = () => {
      tryPlay();
      document.removeEventListener("touchstart", handleInteraction);
      document.removeEventListener("click", handleInteraction);
      document.removeEventListener("scroll", handleInteraction);
    };

    document.addEventListener("touchstart", handleInteraction, { once: true });
    document.addEventListener("click", handleInteraction, { once: true });
    document.addEventListener("scroll", handleInteraction, { once: true });

    const intervals = [
      setTimeout(markReady, 500),
      setTimeout(markReady, 1500),
      setTimeout(markReady, 3000),
    ];

    return () => {
      video.removeEventListener("loadeddata", markReady);
      video.removeEventListener("canplay", markReady);
      document.removeEventListener("touchstart", handleInteraction);
      document.removeEventListener("click", handleInteraction);
      document.removeEventListener("scroll", handleInteraction);
      intervals.forEach(clearTimeout);
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
                  {/* VIDÉO autoplay muet en boucle */}
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    controls={false}
                    disablePictureInPicture
                    controlsList="nodownload nofullscreen noremoteplayback"
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ objectPosition: "center bottom" }}
                  >
                    <source src="/images/video/hero-demo.mp4" type="video/mp4" />
                  </video>

                  {/* Poster affiché avant que la vidéo soit prête */}
                  <img
                    src="/images/couv-X.png"
                    alt="MakeItAds Dashboard"
                    className={`absolute inset-0 w-full h-full object-cover object-bottom transition-opacity duration-700 ${
                      videoReady ? "opacity-0 pointer-events-none" : "opacity-100"
                    }`}
                  />

                  {/* Reflet subtil sur le dessus (glassmorphism) */}
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/10 via-transparent to-transparent" />
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