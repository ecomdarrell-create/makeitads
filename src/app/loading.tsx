import { PremiumLoader } from '@/components/ui/PremiumLoader';

export default function RootLoading() {
  return (
    <PremiumLoader
      fullScreen
      message="Préparation de votre espace MakeItAds…"
    />
  );
}