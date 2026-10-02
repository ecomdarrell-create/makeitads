interface HeaderProps {
  firstName: string | null;
  credits: number;
  plan: string | null;
}

const businessQuotes = [
  "Le marketing n'est pas une dépense, c'est un investissement dans votre croissance.",
  "Ne vendez pas un produit, vendez une meilleure version de votre client.",
  "Votre marque est ce que les autres disent de vous quand vous n'êtes pas dans la pièce.",
  "Le succès n'est pas final, l'échec n'est pas fatal : c'est le courage de continuer qui compte.",
  "La meilleure publicité, c'est un client satisfait qui en parle à un autre."
];

export function Header({ firstName, credits, plan }: HeaderProps) {
  // On prend une citation de manière pseudo-aléatoire basée sur la longueur du prénom pour qu'elle reste stable lors du rechargement
  const quoteIndex = (firstName?.length || 0) % businessQuotes.length;
  const subtitle = businessQuotes[quoteIndex];

  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
      <div>
        <h1 className="text-base sm:text-lg font-semibold text-[#111827]">
          Bonjour, {firstName || 'Utilisateur'}
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 mt-0.5 italic">
          "{subtitle}"
        </p>
      </div>
      <div className="flex items-center gap-2 sm:gap-3 bg-white px-2.5 py-1.5 rounded-lg border border-gray-200 shadow-sm">
        <span className="text-[10px] sm:text-xs font-medium text-gray-600 capitalize">{plan || 'free'}</span>
        <span className="w-px h-3 bg-gray-300"></span>
        <span className="text-[10px] sm:text-xs font-semibold text-[#6366F1]">{credits} crédits</span>
      </div>
    </div>
  );
}