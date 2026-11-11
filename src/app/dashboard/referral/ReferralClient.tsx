'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Copy,
  Check,
  Share2,
  Users,
  Gift,
  Loader2,
  Lightbulb,
  CheckCircle2,
  KeyRound,
  Link2,
} from 'lucide-react';
import { ReferralShareMessages } from '@/components/dashboard/ReferralShareMessages';

interface Referral {
  id: string;
  credits_awarded: number;
  created_at: string;
  referee_name: string;
  referee_email: string;
}

interface Props {
  initialCode: string | null;
  initialCount: number;
  referrals: Referral[];
  firstName?: string | null;
}

// ============================================
// ANNEAU DE STATISTIQUE (SVG circulaire)
// ============================================
function StatRing({
  value,
  max,
  label,
  unit,
  color = '#6366F1',
}: {
  value: number;
  max: number;
  label: string;
  unit: string;
  color?: string;
}) {
  const percentage = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <svg width="80" height="80" viewBox="0 0 80 80" className="-rotate-90">
          <circle cx="40" cy="40" r={radius} fill="none" stroke="#F1F5F9" strokeWidth="6" />
          <motion.circle
            cx="40"
            cy="40"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-base font-bold text-[#18181B] sm:text-lg">{value}</span>
          <span className="text-[8px] font-medium uppercase tracking-wider text-slate-400">{unit}</span>
        </div>
      </div>
      <p className="mt-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500 sm:text-[11px]">
        {label}
      </p>
    </div>
  );
}

// ============================================
// COMPOSANT PRINCIPAL
// ============================================
export function ReferralClient({ initialCode, initialCount, referrals, firstName }: Props) {
  const [code, setCode] = useState(initialCode);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(!initialCode);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [referralUrl, setReferralUrl] = useState('');

  // Construction du lien (prod forcée)
  useEffect(() => {
    if (!code) return;
    const origin =
      typeof window !== 'undefined' && window.location.origin.includes('localhost')
        ? 'https://makeitads.pro'
        : typeof window !== 'undefined'
          ? window.location.origin
          : 'https://makeitads.pro';
    setReferralUrl(`${origin}/signup?ref=${code}`);
  }, [code]);

  useEffect(() => {
    if (initialCode) return;
    const fetchCode = async () => {
      try {
        const res = await fetch('/api/referral');
        const data = await res.json();
        if (data.success) {
          setCode(data.referral_code);
          setCount(data.referral_count || 0);
        }
      } catch (e) {
        console.error('Erreur chargement code parrainage:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchCode();
  }, [initialCode]);

  const copyCode = async () => {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const copyLink = async () => {
    if (!referralUrl) return;
    try {
      await navigator.clipboard.writeText(referralUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const shareUrl = async () => {
    if (!referralUrl || !code) return;
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: 'MakeItAds',
          text: `Je vous recommande MakeItAds pour structurer vos campagnes publicitaires. Lien d'inscription : ${referralUrl} — Code parrain : ${code}`,
          url: referralUrl,
        });
      } catch {
        // Annulé
      }
    } else {
      copyLink();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-5 w-5 animate-spin text-[#6366F1]" />
      </div>
    );
  }

  const totalCredits = referrals.reduce((sum, r) => sum + (r.credits_awarded || 0), 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      {/* CARTE PRINCIPALE */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="p-5 sm:p-6">
          <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-[#6366F1]/10 px-2.5 py-1">
            <Gift className="h-3 w-3 text-[#6366F1]" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#6366F1]">
              +10 crédits par filleul
            </span>
          </div>

          <h2 className="mb-1 text-lg font-bold leading-tight text-[#18181B] sm:text-xl">
            Invitez vos proches.
            <br />
            Gagnez des crédits.
          </h2>
          <p className="text-xs leading-relaxed text-slate-600 sm:text-sm">
            Chaque personne qui s&apos;inscrit avec votre code ou votre lien vous rapporte 10 crédits bonus, utilisables immédiatement dès son premier paiement.
          </p>
        </div>

        {/* ANNEAUX DE STATS */}
        <div className="grid grid-cols-2 divide-x divide-slate-100 border-y border-slate-100">
          <div className="flex items-center justify-center p-5 sm:p-6">
            <StatRing value={count} max={Math.max(count, 10)} label="Filleuls" unit="Total" color="#6366F1" />
          </div>
          <div className="flex items-center justify-center p-5 sm:p-6">
            <StatRing value={totalCredits} max={Math.max(totalCredits, 50)} label="Crédits gagnés" unit="Gagnés" color="#8B5CF6" />
          </div>
        </div>

        {/* CODE + LIEN SÉPARÉS */}
        <div className="space-y-4 p-4 sm:p-5">
          {/* CODE UNIQUE */}
          <div>
            <label className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              <KeyRound className="h-3 w-3" />
              Votre code de parrainage
            </label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="flex flex-1 items-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5">
                <span className="truncate font-mono text-[13px] font-bold tracking-widest text-slate-900 sm:text-sm">
                  {code || 'Chargement…'}
                </span>
              </div>
              <button
                type="button"
                onClick={copyCode}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 sm:flex-none"
              >
                {copiedCode ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                    <span className="text-emerald-600">Copié</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    Copier le code
                  </>
                )}
              </button>
            </div>
            <p className="mt-1.5 text-[10px] leading-relaxed text-slate-500 sm:text-[11px]">
              Ce code est plus sûr à partager : votre filleul n&apos;a qu&apos;à le coller lors de son inscription.
            </p>
          </div>

          {/* LIEN COMPLET */}
          <div>
            <label className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              <Link2 className="h-3 w-3" />
              Votre lien d&apos;invitation
            </label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="flex flex-1 items-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5">
                <p className="truncate text-[11px] text-slate-700 sm:text-xs">
                  {referralUrl || 'Chargement…'}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={copyLink}
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 sm:flex-none"
                >
                  {copiedLink ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                      <span className="text-emerald-600">Copié</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      Copier le lien
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={shareUrl}
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#6366F1] px-3 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#5558e6] sm:flex-none"
                >
                  <Share2 className="h-3.5 w-3.5" />
                  Partager
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MESSAGES D'INVITATION PRÊTS À L'EMPLOI (remplace les anciens clichés IA) */}
      {code && <ReferralShareMessages code={code} firstName={firstName} />}

      {/* TUTO — COMMENT DÉVELOPPER VOS PARRAINAGES */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#6366F1]/10 text-[#6366F1]">
            <Lightbulb className="h-3.5 w-3.5" />
          </div>
          <h3 className="text-sm font-semibold text-[#18181B]">
            Développer votre réseau de parrainage
          </h3>
        </div>

        <div className="space-y-4">
          <Tip
            n={1}
            title="Privilégier WhatsApp"
            text="Partagez votre code à vos contacts les plus proches en expliquant simplement pourquoi vous utilisez MakeItAds. Un message personnalisé convertit mieux qu'un envoi de masse."
          />
          <Tip
            n={2}
            title="Cibler les groupes pertinents"
            text="Groupes d'entrepreneurs, de commerçants, de e-commerçants, groupes locaux. Préférez les communautés où les membres sont déjà dans une démarche de croissance."
          />
          <Tip
            n={3}
            title="Utiliser le code plutôt que le lien"
            text="Certains destinataires hésitent à cliquer sur un lien inconnu. Proposer votre code parrain est souvent plus rassurant et aboutit au même résultat."
          />
          <Tip
            n={4}
            title="Mentionner MakeItAds naturellement"
            text="Lorsqu'un contact évoque ses difficultés en publicité ou en acquisition, mentionnez MakeItAds et proposez votre code. Une recommandation contextuelle est bien plus efficace qu'une publicité directe."
          />
          <Tip
            n={5}
            title="Relancer avec discrétion"
            text="Une relance toutes les deux semaines suffit. Évitez les envois répétés qui peuvent être perçus comme intrusifs."
          />
        </div>
      </div>

      {/* HISTORIQUE */}
      {referrals.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-100 p-4 sm:p-5">
            <h3 className="text-sm font-semibold text-[#18181B]">Vos parrainages</h3>
            <span className="text-[10px] text-slate-500">{referrals.length} au total</span>
          </div>
          <div className="divide-y divide-slate-100">
            {referrals.map((r) => (
              <div key={r.id} className="flex items-center justify-between gap-3 px-4 py-3 sm:px-5">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#6366F1]/10 text-[11px] font-bold text-[#6366F1]">
                    {r.referee_name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold text-[#18181B]">{r.referee_name}</p>
                    <p className="truncate text-[10px] text-slate-500">
                      {new Date(r.created_at).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
                <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                  +{r.credits_awarded} crédits
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {referrals.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/40 p-6 text-center">
          <Users className="mx-auto mb-3 h-8 w-8 text-slate-300" />
          <p className="text-xs text-slate-500">
            Vous n&apos;avez pas encore de filleul. Partagez votre code ou votre lien pour commencer à gagner des crédits.
          </p>
        </div>
      )}
    </motion.div>
  );
}

// ============================================
// COMPOSANT TIP
// ============================================
function Tip({ n, title, text }: { n: number; title: string; text: string }) {
  return (
    <div className="flex gap-3">
      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#6366F1] text-[10px] font-bold text-white">
        {n}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="h-3 w-3 shrink-0 text-[#6366F1]" />
          <p className="text-xs font-semibold text-[#18181B]">{title}</p>
        </div>
        <p className="mt-1 text-[11px] leading-relaxed text-slate-500">{text}</p>
      </div>
    </div>
  );
}