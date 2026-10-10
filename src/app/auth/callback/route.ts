export const dynamic = 'force-dynamic';

import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";
  const intent = searchParams.get("intent"); // 'signup' ou 'login'

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=auth_callback_error`);
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error || !data?.user) {
      return NextResponse.redirect(`${origin}/login?error=auth_callback_error`);
    }

    const user = data.user;

    // ✅ Détection : OAuth a créé un nouveau compte via Google
    // Mais l'email existe déjà avec une AUTRE identité → on bloque
    const createdAt = new Date(user.created_at).getTime();
    const now = Date.now();
    const isJustCreated = now - createdAt < 10_000; // créé il y a moins de 10s

    // Si l'utilisateur a plusieurs identités → il existait déjà, c'est OK (connexion classique)
    // Si une seule identité ET créé à l'instant ET l'intent était "signup" → c'est une nouvelle inscription, OK
    // Si une seule identité ET créé à l'instant ET l'intent était "login" → l'utilisateur voulait se connecter mais s'est retrouvé inscrit → suspect
    if (
      intent === 'login' &&
      isJustCreated &&
      Array.isArray(user.identities) &&
      user.identities.length === 1
    ) {
      // Déconnecter et renvoyer vers login avec un message
      await supabase.auth.signOut();
      return NextResponse.redirect(
        `${origin}/login?error=no_account_found`
      );
    }

    return NextResponse.redirect(`${origin}${next}`);
  } catch (err) {
    console.error("Exception in auth callback:", err);
    return NextResponse.redirect(`${origin}/login?error=auth_callback_error`);
  }
}