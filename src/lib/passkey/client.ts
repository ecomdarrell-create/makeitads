// Wrapper safe autour de l'API Supabase Passkeys (BETA).
// - Guards runtime : si l'API n'existe pas dans la version installée, on throw une erreur claire.
// - `as any` local : isole les types beta dans ce fichier, pour ne pas casser le build TS ailleurs.

import type { SupabaseClient, Session, User } from '@supabase/supabase-js';

export type PasskeyRecord = {
  id: string;
  friendly_name?: string | null;
  created_at?: string | null;
  last_used_at?: string | null;
};

function getPasskeyApi(supabase: SupabaseClient) {
  const auth = supabase.auth as any;
  return {
    register: auth.registerPasskey?.bind(auth) as
      | (() => Promise<{ data: any; error: any }>)
      | undefined,
    signIn: auth.signInWithPasskey?.bind(auth) as
      | (() => Promise<{ data: { session: Session | null; user: User | null }; error: any }>)
      | undefined,
    list: auth.passkey?.list?.bind(auth.passkey) as
      | (() => Promise<{ data: PasskeyRecord[] | null; error: any }>)
      | undefined,
    update: auth.passkey?.update?.bind(auth.passkey) as
      | ((args: { passkeyId: string; friendlyName: string }) => Promise<{ data: any; error: any }>)
      | undefined,
    remove: auth.passkey?.delete?.bind(auth.passkey) as
      | ((args: { passkeyId: string }) => Promise<{ data: any; error: any }>)
      | undefined,
  };
}

export function isPasskeyApiAvailable(supabase: SupabaseClient): boolean {
  const api = getPasskeyApi(supabase);
  return Boolean(api.register && api.signIn && api.list && api.update && api.remove);
}

/** Enregistre une nouvelle passkey pour l'utilisateur actuellement connecté. */
export async function registerPasskey(supabase: SupabaseClient): Promise<void> {
  const api = getPasskeyApi(supabase);
  if (!api.register) {
    throw new Error(
      "L'API Passkeys n'est pas disponible. Vérifie que @supabase/supabase-js est ≥ 2.105.0."
    );
  }
  const { error } = await api.register();
  if (error) throw error;
}

/** Connexion passwordless par passkey (discoverable credential, sans email). */
export async function signInWithPasskey(
  supabase: SupabaseClient
): Promise<{ session: Session; user: User }> {
  const api = getPasskeyApi(supabase);
  if (!api.signIn) {
    throw new Error(
      "L'API Passkeys n'est pas disponible. Vérifie que @supabase/supabase-js est ≥ 2.105.0."
    );
  }
  const { data, error } = await api.signIn();
  if (error) throw error;
  if (!data?.session || !data?.user) {
    throw new Error("La session n'a pas pu être établie.");
  }
  return { session: data.session, user: data.user };
}

/** Liste les passkeys du compte connecté. */
export async function listPasskeys(supabase: SupabaseClient): Promise<PasskeyRecord[]> {
  const api = getPasskeyApi(supabase);
  if (!api.list) throw new Error("L'API Passkeys n'est pas disponible.");
  const { data, error } = await api.list();
  if (error) throw error;
  return data ?? [];
}

/** Renomme une passkey (ex: « iPhone personnel »). */
export async function renamePasskey(
  supabase: SupabaseClient,
  passkeyId: string,
  friendlyName: string
): Promise<void> {
  const api = getPasskeyApi(supabase);
  if (!api.update) throw new Error("L'API Passkeys n'est pas disponible.");
  const { error } = await api.update({ passkeyId, friendlyName });
  if (error) throw error;
}

/** Supprime une passkey du compte. */
export async function deletePasskey(
  supabase: SupabaseClient,
  passkeyId: string
): Promise<void> {
  const api = getPasskeyApi(supabase);
  if (!api.remove) throw new Error("L'API Passkeys n'est pas disponible.");
  const { error } = await api.remove({ passkeyId });
  if (error) throw error;
}