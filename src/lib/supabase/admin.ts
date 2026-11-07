import { createClient } from '@supabase/supabase-js';

/**
 * Client admin (service_role) — UNIQUEMENT côté serveur.
 * Ne jamais importer ce fichier depuis un composant client.
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // ✅ Message d'erreur précis : on liste EXACTEMENT ce qui manque
  const missing: string[] = [];
  if (!supabaseUrl) missing.push('NEXT_PUBLIC_SUPABASE_URL');
  if (!supabaseServiceKey) missing.push('SUPABASE_SERVICE_ROLE_KEY');

  if (missing.length > 0) {
    throw new Error(
      `❌ [createAdminClient] Variables d'environnement manquantes : ${missing.join(', ')}.\n` +
      `→ Vérifie Vercel → Settings → Environment Variables (scope Production + Preview + Development).\n` +
      `→ Vérifie aussi ton fichier .env.local en local.`
    );
  }

  // ✅ Validation basique du format de l'URL
  try {
    new URL(supabaseUrl!);
  } catch {
    throw new Error(
      `❌ [createAdminClient] NEXT_PUBLIC_SUPABASE_URL invalide : "${supabaseUrl}". ` +
      `Attendu : https://xxxxx.supabase.co`
    );
  }

  // ✅ Validation basique du format de la service role key
  // Une service_role key Supabase est un JWT qui commence par "eyJ"
  // et contient "service_role" dans son payload une fois décodé.
  if (!supabaseServiceKey!.startsWith('eyJ')) {
    throw new Error(
      `❌ [createAdminClient] SUPABASE_SERVICE_ROLE_KEY invalide : elle doit commencer par "eyJ" ` +
      `(c'est un JWT). Vérifie que tu n'as pas collé la clé "anon" par erreur, ` +
      `ou une clé avec des espaces/retours à la ligne parasites.`
    );
  }

  return createClient(supabaseUrl!, supabaseServiceKey!, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}