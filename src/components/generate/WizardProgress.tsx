interface WizardProgressProps {
  currentStep: number;
  totalSteps: number;
}

const stepLabels = [
  'Entreprise',
  'Offre',
  'Audience',
  'Marché',
  'Objectif',
  'Campagne',
  'Créatif',
  'Contexte',
];

export function WizardProgress({ currentStep, totalSteps }: WizardProgressProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="mb-6">
      {/* Barre de progression */}
      <div className="relative h-1.5 bg-gray-200 rounded-full overflow-hidden mb-3">
        <div
          className="absolute left-0 top-0 h-full bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Labels des étapes (visible uniquement sur desktop) */}
      <div className="hidden sm:flex justify-between">
        {stepLabels.map((label, index) => (
          <div
            key={index}
            className={`text-[9px] font-medium transition-colors ${
              index + 1 <= currentStep ? 'text-[#6366F1]' : 'text-gray-400'
            }`}
          >
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}