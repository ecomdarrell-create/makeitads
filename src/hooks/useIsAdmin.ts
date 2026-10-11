'use client';

import { useAuth } from '@/hooks/useAuth';

// ✅ Liste des emails ayant accès à l'espace admin
// Modifie librement cette liste pour ajouter/retirer des admins
export const ADMIN_EMAILS = [
  'ecomdarrell@gmail.com',
  'darrellkamga@gmail.com',
];

export function useIsAdmin(): boolean {
  const { user } = useAuth();

  if (!user?.email) return false;

  return ADMIN_EMAILS.includes(user.email.toLowerCase().trim());
}