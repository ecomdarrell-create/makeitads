export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateStrategyData(data: any): ValidationResult {
  const errors: string[] = [];

  // 1. Validation de l'offre
  if (!data.businessDescription || data.businessDescription.trim().length < 20) {
    errors.push("La description de votre entreprise est trop courte. Donnez plus de détails.");
  }

  if (!data.valueProposition || data.valueProposition.trim().length < 10) {
    errors.push("Expliquez brièvement pourquoi les clients devraient vous choisir.");
  }

  // 2. Validation de l'audience (Empêcher "tout le monde")
  const audienceLower = (data.audienceDescription || "").toLowerCase();
  if (audienceLower.includes("tout le monde") || audienceLower.includes("everyone")) {
    errors.push("Votre audience est trop large. Essayez de cibler un groupe spécifique (ex: femmes 25-40 ans, entrepreneurs, etc.).");
  }
  if (!data.audienceDescription || data.audienceDescription.trim().length < 15) {
    errors.push("Décrivez votre client idéal avec un peu plus de précision.");
  }

  // 3. Validation du Budget
  if (!data.budgetUnknown) {
    const budget = parseFloat(data.budget.replace(/\s/g, ''));
    if (isNaN(budget) || budget <= 0) {
      errors.push("Le montant du budget doit être supérieur à 0.");
    }
  }

  // 4. Validation Prix vs Objectif
  if (data.mainObjective === 'sales' && (!data.offerPrice || data.offerPrice.trim() === '')) {
    errors.push("Si votre objectif est de vendre, veuillez indiquer le prix de votre offre.");
  }

  return {
    valid: errors.length === 0,
    errors
  };
}