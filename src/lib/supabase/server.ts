import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

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

    throw new Error(
      `❌ Variables Supabase manquantes côté serveur : ${missing.join(", ")}. Vérifie ton .env.local et redémarre Next.js.`
    );
  }

  return { url, anon };
}

// ═══════════════════════════════════════════════════════════
// CLIENT SERVEUR (pour Server Components et Route Handlers)
// ═══════════════════════════════════════════════════════════

export async function createClient() {
  const cookieStore = await cookies();
  const { url, anon } = getEnvOrThrow();

  return createServerClient(url, anon, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Appelé depuis un Server Component en lecture seule → ignorer.
        }
      },
    },
  });
}