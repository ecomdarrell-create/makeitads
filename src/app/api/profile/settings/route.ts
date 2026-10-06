import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { ensureUserProfile } from '@/lib/profiles/ensure-profile';

const profileSchema = z.object({
  firstName: z.string().trim().min(1).max(80),
  lastName: z.string().trim().max(80),
  country: z.string().trim().min(2).max(80),
});

export async function PATCH(request: Request) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Session requise.' }, { status: 401 });
  }

  await ensureUserProfile(user);

  const parsed = profileSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Vérifiez le prénom, le nom et le pays.' }, { status: 400 });
  }

  const adminClient = createAdminClient();
  const { error } = await adminClient
    .from('profiles')
    .update({
      first_name: parsed.data.firstName,
      last_name: parsed.data.lastName || null,
      country: parsed.data.country,
    })
    .eq('id', user.id);

  if (error) {
    console.error('Erreur mise à jour profil:', error.message);
    return NextResponse.json({ error: 'Impossible d’enregistrer le profil pour le moment.' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
