'use client';

import { useState, useEffect } from 'react';
import CommunityInvitePopup from './CommunityInvitePopup';

interface CommunityInviteWrapperProps {
  hasAlreadyJoined: boolean;
  userId: string;
  email: string | null;
}

export default function CommunityInviteWrapper({ hasAlreadyJoined, userId, email }: CommunityInviteWrapperProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (hasAlreadyJoined) return;

    let hasTriggered = false;

    const triggerPopup = () => {
      if (!hasTriggered) {
        hasTriggered = true;
        setIsOpen(true);
      }
    };

    // 1. Déclencheur temporel : 4 secondes (entre 3 et 5s)
    const timer = setTimeout(triggerPopup, 4000);

    // 2. Déclencheur au scroll : dès que l'utilisateur descend de 50px
    const handleScroll = () => {
      if (window.scrollY > 50) {
        triggerPopup();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [hasAlreadyJoined]);

  if (hasAlreadyJoined) return null;

  return (
    <CommunityInvitePopup
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      onAccept={() => setIsOpen(false)}
      userId={userId}
      email={email}
    />
  );
}