/**
 * Mappe les erreurs WebAuthn / Supabase passkey en messages utilisateur en français.
 * Ne jamais exposer le détail technique brut.
 */
export function getPasskeyErrorMessage(err: unknown): string {
  const anyErr = err as any;
  const code: string =
    anyErr?.code ||
    anyErr?.error_code ||
    anyErr?.name ||
    anyErr?.message ||
    'unknown';

  switch (code) {
    case 'NotAllowedError':
    case 'user_cancelled':
    case 'user_canceled':
      return 'Authentification annulée.';

    case 'NotSupportedError':
    case 'passkey_not_supported':
      return "Cet appareil ne prend pas en charge la connexion biométrique.";

    case 'InvalidStateError':
      return 'Cette passkey est déjà enregistrée sur cet appareil.';

    case 'SecurityError':
      return "La connexion biométrique n'est pas autorisée sur ce domaine.";

    case 'AbortError':
    case 'timeout':
      return "Le délai d'authentification a expiré. Réessayez.";

    case 'passkey_disabled':
      return "La connexion biométrique n'est pas disponible pour le moment.";

    case 'passkey_not_found':
    case 'webauthn_credential_not_found':
      return "Aucune passkey n'est enregistrée sur cet appareil pour MakeItAds.";

    case 'passkey_authentication_failed':
    case 'webauthn_verification_failed':
      return "L'authentification a échoué. Réessayez.";

    case 'email_not_confirmed':
      return 'Confirmez votre adresse e-mail avant d’activer la connexion rapide.';

    case 'user_banned':
      return 'Ce compte est désactivé. Contactez le support.';

    default:
      return "L'authentification n'a pas abouti. Réessayez ou utilisez votre mot de passe.";
  }
}

/** Vrai si l'erreur est une annulation volontaire de l'utilisateur (pas un vrai échec). */
export function isUserCancellation(err: unknown): boolean {
  const code = (err as any)?.code || (err as any)?.name;
  return code === 'NotAllowedError' || code === 'user_cancelled' || code === 'user_canceled';
}