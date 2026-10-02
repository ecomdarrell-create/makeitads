"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useMotionValue, useTransform, animate, useMotionValueEvent } from "framer-motion";

interface AnimatedCounterProps {
  target: number;
  suffix?: string;
  duration?: number;
}

export default function AnimatedCounter({ target, suffix = "", duration = 2.5 }: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  
  // ✅ Synchronisation avec un state React pour éviter l'erreur TypeScript
  const [displayValue, setDisplayValue] = useState(0);
  
  useMotionValueEvent(rounded, "change", (latest) => {
    setDisplayValue(latest);
  });

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, target, { duration, ease: "easeOut" });
      return controls.stop;
    }
  }, [isInView, target, count, duration]);

  return (
    <span ref={ref}>
      {displayValue}
      {suffix}
    </span>
  );
}