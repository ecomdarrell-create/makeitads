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

    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 10000); // 10 secondes

    return () => clearTimeout(timer);
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