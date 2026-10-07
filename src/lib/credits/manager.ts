import { createClient } from '@/lib/supabase/server';
import { CREDIT_COSTS, type CreditAction } from '@/config/pricing.config';

export { CREDIT_COSTS };
export type { CreditAction };

export interface CreditReservation {
  transactionId: string;
  reservedAmount: number;
  balanceBefore: number;
}

// ======================================================
// VÉRIFICATION
// ======================================================

export async function checkCredits(
  userId: string,
  action: CreditAction
): Promise<boolean> {
  const supabase = await createClient();
  const required = CREDIT_COSTS[action];

  const { data: profile } = await supabase
    .from('profiles')
    .select('credits_balance')
    .eq('id', userId)
    .single();

  return (profile?.credits_balance || 0) >= required;
}

// ======================================================
// RÉSERVATION (le solde est la source de vérité)
// ======================================================

export async function reserveCredits(
  userId: string,
  action: CreditAction,
  referenceId?: string,
  amountOverride?: number
): Promise<CreditReservation | null> {
  const supabase = await createClient();
  const amount = amountOverride ?? CREDIT_COSTS[action];

  // 1. Récupérer le solde actuel
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('credits_balance')
    .eq('id', userId)
    .single();

  if (profileError || !profile) {
    console.error('Erreur récupération profil:', profileError);
    return null;
  }

  if (profile.credits_balance < amount) {
    return null;
  }

  const newBalance = profile.credits_balance - amount;

  // 2. Débiter le solde — C'EST LA SEULE OPÉRATION CRITIQUE
  const { data: updatedProfile, error: updateError } = await supabase
    .from('profiles')
    .update({ credits_balance: newBalance })
    .eq('id', userId)
    .select('credits_balance')
    .single();

  if (updateError || !updatedProfile) {
    console.error('Erreur mise à jour crédits:', updateError);
    return null;
  }

  // 3. Enregistrer la transaction — FIRE AND FORGET (ne bloque pas)
  const transactionType =
    action === 'DIAGNOSTIC_FLASH' ? 'generation_flash' : 'generation_complete';

  const { data: transaction } = await supabase
    .from('credit_transactions')
    .insert({
      user_id: userId,
      type: transactionType,
      amount: -amount,
      balance_after: newBalance,
      reference_id: referenceId,
      description: `Réservation pour ${action}`,
    })
    .select()
    .single();

  // Si la transaction échoue, on ne rembourse PAS — le solde est déjà débité
  if (!transaction) {
    console.warn('Transaction non enregistrée (mais solde bien débité)');
  }

  return {
    transactionId: transaction?.id || 'no-transaction',
    reservedAmount: amount,
    balanceBefore: profile.credits_balance,
  };
}

// ======================================================
// CONFIRMATION
// ======================================================

export async function confirmReservation(
  userId: string,
  transactionId: string,
  strategyId: string
): Promise<boolean> {
  if (transactionId === 'no-transaction') return true;

  const supabase = await createClient();

  const { error } = await supabase
    .from('credit_transactions')
    .update({
      reference_id: strategyId,
      description: 'Génération réussie',
    })
    .eq('id', transactionId);

  return !error;
}

// ======================================================
// REMBOURSEMENT (uniquement si échec IA)
// ======================================================

export async function refundCredits(
  userId: string,
  amount: number,
  reason: string
): Promise<boolean> {
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from('profiles')
    .select('credits_balance')
    .eq('id', userId)
    .single();

  if (!profile) return false;

  const newBalance = profile.credits_balance + amount;

  const { error: updateError } = await supabase
    .from('profiles')
    .update({ credits_balance: newBalance })
    .eq('id', userId);

  if (updateError) {
    console.error('Erreur remboursement:', updateError);
    return false;
  }

  // Log du remboursement (fire and forget)
  await supabase.from('credit_transactions').insert({
    user_id: userId,
    type: 'refund',
    amount: amount,
    balance_after: newBalance,
    description: reason,
  });

  return true;
}

// ======================================================
// LECTURE DU SOLDE
// ======================================================

export async function getCreditBalance(userId: string): Promise<number> {
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from('profiles')
    .select('credits_balance')
    .eq('id', userId)
    .single();

  return profile?.credits_balance || 0;
}

// ======================================================
// HISTORIQUE
// ======================================================

export async function getCreditHistory(userId: string, limit: number = 50) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('credit_transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Erreur récupération historique:', error);
    return [];
  }

  return data || [];
}