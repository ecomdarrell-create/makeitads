// ============================================
// CONFIGURATION FAQ CHATBOT
// ============================================

export interface FAQEntry {
  keywords: string[];
  question: string;
  answer: string;
  category: 'pricing' | 'credits' | 'usage' | 'support' | 'plans';
}

export const FAQ_DATABASE: FAQEntry[] = [
  // ─── PRIX ───
  {
    keywords: ['prix', 'tarif', 'coût', 'combien', 'coute', 'coute', 'paye'],
    question: 'Combien coûte MakeItAds ?',
    answer: `MakeItAds propose 4 plans :
• **Démo** : 0 FCFA — 10 crédits offerts (2 Diagnostics Flash)
• **Pro** : 10 000 FCFA/an — 50 crédits/mois (5 stratégies complètes)
• **Premium** : 25 000 FCFA/an — 150 crédits/mois (15 stratégies complètes)
• **Élite** : 100 000 FCFA/an — 500 crédits/mois (50 stratégies complètes)

Tous les plans annuels incluent le renouvellement automatique des crédits chaque mois.`,
    category: 'pricing',
  },

  // ─── CRÉDITS ───
  {
    keywords: ['crédit', 'credit', 'combien de crédit', 'consommation', 'dépense'],
    question: 'Comment fonctionnent les crédits ?',
    answer: `Chaque génération consomme des crédits :
• **Diagnostic Flash** = 5 crédits (aperçu rapide, réservé au plan Démo)
• **Stratégie Complète** = 10 crédits (12 sections détaillées, à partir du plan Pro)

Vos crédits sont **renouvelés automatiquement chaque mois** selon votre plan. Les crédits non utilisés ne sont pas reportés, donc générez régulièrement !`,
    category: 'credits',
  },

  {
    keywords: ['recharge', 'recharger', 'acheter des crédits', 'plus de crédits'],
    question: 'Comment recharger mes crédits ?',
    answer: `Si vous épuisez vos crédits du mois, vous avez 2 options :

1. **Recharge ponctuelle** (dès maintenant) :
   • +10 crédits = 1 500 FCFA
   • +30 crédits = 4 000 FCFA
   • +80 crédits = 9 000 FCFA

2. **Passer au plan supérieur** pour plus de crédits mensuels.

Rendez-vous sur **Dashboard → Crédits** pour recharger.`,
    category: 'credits',
  },

  // ─── FONCTIONNEMENT ───
  {
    keywords: ['comment ça marche', 'comment fonctionne', 'utiliser', 'générer', 'stratégie'],
    question: 'Comment générer une stratégie ?',
    answer: `C'est simple :

1. Cliquez sur **"Nouvelle stratégie"** dans le menu
2. Remplissez le brief en 8 étapes (entreprise, offre, audience, budget...)
3. Notre IA analyse votre business
4. Vous recevez une stratégie complète avec :
   • Ciblage précis
   • Scripts WhatsApp prêts à copier
   • Allocation budgétaire
   • KPIs à suivre
   • Plan d'action sur 7 jours

⏱️ Temps total : environ 5 minutes.`,
    category: 'usage',
  },

  {
    keywords: ['différence flash', 'complète', 'flash vs'],
    question: 'Quelle est la différence entre Flash et Complète ?',
    answer: `**Diagnostic Flash** (plan Démo uniquement) :
• 3 sections : Diagnostic, Avatar client, Angle publicitaire
• Aperçu rapide de votre potentiel
• Coût : 5 crédits

**Stratégie Complète** (plans Pro, Premium, Élite) :
• 12 sections détaillées (ciblage, scripts, budget, KPIs, plan d'action...)
• Recommandations opérationnelles
• Coût : 10 crédits

Le Flash est conçu pour **découvrir la qualité** de MakeItAds. Les plans payants donnent accès aux stratégies réellement actionnables.`,
    category: 'usage',
  },

  // ─── CONTACT / SUPPORT ───
  {
    keywords: ['contact', 'parler', 'humain', 'support', 'aide'],
    question: 'Comment contacter le support ?',
    answer: `Vous pouvez nous joindre via :

• **Telegram** : @MakeitAds_CEO
• **Email** : reply@makeitads.pro

Réponse sous 24-48h pour le plan Pro, sous 12h pour Premium, sous 1h pour Élite.`,
    category: 'support',
  },

  // ─── PAIEMENT ───
  {
    keywords: ['paiement', 'payer', 'mobile money', 'wave', 'orange money', 'mtn'],
    question: 'Quels moyens de paiement acceptez-vous ?',
    answer: `Nous acceptons :

• **Mobile Money** : Wave, Orange Money, MTN MoMo, Moov Money
• **Cartes bancaires** : Visa, Mastercard
• **Virement bancaire** (sur demande pour Élite)

Tous les paiements sont sécurisés via Chariow.`,
    category: 'support',
  },

  // ─── SÉCURITÉ ───
  {
    keywords: ['sécurisé', 'confiance', 'remboursement', 'garantie'],
    question: 'Mes paiements sont-ils sécurisés ?',
    answer: `Absolument. Tous les paiements passent par **Chariow**, une plateforme de paiement sécurisée utilisée par des milliers de vendeurs en Afrique.

Nous acceptons les paiements Mobile Money et cartes bancaires. Vos données bancaires ne transitent jamais par nos serveurs.`,
    category: 'support',
  },

  // ─── PLAN À CHOISIR ───
  {
    keywords: ['quel plan', 'choisir', 'recommandé', 'conseil plan'],
    question: 'Quel plan choisir ?',
    answer: `Ça dépend de votre situation :

• **Vous découvrez MakeItAds** → Commencez par le **Démo** (gratuit)
• **Vous lancez vos premières campagnes** → **Pro** (10 000 F/an)
• **Vous voulez dominer votre niche** → **Premium** (25 000 F/an)
• **Vous êtes une agence ou équipe** → **Élite** (100 000 F/an)

La plupart des entrepreneurs commencent par le Pro, puis passent au Premium après 3-6 mois.`,
    category: 'plans',
  },

  // ─── RENOUVELLEMENT ───
  {
    keywords: ['renouvellement', 'expire', 'expiration', 'renouveler', 'abonnement'],
    question: 'Que se passe-t-il à la fin de mon abonnement ?',
    answer: `Votre abonnement est valable **12 mois** à partir de la date d'achat.

À la fin de cette période :
• Votre plan passe automatiquement au **Démo**
• Vos crédits du mois sont remis à zéro
• Vous pouvez renouveler à tout moment

Nous vous envoyons un **rappel 30 jours avant** l'expiration pour que vous puissiez renouveler.`,
    category: 'plans',
  },

  // ─── AFRIQUE ───
  {
    keywords: ['afrique', 'africain', 'local', 'adapté'],
    question: 'MakeItAds est-il adapté au marché africain ?',
    answer: `C'est notre **ADN**.

Nos stratégies sont calibrées pour :
• **WhatsApp** comme canal de conversion principal
• **Mobile Money** (Wave, Orange Money, MTN)
• Les **codes de confiance locaux**
• Les **budgets en FCFA** réalistes

Nous ne traduisons pas des stratégies américaines. Nous les adaptons à la réalité africaine.`,
    category: 'usage',
  },

  // ─── RÉSULTATS ───
  {
    keywords: ['résultat', 'vente', 'marcher', 'efficace', 'roi'],
    question: 'Est-ce que ça marche vraiment ?',
    answer: `Nos utilisateurs actifs voient des résultats concrets :

• Scripts WhatsApp qui convertissent 3x mieux
• Ciblages précis qui baissent le coût par clic
• Plans d'action clairs qui évitent le hasard

⚠️ **Important** : MakeItAds vous donne la stratégie. Les résultats dépendent de votre **exécution**. Un plan appliqué sérieusement vaut mieux qu'un plan parfait ignoré.`,
    category: 'usage',
  },
];

// ============================================
// QUESTIONS SUGGÉRÉES (affichées au démarrage)
// ============================================

export const SUGGESTED_QUESTIONS = [
  'Quel plan choisir selon mes besoins ?',
  'Comment fonctionnent les crédits ?',
  'Comment générer ma première stratégie ?',
  'Quels sont les moyens de paiement ?',
  'Comment recharger mes crédits ?',
  'MakeItAds est-il adapté à l\'Afrique ?',
];

// ============================================
// DÉTECTION DE FAQ
// ============================================

/**
 * Essaie de trouver une réponse FAQ basée sur les mots-clés du message.
 * Retourne null si aucun match pertinent.
 */
export function findFAQAnswer(message: string): { question: string; answer: string } | null {
  const normalized = message.toLowerCase().trim();
  if (!normalized || normalized.length < 3) return null;

  let bestMatch: { entry: FAQEntry; score: number } | null = null;

  for (const entry of FAQ_DATABASE) {
    let score = 0;
    for (const keyword of entry.keywords) {
      if (normalized.includes(keyword.toLowerCase())) {
        // Plus le mot-clé est long, plus le score est élevé
        score += keyword.length;
      }
    }

    // Score minimum pour considérer un match
    if (score >= 4 && (!bestMatch || score > bestMatch.score)) {
      bestMatch = { entry, score };
    }
  }

  if (bestMatch) {
    return {
      question: bestMatch.entry.question,
      answer: bestMatch.entry.answer,
    };
  }

  return null;
}