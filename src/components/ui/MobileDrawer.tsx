"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { createPortal } from "react-dom";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  position?: "left" | "right" | "bottom";
  title?: string;
}

export function MobileDrawer({
  isOpen,
  onClose,
  children,
  position = "left",
  title,
}: MobileDrawerProps) {
  // Fermer avec Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const positionClasses = {
    left: "drawer-left",
    right: "drawer-right",
    bottom: "drawer-bottom",
  };

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className="backdrop-overlay"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className={`${positionClasses[position]} flex flex-col`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "drawer-title" : undefined}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between p-4 border-b border-white/[0.06]">
            <h2 id="drawer-title" className="text-lg font-semibold text-white">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="h-10 w-10 flex items-center justify-center rounded-lg hover:bg-white/[0.05] transition-colors"
              aria-label="Close drawer"
            >
              <X className="h-5 w-5 text-slate-400" />
            </button>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </>,
    document.body
  );
}

// Hook pour gérer le drawer
export function useMobileDrawer() {
  const [isOpen, setIsOpen] = useState(false);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen(!isOpen);

  return { isOpen, open, close, toggle };
}

// Import manquant à ajouter en haut
import { useState } from "react";