// ============================================
// CONFIGURATION DU TUTORIEL DASHBOARD
// ============================================

export interface TourStep {
  id: string;
  target: string;
  title: string;
  description: string;
  position: 'top' | 'bottom' | 'left' | 'right';
}

export const DASHBOARD_TOUR_STEPS: TourStep[] = [
  {
    id: 'welcome',
    target: 'header-greeting',
    title: 'Bienvenue sur MakeItAds 👋',
    description:
      'Votre espace personnel pour créer et gérer vos stratégies publicitaires. Je vais vous faire visiter rapidement.',
    position: 'bottom',
  },
  {
    id: 'badge',
    target: 'header-badge',
    title: 'Votre plan et vos crédits',
    description:
      'Ici vous voyez votre plan actuel et vos crédits disponibles. 10 crédits = 1 stratégie complète.',
    position: 'bottom',
  },
  {
    id: 'hero',
    target: 'hero-create-btn',
    title: 'Créer une stratégie',
    description:
      'Le bouton principal. Cliquez ici pour lancer le wizard qui va générer votre stratégie personnalisée.',
    position: 'bottom',
  },
  {
    id: 'next-action',
    target: 'next-action',
    title: 'Votre prochaine action',
    description:
      'Chaque fois que vous revenez, cette carte vous suggère l\'action la plus utile à faire maintenant.',
    position: 'bottom',
  },
  {
    id: 'recent',
    target: 'recent-strategies',
    title: 'Vos stratégies récentes',
    description:
      'Retrouvez ici vos 5 dernières stratégies. Cliquez sur l\'une d\'elles pour la consulter à nouveau.',
    position: 'top',
  },
  {
    id: 'credit',
    target: 'credit-center',
    title: 'Centre de crédits',
    description:
      'Suivez votre consommation. Quand vos crédits baissent, un bouton "Recharger" apparaît ici.',
    position: 'left',
  },
  {
    id: 'plan',
    target: 'plan-features',
    title: 'Votre plan',
    description:
      'Voyez exactement ce que votre plan débloque et ce qui est disponible dans les plans supérieurs.',
    position: 'left',
  },
];

const STORAGE_KEY = 'makeitads_tour_completed';

export function hasCompletedTour(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    return true;
  }
}

export function markTourCompleted(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, 'true');
  } catch {
    // ignore
  }
}

export function resetTour(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}