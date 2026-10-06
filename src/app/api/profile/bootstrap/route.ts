import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ensureUserProfile } from '@/lib/profiles/ensure-profile';

export async function POST() {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json({ error: 'Session utilisateur requise.' }, { status: 401 });
    }

    const profile = await ensureUserProfile(user);
    return NextResponse.json({
      profile: {
        plan: profile.plan,
        creditsBalance: profile.credits_balance,
      },
    });
  } catch (error) {
    console.error('Erreur bootstrap profil:', error);
    return NextResponse.json({ error: 'Impossible de préparer le profil utilisateur.' }, { status: 500 });
  }
}