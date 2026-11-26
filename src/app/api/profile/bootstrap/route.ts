import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { ensureUserProfile } from '@/lib/profiles/ensure-profile';

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // ✅ Cas 1 : Utilisateur authentifié (depuis le dashboard)
    if (user) {
      const profile = await ensureUserProfile(user);
      return NextResponse.json({
        profile: {
          plan: profile.plan,
          creditsBalance: profile.credits_balance,
        },
      });
    }

    // ✅ Cas 2 : Pas de session (post-signUp, avant confirmation email)
    // On utilise le userId fourni dans le body + createAdminClient (bypass RLS)
    const body = await req.json();
    const { userId, firstName, lastName, currency } = body;

    if (!userId) {
      return NextResponse.json({ error: 'userId ou session requis.' }, { status: 401 });
    }

    const admin = createAdminClient();

    const { error: updateError } = await admin
      .from('profiles')
      .update({
        first_name: firstName || null,
        last_name: lastName || null,
        currency: currency || 'XOF',
      })
      .eq('id', userId);

    if (updateError) {
      console.error('🚨 [bootstrap] Update profile error:', updateError);
      return NextResponse.json(
        { error: 'Impossible de mettre à jour le profil.', details: updateError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('🚨 [bootstrap] Erreur:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur serveur.' },
      { status: 500 }
    );
  }
}