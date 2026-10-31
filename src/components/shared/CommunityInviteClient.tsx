'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { CommunityInvitePopup } from './CommunityInvitePopup';
import { useCommunityInviteTimer } from '@/hooks/useCommunityInviteTimer';

export default function CommunityInviteClient() {
  const [user, setUser] = useState<{ id: string; email: string | null } | null>(null);
  const [firstName, setFirstName] = useState<string | undefined>(undefined);
  const [hasAcceptedServer, setHasAcceptedServer] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user) {
          setUser({ id: session.user.id, email: session.user.email || null });

          const { data: profile } = await supabase
            .from('profiles')
            .select('first_name, has_joined_telegram')
            .eq('id', session.user.id)
            .maybeSingle();

          if (profile?.first_name) {
            setFirstName(profile.first_name);
          }

          if (profile?.has_joined_telegram) {
            setHasAcceptedServer(true);
          }
        }
      } catch (error) {
        console.error('Erreur vérification utilisateur:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();
  }, []);

  const { showPopup, handleAccept, handleRefuse } = useCommunityInviteTimer({
    hasAcceptedServerSide: hasAcceptedServer,
    isAuthenticated: !!user,
  });

  if (isLoading || !showPopup) {
    return null;
  }

  return (
    <CommunityInvitePopup
      firstName={firstName}
      onSuccess={handleAccept}
      onClose={handleRefuse}
    />
  );
}