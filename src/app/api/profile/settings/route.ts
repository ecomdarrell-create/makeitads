import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { ensureUserProfile } from '@/lib/profiles/ensure-profile';

const profileSchema = z.object({
  firstName: z.string().trim().min(1, 'Le prénom est requis.').max(80),
  lastName: z.string().trim().max(80).optional().default(''),
  phone: z
    .string()
    .trim()
    .max(20)
    .optional()
    .default('')
    .transform((v) => v || null),
  currency: z.enum(['XAF', 'XOF', 'EUR', 'USD']).default('XOF'),
});

export async function PATCH(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Session requise.' }, { status: 401 });
  }

  // Assure qu'un profil existe (au cas où)
  await ensureUserProfile(user);

  const parsed = profileSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return NextResponse.json(
      { error: firstIssue?.message || 'Données invalides.' },
      { status: 400 }
    );
  }

  const { firstName, lastName, phone, currency } = parsed.data;

  const adminClient = createAdminClient();
  const { error } = await adminClient
    .from('profiles')
    .update({
      first_name: firstName,
      last_name: lastName || null,
      phone: phone,
      currency: currency,
    })
    .eq('id', user.id);

  if (error) {
    console.error('Erreur mise à jour profil:', error.message);
    return NextResponse.json(
      { error: 'Impossible d’enregistrer le profil pour le moment.' },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}