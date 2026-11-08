'use client';

import { useEffect, useState } from 'react';
import { Fingerprint, ScanFace, KeyRound, Loader2, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import {
  isWebAuthnSupported,
  isPlatformAuthenticatorAvailable,
  getPasskeyLabel,
  buildSignInLabel,
  type PasskeyLabel,
} from '@/lib/passkey/detect';
import { getPasskeyErrorMessage, isUserCancellation } from '@/lib/passkey/errors';
import { signInWithPasskey } from '@/lib/passkey/client';
import { PasskeyFallbackModal } from './PasskeyFallbackModal';

type Props = {
  onSuccess: () => void;
  onUsePassword: () => void;
};

const MAX_ATTEMPTS = 2;

export function PasskeyLoginButton({ onSuccess, onUsePassword }: Props) {
  const [supported, setSupported] = useState(false);
  const [label, setLabel] = useState<PasskeyLabel>({ label: 'la biométrie', icon: 'fingerprint' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [showFallback, setShowFallback] = useState(false);

  // Détection au mount (SSR-safe)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const ok = isWebAuthnSupported() && (await isPlatformAuthenticatorAvailable());
      if (cancelled) return;
      setSupported(ok);
      setLabel(getPasskeyLabel());
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleClick = async () => {
    setLoading(true);
    setError('');
    try {
      const supabase = createClient();
      await signInWithPasskey(supabase);
      // Succès : la session est posée par Supabase (cookies + onAuthStateChange)
      onSuccess();
    } catch (err) {
      if (isUserCancellation(err)) {
        // Annulation volontaire : ne pas compter comme un échec
        setError('Authentification annulée.');
        setLoading(false);
        return;
      }
      const next = attempts + 1;
      setAttempts(next);
      if (next >= MAX_ATTEMPTS) {
        setShowFallback(true);
      } else {
        setError(getPasskeyErrorMessage(err));
      }
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setShowFallback(false);
    setAttempts(0);
    setError('');
    // Relance la cérémonie
    void handleClick();
  };

  const handleUsePassword = () => {
    setShowFallback(false);
    setAttempts(0);
    setError('');
    onUsePassword();
  };

  if (!supported) return null;

  const Icon = label.icon === 'face' ? ScanFace : label.icon === 'key' ? KeyRound : Fingerprint;

  return (
    <>
      <div className="space-y-2">
        <div className="my-3.5 flex items-center gap-3 text-[9px] text-slate-400 sm:text-[10px]">
          <span className="h-px flex-1 bg-slate-100" />
          OU
          <span className="h-px flex-1 bg-slate-100" />
        </div>

        {error && !showFallback && (
          <div className="flex items-start gap-1.5 rounded border border-amber-200 bg-amber-50 p-2 text-[11px] text-amber-800 sm:text-xs">
            <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="button"
          onClick={handleClick}
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 transition-all hover:border-[#6366F1] hover:bg-[#6366F1]/5 hover:text-[#6366F1] disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Icon className="h-4 w-4" />
          )}
          {loading ? 'Authentification…' : buildSignInLabel(label)}
        </button>
      </div>

      <PasskeyFallbackModal
        open={showFallback}
        onRetry={handleRetry}
        onUsePassword={handleUsePassword}
      />
    </>
  );
}