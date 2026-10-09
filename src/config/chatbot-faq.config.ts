// ============================================
// CONFIGURATION FAQ CHATBOT
// Aucun appel API. Tout est local.
// ============================================

export const TELEGRAM_URL = 'https://t.me/MakeitAds_CEO';

export interface FAQEntry {
  keywords: string[];
  question: string;
  answer: string;
  category: 'pricing' | 'credits' | 'usage' | 'support' | 'plans';
}

// ============================================
// BASE DE CONNAISSANCES
// ============================================

export const FAQ_DATABASE: FAQEntry[] = [
  {
    keywords: ['prix', 'tarif', 'coût', 'coute', 'combien', 'cher', 'paye', 'payer', 'facture'],
    question: 'Combien coûte MakeItAds ?',
    answer: `Voici les 4 formules MakeItAds :

🎯 Démo : 0 FCFA (10 crédits offerts)
🎯 Pro : 10 000 FCFA/an (50 crédits/mois, 5 stratégies complètes)
🎯 Premium : 25 000 FCFA/an (150 crédits/mois, 15 stratégies complètes)
🎯 Élite : 100 000 FCFA/an (500 crédits/mois, 50 stratégies complètes)

Tous les plans payants incluent le renouvellement automatique des crédits chaque mois.`,
    category: 'pricing',
  },
  {
    keywords: ['quel plan', 'choisir', 'recommandé', 'conseil', 'meilleur plan', 'adapté'],
    question: 'Quel plan choisir pour mon business ?',
    answer: `Ça dépend de ta situation :

🆓 Tu découvres MakeItAds → commence par le Démo (gratuit)
🚀 Tu lances tes premières campagnes → Pro (10 000 F/an)
📈 Tu veux dominer ta niche → Premium (25 000 F/an)
👑 Tu es une agence ou une équipe → Élite (100 000 F/an)

La majorité des entrepreneurs commencent par le Pro, puis passent au Premium après 3 à 6 mois.`,
    category: 'plans',
  },
  {
    keywords: ['crédit', 'credit', 'consommation', 'dépense', 'combien de crédit', 'fonctionne'],
    question: 'Comment fonctionnent les crédits ?',
    answer: `Les crédits sont le carburant de MakeItAds :

🔹 Diagnostic Flash = 5 crédits (réservé au plan Démo)
🔹 Stratégie Complète = 10 crédits (à partir du plan Pro)

Tes crédits sont renouvelés automatiquement chaque mois selon ton plan. Les crédits non utilisés ne se reportent pas, donc pense à générer régulièrement.`,
    category: 'credits',
  },
  {
    keywords: ['recharge', 'recharger', 'acheter', 'pack', 'plus de crédit', 'épuisé', 'fini'],
    question: 'Comment recharger mes crédits ?',
    answer: `3 packs de recharge disponibles :

🔸 +10 crédits = 1 500 FCFA (1 stratégie)
🔸 +30 crédits = 4 000 FCFA (3 stratégies, le plus populaire)
🔸 +80 crédits = 9 000 FCFA (8 stratégies, meilleur rapport)

Tu peux recharger à tout moment depuis ton dashboard, section Crédits.`,
    category: 'credits',
  },
  {
    keywords: ['comment générer', 'comment utiliser', 'wizard', 'marche', 'commencer', 'démarrer'],
    question: 'Comment générer ma première stratégie ?',
    answer: `C'est très simple :

1️⃣ Clique sur "Nouvelle stratégie"
2️⃣ Réponds au wizard en 8 étapes (5 minutes)
3️⃣ Notre IA analyse ton business
4️⃣ Tu reçois une stratégie complète

Tu obtiens : ciblage précis, scripts WhatsApp prêts à copier, budget détaillé, KPIs à suivre et plan d'action sur 7 jours.`,
    category: 'usage',
  },
  {
    keywords: ['différence', 'flash', 'complète', 'complete', 'versus', 'vs'],
    question: 'Quelle est la différence entre Flash et Complète ?',
    answer: `Deux niveaux de stratégie :

🎯 Diagnostic Flash (5 crédits) : aperçu en 3 sections (diagnostic, avatar client, angle). Réservé au plan Démo.

🎯 Stratégie Complète (10 crédits) : 12 sections détaillées avec scripts WhatsApp, allocation budgétaire, KPIs et plan d'action. À partir du plan Pro.

Le Flash te permet de découvrir la qualité. Les stratégies complètes sont réellement actionnables.`,
    category: 'usage',
  },
  {
    keywords: ['paiement', 'wave', 'orange', 'mtn', 'moov', 'mobile money', 'carte', 'bancaire'],
    question: 'Quels moyens de paiement acceptez-vous ?',
    answer: `Nous acceptons :

💳 Mobile Money : Wave, Orange Money, MTN MoMo, Moov Money
💳 Cartes bancaires : Visa, Mastercard

Tous les paiements passent par Chariow, une plateforme sécurisée utilisée par des milliers de vendeurs en Afrique.`,
    category: 'support',
  },
  {
    keywords: ['support', 'contact', 'aide', 'humain', 'parler', 'joindre'],
    question: 'Comment contacter le support ?',
    answer: `Tu peux joindre notre équipe directement sur Telegram. Nous répondons personnellement à toutes les questions, généralement en moins d'une heure.`,
    category: 'support',
  },
  {
    keywords: ['bug', 'problème', 'marche pas', 'erreur', 'connexion', 'bloqué', 'panne', 'technique'],
    question: 'J\'ai un problème technique',
    answer: `Désolé pour ce désagrément. Pour qu'on règle ça au plus vite, décris-nous le problème exact (capture d'écran si possible) sur Telegram.`,
    category: 'support',
  },
  {
    keywords: ['renouvellement', 'expire', 'expiration', 'abonnement', 'résilier', 'annuler'],
    question: 'Que se passe-t-il à la fin de mon abonnement ?',
    answer: `Ton abonnement est valable 12 mois. À la fin de cette période :

📅 Ton plan repasse automatiquement au Démo
📅 Tes crédits du mois sont remis à zéro
📅 Tu peux renouveler à tout moment

Nous t'envoyons un rappel 30 jours avant l'échéance.`,
    category: 'plans',
  },
  {
    keywords: ['afrique', 'africain', 'local', 'adapté', 'marché'],
    question: 'MakeItAds est-il adapté au marché africain ?',
    answer: `C'est notre ADN.

Nos stratégies sont calibrées pour :
• WhatsApp comme canal de conversion principal
• Mobile Money (Wave, Orange Money, MTN)
• Les codes de confiance locaux
• Les budgets en FCFA réalistes

Aucune stratégie n'est copiée de l'étranger. Tout est pensé pour notre marché.`,
    category: 'usage',
  },
  {
    keywords: ['résultat', 'vente', 'efficace', 'roi', 'rentable', 'marcher vraiment', 'ça marche'],
    question: 'Est-ce que ça marche vraiment ?',
    answer: `Nos utilisateurs actifs voient des résultats concrets :

• Scripts WhatsApp qui convertissent 3x mieux
• Ciblages précis qui baissent le coût par clic
• Plans d'action clairs qui évitent le hasard

⚠️ Important : MakeItAds te donne la stratégie. Les résultats dépendent de ton exécution. Un plan appliqué sérieusement vaut mieux qu'un plan parfait ignoré.`,
    category: 'usage',
  },
  {
    keywords: ['démo', 'demo', 'gratuit', 'essayer', 'tester', 'essai'],
    question: 'Puis-je tester MakeItAds gratuitement ?',
    answer: `Oui, tu peux tester MakeItAds gratuitement :

🎁 10 crédits offerts à l'inscription
🎁 De quoi faire 2 Diagnostics Flash
🎁 Aucune carte bancaire requise

Crée ton compte en 2 minutes et découvre la qualité de nos stratégies.`,
    category: 'pricing',
  },
  {
    keywords: ['sécurisé', 'sécurité', 'confiance', 'arnaque', 'fiable'],
    question: 'Mes paiements sont-ils sécurisés ?',
    answer: `Absolument. Tous les paiements passent par Chariow, une plateforme de paiement sécurisée utilisée par des milliers de vendeurs en Afrique.

Tes données bancaires ne transitent jamais par nos serveurs. Nous acceptons Mobile Money et cartes bancaires.`,
    category: 'support',
  },
  {
    keywords: ['mot de passe', 'password', 'compte', 'connexion', 'inscription', 'connecter'],
    question: 'Problème de connexion ou mot de passe',
    answer: `Pour ton compte :

🔑 Utilise "Mot de passe oublié" sur la page de connexion pour réinitialiser ton mot de passe
🔑 Pour tout autre problème (compte bloqué, email erroné), contacte notre équipe sur Telegram`,
    category: 'support',
  },
];

// ============================================
// QUESTIONS SUGGÉRÉES
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
// DÉTECTION DE FAQ (100% local)
// ============================================

export function findFAQAnswer(message: string): FAQEntry | null {
  const normalized = message.toLowerCase().trim();
  if (!normalized || normalized.length < 3) return null;

  let bestMatch: { entry: FAQEntry; score: number } | null = null;

  for (const entry of FAQ_DATABASE) {
    let score = 0;
    for (const keyword of entry.keywords) {
      if (normalized.includes(keyword.toLowerCase())) {
        score += keyword.length;
      }
    }
    if (score >= 4 && (!bestMatch || score > bestMatch.score)) {
      bestMatch = { entry, score };
    }
  }

  return bestMatch ? bestMatch.entry : null;
}

// ============================================
// TEMPLATES DE CLÔTURE — vers L'ÉQUIPE
// ============================================

export const CLOSING_TEMPLATES: ((name: string | null) => string)[] = [
  (name) => `\n\n💬 Une question précise${name ? ` ${name}` : ''} ? Écris à notre équipe sur Telegram, on te répond personnellement : ${TELEGRAM_URL}`,
  (name) => `\n\nPour échanger en direct${name ? ` ${name}` : ''}, retrouve notre équipe sur Telegram : ${TELEGRAM_URL}`,
  (name) => `\n\nNotre équipe est dispo sur Telegram${name ? ` ${name}` : ''} si tu veux aller plus loin : ${TELEGRAM_URL}`,
  (name) => `\n\nOn peut en discuter${name ? ` ${name}` : ''} sur Telegram quand tu veux : ${TELEGRAM_URL}`,
  (name) => `\n\n💡 Le meilleur moyen d'avancer${name ? ` ${name}` : ''} reste d'en parler directement avec notre équipe. C'est ici : ${TELEGRAM_URL}`,
];

// ============================================
// TEMPLATES DE FALLBACK
// ============================================

export const FALLBACK_TEMPLATES: ((name: string | null) => string)[] = [
  (name) => `Merci ${name || ''} d'avoir pris le temps de nous écrire 🙏\n\nTa question mérite une réponse personnalisée. Le mieux est qu'on en discute directement pour bien comprendre ton besoin.\n\n👉 Écris à notre équipe sur Telegram : ${TELEGRAM_URL}`,
  (name) => `${name ? `${name}, ` : ''}nous avons bien noté ta question. Pour te répondre correctement, le mieux c'est qu'on échange en direct.\n\n👉 Notre équipe est sur Telegram : ${TELEGRAM_URL}`,
  (name) => `Excellente question ${name || ''} 💡\n\nNous voulons te donner une réponse vraiment adaptée, pas du copier-coller. Écris à notre équipe sur Telegram et on te répond rapidement.\n\n👉 ${TELEGRAM_URL}`,
  (name) => `${name ? `${name}, ` : ''}c'est une question importante et nous ne voulons pas y répondre à la légère.\n\nRejoins notre équipe sur Telegram, on en parle en détail : ${TELEGRAM_URL}`,
  (name) => `Bien reçu ${name || ''} 🙌\n\nTa question sort un peu des sujets fréquents, donc on préfère la traiter personnellement.\n\n👉 Contacte notre équipe sur Telegram : ${TELEGRAM_URL}`,
  (name) => `Merci pour ton message ${name || ''} 🤝\n\nPour qu'on aille au fond des choses, retrouve notre équipe sur Telegram. On répond personnellement à chaque personne.\n\n👉 ${TELEGRAM_URL}`,
  (name) => `${name ? `${name}, ` : ''}ta question mérite mieux qu'une réponse générique. Discutons-en directement sur Telegram.\n\n👉 ${TELEGRAM_URL}`,
  (name) => `Nous apprécions vraiment que tu nous poses cette question ${name || ''} 💭\n\nPour bien t'accompagner, le mieux c'est un échange direct. Notre équipe est sur Telegram : ${TELEGRAM_URL}`,
];

// ============================================
// ANTI-RÉPÉTITION
// ============================================

export function pickRandom<T>(arr: T[], lastIndex?: number): { item: T; index: number } {
  let index = Math.floor(Math.random() * arr.length);
  if (arr.length > 1 && index === lastIndex) {
    index = (index + 1) % arr.length;
  }
  return { item: arr[index], index };
}