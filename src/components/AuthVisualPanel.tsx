"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface AuthVisualPanelProps {
  variant: "signin" | "signup";
}

// Fonction pour générer des valeurs pseudo-aléatoires basées sur un seed
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// Particules animées en arrière-plan
function ParticleGrid() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: seededRandom(i * 123.456) * 100,
    y: seededRandom(i * 789.012) * 100,
    size: seededRandom(i * 345.678) * 2.5 + 1,
    duration: seededRandom(i * 901.234) * 25 + 20,
    delay: seededRandom(i * 567.890) * 8,
  }));

  if (!mounted) {
    return <div className="absolute inset-0" />;
  }

  return (
    <div className="absolute inset-0 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: `radial-gradient(circle, rgba(99,102,241,0.4) 0%, rgba(139,92,246,0.2) 100%)`,
          }}
          animate={{
            y: [0, -40, 0],
            opacity: [0.1, 0.5, 0.1],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

export default function AuthVisualPanel({ variant }: AuthVisualPanelProps) {
  const isSignin = variant === "signin";

  const testimonials = [
    {
      quote: "I built my first campaign in 22 seconds. This is the future.",
      name: "Alex Chen",
      role: "Founder, TechFlow",
      img: "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=100",
    },
    {
      quote: "Saved $4,000 monthly. My ROI tripled in week one.",
      name: "Priya Sharma",
      role: "Growth Lead, ScaleUp",
      img: "https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&w=100",
    },
    {
      quote: "The targeting precision is unmatched. Game changer.",
      name: "Jordan Blake",
      role: "CMO, Elevate Digital",
      img: "https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=100",
    },
  ];

  return (
    <div className="relative hidden lg:flex w-[55%] flex-col justify-between overflow-hidden bg-gradient-to-br from-[#080810] via-[#0a0a18] to-[#0f0f1a] p-12">
      {/* Image de fond : réseau de données abstrait */}
      <div className="absolute inset-0">
        <img
          src="https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=1600"
          alt=""
          className="h-full w-full object-cover opacity-15"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#080810]/95 via-[#080810]/85 to-[#0f0f1a]/95" />
      </div>

      {/* Grille de particules améliorée */}
      <ParticleGrid />

      {/* Halos lumineux plus subtils */}
      <div className="absolute -top-32 -left-32 h-80 w-80 rounded-full bg-gradient-to-br from-[#6366f1]/25 to-transparent blur-3xl" />
      <div className="absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-gradient-to-tl from-[#8b5cf6]/20 to-transparent blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-[#38bdf8]/10 blur-3xl" />

      {/* Logo en haut à gauche */}
      <div className="relative z-10">
        <a href="/" className="inline-flex items-center transition-transform hover:scale-105">
          <span className="text-2xl font-bold text-white tracking-tight">Make</span>
          <span className="bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#38bdf8] bg-clip-text text-2xl font-bold text-transparent tracking-tight">
            ItAds
          </span>
        </a>
      </div>

      {/* Contenu central */}
      <div className="relative z-10 space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
        >
          <h2 className="text-5xl font-bold leading-[1.1] tracking-tight text-white">
            {isSignin ? (
              <>
                Welcome back.
                <br />
                <span className="bg-gradient-to-r from-[#6366f1] via-[#a78bfa] to-[#38bdf8] bg-clip-text text-transparent">
                  Your next winning strategy
                </span>
                <br />
                is one click away.
              </>
            ) : (
              <>
                Join 12,400+ entrepreneurs
                <br />
                <span className="bg-gradient-to-r from-[#6366f1] via-[#a78bfa] to-[#38bdf8] bg-clip-text text-transparent">
                  building smarter campaigns.
                </span>
              </>
            )}
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-slate-400 max-w-lg">
            {isSignin
              ? "Pick up right where you left off. Your dashboard is waiting."
              : "AI-powered ad strategies in 30 seconds. Zero agency fees. Pure performance."}
          </p>
        </motion.div>

        {/* Carte flottante "Strategy generated" avec design amélioré */}
        <motion.div
          className="relative max-w-lg"
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-2xl p-6 shadow-[0_30px_80px_rgba(99,102,241,0.2)]">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-500 shadow-lg shadow-emerald-500/40">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-xs uppercase tracking-[0.32em] text-slate-400 font-semibold">Strategy generated</p>
                <p className="text-base font-bold text-white mt-0.5">Campaign ready in 22 seconds</p>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-bold text-emerald-400">Live</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/10">
              <div className="text-center">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">CTR</p>
                <p className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">+67%</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">CPC</p>
                <p className="text-xl font-bold text-white">$0.42</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">ROI</p>
                <p className="text-xl font-bold bg-gradient-to-r from-[#8b5cf6] to-[#a78bfa] bg-clip-text text-transparent">340%</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Témoignages en bas avec design amélioré */}
      <div className="relative z-10 space-y-3">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.6 + i * 0.2 }}
            className="flex items-center gap-4 rounded-2xl border border-white/5 bg-gradient-to-r from-white/[0.04] to-transparent backdrop-blur-sm px-5 py-4 hover:border-white/10 transition-all"
          >
            <img
              src={t.img}
              alt={t.name}
              className="h-10 w-10 rounded-full object-cover border-2 border-white/10 shadow-lg"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-slate-200 font-medium leading-snug">"{t.quote}"</p>
              <p className="text-xs text-slate-500 mt-1">
                {t.name} <span className="text-slate-600">·</span> {t.role}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}