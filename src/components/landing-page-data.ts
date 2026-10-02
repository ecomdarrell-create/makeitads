// ✅ Types définis pour éviter les erreurs "implicitly has an 'any' type"

export interface NavLink {
  name: string;
  href: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface Feature {
  title: string;
  description: string;
  icon: string;
}

export interface ProblemItem {
  title: string;
  description: string;
  icon: string;
}

// ✅ Données exportées

export const navLinks: string[] = [
  "Fonctionnalités",
  "Comment ça marche",
  "Tarifs",
  "Avis",
  "Dashboard"
];

export const faqItems: FAQItem[] = [
  {
    question: "Comment obtenir mon analyse gratuite ?",
    answer: "C'est simple ! Contactez-nous via le bouton dédié. Un expert MakeItAds analysera votre cas et vous enverra un PDF personnalisé sous 24 à 48h."
  },
  {
    question: "La stratégie gratuite est-elle vraiment gratuite ?",
    answer: "Oui, à 100%. C'est notre façon de vous prouver la qualité de notre travail avant que vous n'investissiez un seul franc. Aucun engagement requis."
  },
  {
    question: "Quelle est la différence avec les plans payants ?",
    answer: "Le PDF gratuit vous donne une vision globale. Les plans payants débloquent des stratégies mensuelles récurrentes, des textes publicitaires prêts à copier-coller, et l'analyse détaillée de vos concurrents."
  },
  {
    question: "Le paiement est-il sécurisé ?",
    answer: "Absolument. Nous utilisons Chariow, une plateforme sécurisée qui accepte le Mobile Money (Orange, Wave, MTN, Moov) et les cartes bancaires."
  },
  {
    question: "Puis-je annuler mon abonnement à tout moment ?",
    answer: "Oui, vous pouvez mettre fin à votre abonnement à tout moment sans frais cachés ni pénalité. Nous croyons en la rétention par la qualité, pas par le blocage."
  },
  {
    question: "Qu'est-ce que le MakeItAds Business Club ?",
    answer: "C'est notre communauté privée réservée aux membres. Dès votre souscription, vous y êtes ajouté pour échanger, poser vos questions et bénéficier d'un support réactif (sous 24h, ou 1h pour le plan Enterprise)."
  },
  {
    question: "Est-ce vraiment adapté au marché africain ?",
    answer: "Oui, c'est notre ADN. MakeItAds est calibré pour les réalités locales : budgets en FCFA, ciblage par villes africaines, et leviers de confiance locaux."
  }
];

export const features: Feature[] = [
  {
    title: "Stratégies 100% personnalisées",
    description: "Notre IA analyse votre entreprise, votre marché et votre audience pour créer une stratégie sur mesure.",
    icon: "zap"
  },
  {
    title: "Ciblage précis",
    description: "Identifiez exactement qui sont vos clients idéaux et comment les atteindre efficacement.",
    icon: "target"
  },
  {
    title: "Scripts WhatsApp prêts à l'emploi",
    description: "Recevez des scripts de vente optimisés pour convertir vos prospects en clients.",
    icon: "message"
  },
  {
    title: "Résultats mesurables",
    description: "Suivez vos performances et optimisez continuellement vos campagnes publicitaires.",
    icon: "trending"
  }
];

export const problemItems: ProblemItem[] = [
  {
    title: "Vous dépensez sans résultats",
    description: "Vous investissez dans la publicité mais ne voyez pas de retour sur investissement concret.",
    icon: "alert"
  },
  {
    title: "Vous ne connaissez pas votre audience",
    description: "Vous ciblez trop large et vos messages ne résonnent pas avec les bonnes personnes.",
    icon: "users"
  },
  {
    title: "Vous manquez de temps",
    description: "Gérer le marketing en plus de votre business vous prend un temps fou et vous épuise.",
    icon: "clock"
  },
  {
    title: "Vous ne savez pas par où commencer",
    description: "Trop d'informations, trop de plateformes, vous êtes paralysé par le choix.",
    icon: "help"
  }
];