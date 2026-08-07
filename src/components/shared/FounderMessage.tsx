"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface FounderMessageData {
  id: string;
  title: string;
  message: string;
  button_text: string | null;
  button_url: string | null;
}

export default function FounderMessage() {
  const [message, setMessage] = useState<FounderMessageData | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const res = await fetch("/api/founder-message");
        const data = await res.json();
        if (data.message) {
          setMessage(data.message);
          setTimeout(() => setIsVisible(true), 100);
        }
      } catch (error) {
        console.error("Failed to fetch founder message", error);
      }
    };

    fetchMessage();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isVisible) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleClose = async () => {
    setIsExiting(true);
    setTimeout(async () => {
      setIsVisible(false);
      setMessage(null);
      if (message) {
        await fetch("/api/founder-message/dismiss", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messageId: message.id }),
        });
      }
    }, 300);
  };

  const handleClick = async () => {
    if (message) {
      await fetch("/api/founder-message/click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messageId: message.id }),
      });
    }
  };

  if (!message || (!isVisible && !isExiting)) return null;

  return (
    <AnimatePresence>
      {(isVisible || isExiting) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20, transition: { duration: 0.3, ease: "easeIn" } }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="fixed bottom-8 right-8 z-50 w-[92vw] sm:w-[400px] left-1/2 sm:left-auto -translate-x-1/2 sm:translate-x-0 bg-white rounded-[22px] shadow-[0_12px_40px_rgba(0,0,0,0.12)] border border-gray-100 overflow-hidden"
          role="dialog"
          aria-labelledby="founder-message-title"
        >
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors z-10"
            aria-label="Fermer le message"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="p-6 pb-2 flex items-start gap-3 relative">
            <div className="relative flex-shrink-0">
              <Image
                src="/darrell.jpg" 
                alt="Darrell"
                width={48}
                height={48}
                className="rounded-full object-cover"
              />
              <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-white rounded-full"></span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 id="founder-message-title" className="text-[18px] font-semibold text-[#111827] leading-tight">
                Darrell
              </h3>
              <p className="text-[14px] text-[#64748B]">Founder</p>
            </div>
            <div className="absolute top-6 right-12 opacity-20 pointer-events-none">
               <span className="text-[10px] font-bold tracking-tight text-[#111827]">MakeIt<span className="text-[#6366f1]">Ads</span></span>
            </div>
          </div>

          <div className="px-6 pb-4">
            <p className="text-[17px] font-medium text-[#374151] leading-[1.5] line-clamp-3">
              {message.message}
            </p>
            
            <p className="mt-4 text-[14px] text-[#64748B] italic font-medium">
              — Darrell <br />
              <span className="not-italic font-normal text-[12px] uppercase tracking-wide">Founder</span>
            </p>
          </div>

          <div className="px-6 pb-6 pt-2">
            {message.button_text && message.button_url && (
              <Link
                href={message.button_url}
                onClick={handleClick}
                className="block w-full text-center py-3 px-4 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white font-semibold text-[15px] shadow-lg shadow-[#6366F1]/20 hover:shadow-xl hover:scale-[1.02] transition-all duration-200"
              >
                {message.button_text}
              </Link>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}