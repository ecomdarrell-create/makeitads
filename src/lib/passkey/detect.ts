// Détection de capacité WebAuthn + libellé adaptatif (Face ID / Touch ID / etc.)
// ⚠️ Aucune donnée biométrique n'est manipulée ici : uniquement des capacités navigateur.

export function isWebAuthnSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.PublicKeyCredential !== 'undefined'
  );
}

export async function isPlatformAuthenticatorAvailable(): Promise<boolean> {
  if (!isWebAuthnSupported()) return false;
  try {
    return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
  } catch {
    return false;
  }
}

export type PasskeyLabel = {
  label: string;
  icon: 'face' | 'fingerprint' | 'key';
};

/**
 * Heuristique best-effort pour adapter le libellé.
 * On ne peut PAS savoir à l'avance si c'est Face ID ou Touch ID de manière 100 % fiable :
 * le navigateur ne l'expose pas. On utilise donc le ratio d'écran (notch = Face ID)
 * et le userAgent. En cas de doute, on retombe sur « la biométrie ».
 */
export function getPasskeyLabel(): PasskeyLabel {
  if (typeof navigator === 'undefined' || typeof window === 'undefined') {
    return { label: 'la biométrie', icon: 'fingerprint' };
  }

  const ua = navigator.userAgent;
  const isIOS = /iPhone|iPad|iPod/.test(ua);
  const isMac = /Macintosh/.test(ua) && !isIOS;
  const isWindows = /Windows/.test(ua);
  const isAndroid = /Android/.test(ua);

  if (isIOS) {
    // iPhone X+ (notch, ratio 19.5:9 ≈ 2.17) vs iPhone SE/8 (16:9 ≈ 1.78)
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

/** Construit le libellé complet du bouton : « Se connecter avec Face ID » */
export function buildSignInLabel(label: PasskeyLabel): string {
  return `Se connecter avec ${label.label}`;
}