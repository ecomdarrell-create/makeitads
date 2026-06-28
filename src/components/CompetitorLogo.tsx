"use client";

import { useState } from "react";
import Image from "next/image";

interface CompetitorLogoProps {
  website?: string;
  name: string;
  size?: "sm" | "md" | "lg";
}

export default function CompetitorLogo({ website, name, size = "md" }: CompetitorLogoProps) {
  const [imageError, setImageError] = useState(false);
  const [useFallback, setUseFallback] = useState(false);

  const sizes = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
  };

  // Extraire le domaine du site web
  const getDomain = (url: string) => {
    try {
      const domain = new URL(url.startsWith("http") ? url : `https://${url}`).hostname;
      return domain.replace("www.", "");
    } catch {
      return url.replace("www.", "").split("/")[0];
    }
  };

  const domain = website ? getDomain(website) : "";

  // URLs des APIs de logos
  const clearbitUrl = domain ? `https://logo.clearbit.com/${domain}` : "";
  const googleFaviconUrl = domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=128` : "";

  // Couleur de fond basée sur le nom
  const getInitialColor = (name: string) => {
    const colors = [
      "from-[#6366f1] to-[#8b5cf6]",
      "from-emerald-500 to-[#38bdf8]",
      "from-amber-500 to-orange-500",
      "from-rose-500 to-pink-500",
      "from-[#38bdf8] to-[#0ea5e9]",
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <div className={`${sizes[size]} rounded-xl bg-white/10 flex items-center justify-center overflow-hidden relative`}>
      {/* Essayer Clearbit d'abord */}
      {clearbitUrl && !imageError && !useFallback && (
        <img
          src={clearbitUrl}
          alt={`${name} logo`}
          className="h-full w-full object-contain"
          onError={() => setImageError(true)}
        />
      )}

      {/* Fallback sur Google Favicon */}
      {googleFaviconUrl && imageError && !useFallback && (
        <img
          src={googleFaviconUrl}
          alt={`${name} favicon`}
          className="h-full w-full object-contain"
          onError={() => setUseFallback(true)}
        />
      )}

      {/* Placeholder premium si tout échoue */}
      {(useFallback || !website) && (
        <div className={`h-full w-full bg-gradient-to-br ${getInitialColor(name)} flex items-center justify-center`}>
          <span className="text-lg font-bold text-white">
            {name.charAt(0).toUpperCase()}
          </span>
        </div>
      )}
    </div>
  );
}