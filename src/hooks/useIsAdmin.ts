'use client';

import { useAuth } from '@/hooks/useAuth';

export const ADMIN_EMAILS = ['ecomdarrell@gmail.com'];

export function useIsAdmin(): boolean {
  const { user } = useAuth();
  
  if (!user?.email) return false;

  return ADMIN_EMAILS.includes(user.email.toLowerCase().trim());
}