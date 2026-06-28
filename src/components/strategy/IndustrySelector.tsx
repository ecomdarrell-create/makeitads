"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import Image from "next/image";
import { INDUSTRIES } from "@/lib/constants/strategy";

interface IndustrySelectorProps {
  selectedIndustry: string | null;
  onSelect: (id: string) => void;
}

export default function IndustrySelector({ selectedIndustry, onSelect }: IndustrySelectorProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {INDUSTRIES.map((biz) => (
        <motion.button 
          key={biz.id} 
          whileHover={{ scale: 1.05 }} 
          whileTap={{ scale: 0.95 }} 
          onClick={() => onSelect(biz.id)} 
          className={`relative rounded-xl overflow-hidden border-2 aspect-[4/3] group ${
            selectedIndustry === biz.id 
              ? "border-[#6366f1] shadow-[0_0_20px_-5px_rgba(99,102,241,0.5)]" 
              : "border-white/10 hover:border-white/30"
          }`}
        >
          <Image 
            src={biz.image} 
            alt={biz.name} 
            fill 
            className="object-cover group-hover:scale-110 transition-transform duration-500" 
            style={{ objectPosition: "center 30%" }} 
            sizes="20vw" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <p className="text-sm font-bold text-white">{biz.name}</p>
          </div>
          {selectedIndustry === biz.id && (
            <div className="absolute top-2 right-2 h-5 w-5 rounded-full bg-[#6366f1] flex items-center justify-center">
              <Check className="h-3 w-3 text-white" />
            </div>
          )}
        </motion.button>
      ))}
    </div>
  );
}