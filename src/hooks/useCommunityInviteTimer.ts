'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

const TARGET_TIME_MS = 18 * 1000; // ✅ 18 secondes (entre 15 et 20)
const REFUSE_COOLDOWN_MS = 10 * 60 * 1000;
const MAX_DISPLAYS_PER_DAY = 2;
const MAX_REFUSES_BEFORE_LONG_BLOCK = 3;
const LONG_BLOCK_MS = 7 * 24 * 60 * 60 * 1000;

const EXCLUDED_PATHS = ['/login', '/signup', '/sign-up', '/dashboard/generate', '/dashboard/pricing', '/forgot-password'];

export function useCommunityInviteTimer(hasAcceptedServerSide: boolean) {
  const pathname = usePathname();
  const [showPopup, setShowPopup] = useState(false);
  const [hasAccepted, setHasAccepted] = useState(hasAcceptedServerSide);
  
  const accumulatedTimeRef = useRef(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const storageKeys = {
    lastClosedAt: 'mia_popup_last_closed',
    displayCount: 'mia_popup_display_count',
    displayDate: 'mia_popup_display_date',
    refuseCount: 'mia_popup_refuse_count',
    hasAccepted: 'mia_popup_has_accepted',
  };

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

  useEffect(() => {
    if (hasAccepted) return;
    if (EXCLUDED_PATHS.some(path => pathname.startsWith(path))) return;

    const now = Date.now();
    
    const refuseCount = parseInt(localStorage.getItem(storageKeys.refuseCount) || '0', 10);
    const lastRefuseTime = parseInt(localStorage.getItem(storageKeys.lastClosedAt) || '0', 10);
    
    if (refuseCount >= MAX_REFUSES_BEFORE_LONG_BLOCK) {
      if (now - lastRefuseTime < LONG_BLOCK_MS) return;
      localStorage.setItem(storageKeys.refuseCount, '0');
    }

    if (now - lastRefuseTime < REFUSE_COOLDOWN_MS) return;

    const displayDate = localStorage.getItem(storageKeys.displayDate);
    const displayCount = parseInt(localStorage.getItem(storageKeys.displayCount) || '0', 10);
    
    const isSameDay = displayDate === new Date().toDateString();
    if (isSameDay && displayCount >= MAX_DISPLAYS_PER_DAY) return;

    const tick = () => {
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
  }, [pathname, hasAccepted, showPopup]);

  const handleAccept = () => {
    setShowPopup(false);
    setHasAccepted(true);
    localStorage.setItem(storageKeys.hasAccepted, 'true');
  };

  const handleRefuse = () => {
    setShowPopup(false);
    accumulatedTimeRef.current = 0;
    
    const currentRefuses = parseInt(localStorage.getItem(storageKeys.refuseCount) || '0', 10);
    localStorage.setItem(storageKeys.refuseCount, String(currentRefuses + 1));
    localStorage.setItem(storageKeys.lastClosedAt, String(Date.now()));
  };

  return { showPopup, handleAccept, handleRefuse };
}