// Détection de capacité WebAuthn — version permissive pour iOS
// On ne bloque plus sur isUVPAA() qui est buggé sur iOS 26.2+

export function isWebAuthnSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.PublicKeyCredential !== 'undefined' &&
    typeof navigator.credentials !== 'undefined' &&
    typeof navigator.credentials.create === 'function' &&
    typeof navigator.credentials.get === 'function'
  );
}

/**
 * Détection permissive : on considère que l'appareil est compatible
 * si WebAuthn est disponible. On ne se fie PAS à isUVPAA() qui retourne
 * false sur iOS 26.2+ dans les navigateurs non-Safari, ou si aucune
 * passkey n'est encore configurée.
 *
 * Si Face ID / Touch ID n'est réellement pas disponible, la cérémonie
 * WebAuthn échouera et l'utilisateur verra la modale de repli.
 */
export async function isPlatformAuthenticatorAvailable(): Promise<boolean> {
  if (!isWebAuthnSupported()) return false;

  // On tente quand même isUVPAA() mais on ne s'y fie pas
  try {
    const uvpaa = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    if (uvpaa) return true;
  } catch {
    // ignore
  }

  // ✅ Fallback : si WebAuthn existe, on considère l'appareil compatible.
  // La cérémonie réelle dira si Face ID fonctionne ou non.
  return true;
}

export type PasskeyLabel = {
  label: string;
  icon: 'face' | 'fingerprint' | 'key';
};

export function getPasskeyLabel(): PasskeyLabel {
  if (typeof navigator === 'undefined') {
    return { label: 'la biométrie', icon: 'fingerprint' };
  }

  const ua = navigator.userAgent;
  const isIOS = /iPhone|iPad|iPod/.test(ua);
  const isMac = /Macintosh/.test(ua) && !isIOS;
  const isWindows = /Windows/.test(ua);
  const isAndroid = /Android/.test(ua);

  if (isIOS) {
    const ratio =
      typeof window.screen !== 'undefined' && window.screen.width > 0
        ? window.screen.height / window.screen.width
        : 0;
    if (ratio >= 1.9) return { label: 'Face ID', icon: 'face' };
    return { label: 'Touch ID', icon: 'fingerprint' };
  }

  if (isMac) return { label: 'Touch ID', icon: 'fingerprint' };
  if (isWindows) return { label: 'Windows Hello', icon: 'face' };
  if (isAndroid) return { label: 'la biométrie', icon: 'fingerprint' };

  return { label: 'la biométrie', icon: 'fingerprint' };
}

export function buildSignInLabel(label: PasskeyLabel): string {
  return `Se connecter avec ${label.label}`;
}