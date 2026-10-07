import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { PRICING_CONFIG, normalizePlanId, type PlanId } from '@/config/pricing.config';

// ============================================
// ADMIN EMAIL
// ============================================

const ADMIN_EMAIL = 'ecomdarrell@gmail.com';

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error('Variables Supabase manquantes');
  }

  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

// ============================================
// POST — Modifier un utilisateur
// ============================================

export async function POST(req: NextRequest) {
  try {
    // 1. Vérifier que le demandeur est admin
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || user.email !== ADMIN_EMAIL) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
    }

    // 2. Récupérer les données
    const { email, plan, credits, action } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email requis' }, { status: 400 });
    }

    const supabaseAdmin = getSupabaseAdmin();

    // 3. Chercher l'utilisateur
    const { data: usersList } = await supabaseAdmin.auth.admin.listUsers();
    const targetUser = usersList?.users?.find(
      (u) => u.email?.toLowerCase() === email.toLowerCase().trim()
    );

    if (!targetUser) {
      return NextResponse.json(
        { error: `Aucun utilisateur trouvé pour ${email}` },
        { status: 404 }
      );
    }

    // 4. Préparer les mises à jour
    const updates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    // Mise à jour du plan
    if (plan) {
      const normalizedPlan = normalizePlanId(plan);
      updates.plan = normalizedPlan;

      // Si on change de plan ET que credits n'est pas explicitement fourni,
      // on met les crédits du nouveau plan
      if (credits === undefined) {
        updates.credits_balance = PRICING_CONFIG[normalizedPlan].monthlyCredits;
      }
    }

    // Mise à jour des crédits (explicite)
    if (credits !== undefined) {
      updates.credits_balance = credits;
    }

    // 5. Appliquer la mise à jour
    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update(updates)
      .eq('id', targetUser.id);

    if (updateError) {
      console.error('Erreur update:', updateError);
      return NextResponse.json(
        { error: 'Erreur mise à jour profil' },
        { status: 500 }
      );
    }

    // 6. Enregistrer la transaction
    await supabaseAdmin.from('credit_transactions').insert({
      user_id: targetUser.id,
      type: 'admin_adjustment',
      amount: credits !== undefined ? credits : 0,
      balance_after: updates.credits_balance || 0,
      description: `Modification admin par ${user.email} — action: ${action || 'update'}`,
    });

    console.log(`Admin update: ${email} -> plan=${updates.plan}, credits=${updates.credits_balance}`);

    return NextResponse.json({
      success: true,
      userId: targetUser.id,
      email: targetUser.email,
      updates,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur inconnue';
    console.error('Erreur admin update:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ============================================
// GET — Lister les utilisateurs
// ============================================

export async function GET(req: NextRequest) {
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || user.email !== ADMIN_EMAIL) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
    }

    const supabaseAdmin = getSupabaseAdmin();

    // Récupérer les 100 derniers profils
    const { data: profiles, error } = await supabaseAdmin
      .from('profiles')
      .select('id, email, plan, credits_balance, created_at, updated_at')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, profiles });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur inconnue';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}