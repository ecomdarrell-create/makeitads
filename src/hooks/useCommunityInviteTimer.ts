'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

// ✅ 90 secondes d'activité réelle (CDC)
const TARGET_TIME_MS = 90 * 1000;
const REFUSE_COOLDOWN_MS = 10 * 60 * 1000;
const MAX_DISPLAYS_PER_DAY = 2;
const MAX_REFUSES_BEFORE_LONG_BLOCK = 3;
const LONG_BLOCK_MS = 7 * 24 * 60 * 60 * 1000;

const EXCLUDED_PATHS = [
  '/login',
  '/signup',
  '/sign-up',
  '/dashboard/generate',
  '/dashboard/pricing',
  '/forgot-password',
  '/community',
];

interface UseCommunityInviteTimerOptions {
  hasAcceptedServerSide: boolean;
  /** ✅ NOUVEAU : le user doit être inscrit pour voir le popup */
  isAuthenticated: boolean;
}

export function useCommunityInviteTimer({
  hasAcceptedServerSide,
  isAuthenticated,
}: UseCommunityInviteTimerOptions) {
  const pathname = usePathname();
  const [showPopup, setShowPopup] = useState(false);
  const [hasAccepted, setHasAccepted] = useState(hasAcceptedServerSide);

  const accumulatedTimeRef = useRef(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const forcedTriggerRef = useRef(false);

  const storageKeys = {
    lastClosedAt: 'mia_popup_last_closed',
    displayCount: 'mia_popup_display_count',
    displayDate: 'mia_popup_display_date',
    refuseCount: 'mia_popup_refuse_count',
    hasAccepted: 'mia_popup_has_accepted',
  };

  // Sync avec le serveur
  useEffect(() => {
    if (hasAcceptedServerSide) {
      setHasAccepted(true);
      localStorage.setItem(storageKeys.hasAccepted, 'true');
      return;
    }
    if (typeof window !== 'undefined' && localStorage.getItem(storageKeys.hasAccepted) === 'true') {
      setHasAccepted(true);
    }
  }, [hasAcceptedServerSide]);

  // ✅ NOUVEAU : écouter l'event "strategy-generated" pour forcer l'affichage
  useEffect(() => {
    if (!isAuthenticated || hasAccepted) return;

    const handleStrategyGenerated = () => {
      forcedTriggerRef.current = true;
      setShowPopup(true);
    };

    window.addEventListener('makeitads:strategy-generated', handleStrategyGenerated);
    return () => {
      window.removeEventListener('makeitads:strategy-generated', handleStrategyGenerated);
    };
  }, [isAuthenticated, hasAccepted]);

  // Timer principal
  useEffect(() => {
    // ❌ Skip si non-inscrit
    if (!isAuthenticated) return;
    if (hasAccepted) return;
    if (EXCLUDED_PATHS.some((path) => pathname.startsWith(path))) return;
    if (forcedTriggerRef.current) return;

    const now = Date.now();

    // Cooldowns
    const refuseCount = parseInt(localStorage.getItem(storageKeys.refuseCount) || '0', 10);
    const lastRefuseTime = parseInt(localStorage.getItem(storageKeys.lastClosedAt) || '0', 10);

    if (refuseCount >= MAX_REFUSES_BEFORE_LONG_BLOCK) {
      if (now - lastRefuseTime < LONG_BLOCK_MS) return;
      localStorage.setItem(storageKeys.refuseCount, '0');
    }

    if (now - lastRefuseTime < REFUSE_COOLDOWN_MS) return;

    // Max par jour
    const displayDate = localStorage.getItem(storageKeys.displayDate);
    const displayCount = parseInt(localStorage.getItem(storageKeys.displayCount) || '0', 10);
    const isSameDay = displayDate === new Date().toDateString();
    if (isSameDay && displayCount >= MAX_DISPLAYS_PER_DAY) return;

    const tick = () => {
      // ✅ Activité réelle = page visible ET fenêtre focus
      if (document.visibilityState === 'visible' && document.hasFocus()) {
        accumulatedTimeRef.current += 100;

        if (accumulatedTimeRef.current >= TARGET_TIME_MS && !showPopup) {
          setShowPopup(true);

          const today = new Date().toDateString();
          const currentCount = parseInt(localStorage.getItem(storageKeys.displayCount) || '0', 10);

          if (localStorage.getItem(storageKeys.displayDate) !== today) {
            localStorage.setItem(storageKeys.displayDate, today);
            localStorage.setItem(storageKeys.displayCount, '1');
          } else {
            localStorage.setItem(storageKeys.displayCount, String(currentCount + 1));
          }
        }
      }
    };

    timerRef.current = setInterval(tick, 100);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [pathname, hasAccepted, showPopup, isAuthenticated]);

  const handleAccept = () => {
    setShowPopup(false);
    setHasAccepted(true);
    forcedTriggerRef.current = false;
    localStorage.setItem(storageKeys.hasAccepted, 'true');
  };

  const handleRefuse = () => {
    setShowPopup(false);
    accumulatedTimeRef.current = 0;
    forcedTriggerRef.current = false;

    const currentRefuses = parseInt(localStorage.getItem(storageKeys.refuseCount) || '0', 10);
    localStorage.setItem(storageKeys.refuseCount, String(currentRefuses + 1));
    localStorage.setItem(storageKeys.lastClosedAt, String(Date.now()));
  };

  return { showPopup, handleAccept, handleRefuse };
}