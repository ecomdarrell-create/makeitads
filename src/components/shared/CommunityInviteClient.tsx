'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import CommunityInvitePopup from './CommunityInvitePopup';
import { useCommunityInviteTimer } from '@/hooks/useCommunityInviteTimer';

export default function CommunityInviteClient() {
  const [user, setUser] = useState<{ id: string; email: string | null } | null>(null);
  const [hasAcceptedServer, setHasAcceptedServer] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          setUser({ id: session.user.id, email: session.user.email || null });
          
          // Vérifier si cet utilisateur a déjà accepté (maybeSingle évite l'erreur si 0 résultat)
          const { data, error } = await supabase
            .from('community_invite_requests')
            .select('id')
            .eq('user_id', session.user.id)
            .limit(1)
            .maybeSingle();
            
          if (data) {
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

  const { showPopup, handleAccept, handleRefuse } = useCommunityInviteTimer(hasAcceptedServer);

  // Ne pas rendre le composant pendant le chargement initial ou si le popup ne doit pas s'afficher
  if (isLoading || !showPopup) {
    return null;
  }

  return (
    <CommunityInvitePopup
      isOpen={showPopup}
      onClose={handleRefuse}
      onAccept={handleAccept}
      userId={user?.id || null}
      email={user?.email || null}
    />
  );
}