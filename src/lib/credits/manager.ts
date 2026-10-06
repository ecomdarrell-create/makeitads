import { createClient } from '@/lib/supabase/server';
import { CREDIT_COSTS, type CreditAction } from '@/config/pricing.config';

// Ré-export pour compatibilité avec les imports existants
export { CREDIT_COSTS };
export type { CreditAction };

// ======================================================
// TYPES
// ======================================================

export interface CreditReservation {
  transactionId: string;
  reservedAmount: number;
  balanceBefore: number;
}

// ======================================================
// VÉRIFICATION DES CRÉDITS
// ======================================================

/**
 * Vérifie si l'utilisateur a assez de crédits pour une action.
 */
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
// RÉSERVATION DES CRÉDITS
// ======================================================

/**
 * Réserve les crédits avant une génération (opération atomique logique).
 * Retourne la réservation ou null si les crédits sont insuffisants.
 */
export async function reserveCredits(
  userId: string,
  action: CreditAction,
  referenceId?: string,
  amountOverride?: number
): Promise<CreditReservation | null> {
  const supabase = await createClient();
  const amount = amountOverride ?? CREDIT_COSTS[action];

  // Récupérer le solde actuel
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

  // Débiter immédiatement (sera remboursé si échec)
  const newBalance = profile.credits_balance - amount;

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

  // Créer la transaction
  const transactionType =
    action === 'DIAGNOSTIC_FLASH' ? 'generation_flash' : 'generation_complete';

  const { data: transaction, error: transactionError } = await supabase
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

  if (transactionError || !transaction) {
    console.error('Erreur création transaction:', transactionError);
    // Rembourser immédiatement en cas d'échec
    await refundCredits(userId, amount, 'Erreur système - Remboursement automatique');
    return null;
  }

  return {
    transactionId: transaction.id,
    reservedAmount: amount,
    balanceBefore: profile.credits_balance,
  };
}

// ======================================================
// CONFIRMATION DE RÉSERVATION
// ======================================================

/**
 * Valide la réservation après succès de la génération.
 */
export async function confirmReservation(
  userId: string,
  transactionId: string,
  strategyId: string
): Promise<boolean> {
  const supabase = await createClient();

  const { error } = await supabase
    .from('credit_transactions')
    .update({
      reference_id: strategyId,
      description: 'Génération réussie',
    })
    .eq('id', transactionId);

  if (error) {
    console.error('Erreur confirmation réservation:', error);
    return false;
  }

  return true;
}

// ======================================================
// REMBOURSEMENT
// ======================================================

/**
 * Rembourse les crédits en cas d'échec.
 */
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

  const { error: transactionError } = await supabase
    .from('credit_transactions')
    .insert({
      user_id: userId,
      type: 'refund',
      amount: amount,
      balance_after: newBalance,
      description: reason,
    });

  if (transactionError) {
    console.error('Erreur transaction remboursement:', transactionError);
    return false;
  }

  return true;
}

// ======================================================
// LECTURE DU SOLDE
// ======================================================

/**
 * Récupère le solde actuel d'un utilisateur.
 */
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

/**
 * Récupère l'historique des transactions d'un utilisateur.
 */
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