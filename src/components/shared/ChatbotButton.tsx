'use client';

import Image from 'next/image';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';

const SUPPORT_EMAIL = 'support@makeitads.pro';

export default function ChatbotButton() {
  const [imageError, setImageError] = useState(false);

  const handleClick = () => {
    window.location.href = `mailto:${SUPPORT_EMAIL}`;
  };

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      aria-label="Contacter le support par email"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.2, duration: 0.35, ease: 'easeOut' }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.94 }}
      className="group fixed bottom-4 right-4 z-[70] flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] shadow-[0_8px_30px_rgba(99,102,241,0.45)] transition-shadow hover:shadow-[0_12px_40px_rgba(99,102,241,0.6)] sm:bottom-6 sm:right-6 sm:h-16 sm:w-16"
    >
      {/* Pulse subtil */}
      <span
        className="absolute inset-0 -z-0 animate-ping rounded-full bg-[#6366F1]/40"
        style={{ animationDuration: '2.8s' }}
      />

      {/* Image du chatbot */}
      {!imageError ? (
        <Image
          src="/images/chatbot-hero.png"
          alt="Support MakeItAds"
          fill
          className="object-cover"
          sizes="64px"
          priority
          onError={() => setImageError(true)}
        />
      ) : (
        <span className="relative z-10 flex h-full w-full items-center justify-center">
          <Mail className="h-6 w-6 text-white sm:h-7 sm:w-7" strokeWidth={2.4} />
        </span>
      )}

      {/* Tooltip desktop au survol */}
      <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 sm:block">
        Besoin d&apos;aide&nbsp;?
      </span>
    </motion.button>
  );
}