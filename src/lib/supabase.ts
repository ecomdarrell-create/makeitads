import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // ✅ NE PAS LANCER D'ERREUR SI VARIABLES MANQUANTES
  if (!url || !anon) {
    console.warn("Supabase environment variables not available. Returning mock client.");
    return {
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
        getSession: async () => ({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signOut: async () => ({ error: null }),
        signInWithPassword: async () => ({ data: null, error: new Error('Supabase not configured') }),
        signUp: async () => ({ data: null, error: new Error('Supabase not configured') }),
        signInWithOAuth: async () => ({ data: null, error: new Error('Supabase not configured') }),
        exchangeCodeForSession: async () => ({ data: null, error: new Error('Supabase not configured') }),
      },
      from: () => ({
        select: () => ({ data: [], error: null }),
        insert: () => ({ data: null, error: null }),
        update: () => ({ data: null, error: null }),
        delete: () => ({ data: null, error: null }),
        rpc: async () => ({ data: null, error: null }),
      }),
    } as any;
  }

  return createBrowserClient(url, anon);
}