"use client";

import { useState, useEffect, useRef } from "react";
import { User, Session, AuthError } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  // ✅ FIX : commence à TRUE (attente de la session)
  const [loading, setLoading] = useState(true);
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    const supabase = createClient();

    supabase.auth.getSession().then(({ data: { session: currentSession } }: { data: { session: Session | null } }) => {
      if (isMounted.current) {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setLoading(false); // ✅ FIX : passe à FALSE quand la session est chargée
      }
    }).catch((error: AuthError) => {
      console.error('Erreur session:', error);
      if (isMounted.current) {
        setSession(null);
        setUser(null);
        setLoading(false); // ✅ FIX : passe à FALSE même en cas d'erreur
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: 'SIGNED_IN' | 'SIGNED_OUT' | 'TOKEN_REFRESHED' | 'USER_UPDATED', currentSession: Session | null) => {
      if (isMounted.current) {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setLoading(false); // ✅ FIX : dès qu'on a un event auth
      }
    });

    return () => {
      isMounted.current = false;
      subscription.unsubscribe();
    };
  }, []);

  return { user, session, loading };
}