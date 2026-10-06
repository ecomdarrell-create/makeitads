import { createBrowserClient } from "@supabase/ssr";

// ═══════════════════════════════════════════════════════════
// VALIDATION DES VARIABLES D'ENVIRONNEMENT
// ═══════════════════════════════════════════════════════════

function getEnvOrThrow() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anon) {
    const missing: string[] = [];
    if (!url) missing.push("NEXT_PUBLIC_SUPABASE_URL");
    if (!anon) missing.push("NEXT_PUBLIC_SUPABASE_ANON_KEY");

    const message = `❌ Variables Supabase manquantes : ${missing.join(", ")}.
Vérifie ton fichier .env.local et redémarre le serveur Next.js (npm run dev).`;

    console.error(message);
    throw new Error(message);
  }

  // Sécurité : vérifier que l'URL est valide
  try {
    new URL(url);
  } catch {
    throw new Error(
      `❌ NEXT_PUBLIC_SUPABASE_URL est invalide : "${url}". Attendu : https://xxxxx.supabase.co`
    );
  }

  return { url, anon };
}

// ═══════════════════════════════════════════════════════════
// SINGLETON : UN SEUL CLIENT POUR TOUT LE NAVIGATEUR
// ═══════════════════════════════════════════════════════════

let browserClient: ReturnType<typeof createBrowserClient> | null = null;

export function createClient() {
  if (browserClient) return browserClient;

  const { url, anon } = getEnvOrThrow();
  browserClient = createBrowserClient(url, anon);

  return browserClient;
}