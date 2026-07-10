"use client";

import { motion } from "framer-motion";

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export default function PageTransition({ children, className = "" }: PageTransitionProps) {
  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        y: 8,
        scale: 0.995
      }}
      animate={{ 
        opacity: 1, 
        y: 0,
        scale: 1
      }}
      exit={{ 
        opacity: 0, 
        y: -8,
        scale: 0.995
      }}
      transition={{
        duration: 0.25,
        ease: [0.4, 0, 0.2, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Version avec animation plus prononcée pour mobile
export function MobilePageTransition({ children, className = "" }: PageTransitionProps) {
  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        x: 16,
      }}
      animate={{ 
        opacity: 1, 
        x: 0,
      }}
      exit={{ 
        opacity: 0, 
        x: -16,
      }}
      transition={{
        duration: 0.2,
        ease: [0.4, 0, 0.2, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}