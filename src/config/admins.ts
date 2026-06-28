// ======================================================
// ADMIN ACCESS LIST
// Les emails dans cette liste ont automatiquement le plan Enterprise
// ======================================================

export const ADMIN_EMAILS = [
  "darrellkamga@gmail.com", // CEO - Full access
  // Ajoute d'autres emails ici si besoin :
  // "autre.email@example.com",
];

export function isAdmin(email: string | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}

export function getAdminPlan(): "enterprise" {
  return "enterprise";
}