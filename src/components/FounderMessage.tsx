"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function FounderMessage() {
  return (
    <section id="founder" className="relative z-10 overflow-hidden">
      {/* IMAGE PLEIN ÉCRAN SANS TITRE */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8 }}
        className="relative w-full min-h-[500px] md:min-h-[600px] lg:min-h-[700px]"
      >
        <Image
          src="/images/founder-message.webp"
          alt="Dr. Darrell Kamga - Founder of MakeItAds"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
          quality={95}
        />
      </motion.div>
    </section>
  );
}