import { createClient } from '@/lib/supabase/server';

// Configuration centrale des coûts (facile à modifier)
export const CREDIT_COSTS = {
  DIAGNOSTIC_FLASH: 1,
  STRATEGIE_COMPLETE: 5,
  ANALYSE_CONCURRENTIELLE: 3,
  ANALYSE_PUBLICITAIRE: 2,
  GENERATION_HOOKS: 1,
} as const;

export type CreditAction = keyof typeof CREDIT_COSTS;

export interface CreditReservation {
  transactionId: string;
  reservedAmount: number;
  balanceBefore: number;
}

/**
 * Vérifie si l'utilisateur a assez de crédits pour une action
 */
export async function checkCredits(userId: string, action: CreditAction): Promise<boolean> {
  const supabase = await createClient();
  const required = CREDIT_COSTS[action];

  const { data: profile } = await supabase
    .from('profiles')
    .select('credits_balance')
    .eq('id', userId)
    .single();

  return (profile?.credits_balance || 0) >= required;
}

/**
 * Réserve les crédits avant une génération (atomique)
 * Retourne la réservation ou null si pas assez de crédits
 */
export async function reserveCredits(
  userId: string,
  action: CreditAction,
  referenceId?: string
): Promise<CreditReservation | null> {
  const supabase = await createClient();
  const amount = CREDIT_COSTS[action];

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
    return null; // Pas assez de crédits
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
  const transactionType = action === 'DIAGNOSTIC_FLASH' ? 'generation_flash' : 'generation_complete';

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
    // Rembourser immédiatement
    await refundCredits(userId, amount, 'Erreur système - Remboursement automatique');
    return null;
  }

  return {
    transactionId: transaction.id,
    reservedAmount: amount,
    balanceBefore: profile.credits_balance,
  };
}

/**
 * Valide la réservation (après succès de la génération)
 */
export async function confirmReservation(
  userId: string,
  transactionId: string,
  strategyId: string
): Promise<boolean> {
  const supabase = await createClient();

  // Mettre à jour la transaction avec la référence de la stratégie
  const { error } = await supabase
    .from('credit_transactions')
    .update({
      reference_id: strategyId,
      description: 'Génération réussie',
    })
    .eq('id', transactionId);

  return !error;
}

/**
 * Rembourse les crédits (en cas d'échec)
 */
export async function refundCredits(
  userId: string,
  amount: number,
  reason: string
): Promise<boolean> {
  const supabase = await createClient();

  // Récupérer le solde actuel
  const { data: profile } = await supabase
    .from('profiles')
    .select('credits_balance')
    .eq('id', userId)
    .single();

  if (!profile) return false;

  const newBalance = profile.credits_balance + amount;

  // Rembourser
  const { error: updateError } = await supabase
    .from('profiles')
    .update({ credits_balance: newBalance })
    .eq('id', userId);

  if (updateError) return false;

  // Créer la transaction de remboursement
  const { error: transactionError } = await supabase
    .from('credit_transactions')
    .insert({
      user_id: userId,
      type: 'refund',
      amount: amount,
      balance_after: newBalance,
      description: reason,
    });

  return !transactionError;
}

/**
 * Récupère le solde actuel d'un utilisateur
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

/**
 * Récupère l'historique des transactions
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