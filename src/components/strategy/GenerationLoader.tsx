"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { GENERATION_MESSAGES } from "@/lib/constants/strategy";

interface GenerationLoaderProps {
  error?: string | null;
}

export default function GenerationLoader({ error }: GenerationLoaderProps) {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % GENERATION_MESSAGES.length);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  const currentMessage = GENERATION_MESSAGES[msgIndex];

  return (
    <motion.div
      key="generating"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full flex items-center justify-center p-6 relative overflow-hidden min-h-[60vh]"
    >
      {/* Particules */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[#6366f1] rounded-full"
            initial={{ x: "50%", y: "50%", opacity: 0 }}
            animate={{
              x: `${Math.random() * 100}%`,
              y: `${Math.random() * 100}%`,
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="text-center relative z-10">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="inline-flex h-24 w-24 items-center justify-center rounded-full border-2 border-[#6366f1]/30 mb-8"
        >
          <div className="h-14 w-14 rounded-full bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] shadow-lg shadow-[#6366f1]/50" />
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={msgIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-xl font-bold text-white mb-2">
              {currentMessage.title}
            </p>
            <p className="text-sm text-slate-400 max-w-md mx-auto">
              {currentMessage.description}
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center justify-center gap-2 mt-6">
          {GENERATION_MESSAGES.map((_, i) => (
            <motion.div
              key={i}
              className={`h-1.5 rounded-full ${i <= msgIndex ? "bg-[#6366f1]" : "bg-white/10"}`}
              animate={{ width: i === msgIndex ? 24 : 6 }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>

        {error && (
          <div className="mt-6 p-4 rounded-lg border border-red-500/30 bg-red-500/10">
            <p className="text-sm text-red-300">Error: {error}</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}