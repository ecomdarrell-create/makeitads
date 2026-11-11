'use client';

import { useState } from 'react';
import { Copy, Check, MessageCircle, Mail, Send } from 'lucide-react';

interface ReferralShareMessagesProps {
  code: string;
  firstName?: string | null;
}

type Tab = 'short' | 'medium' | 'long';

export function ReferralShareMessages({ code, firstName }: ReferralShareMessagesProps) {
  const [tab, setTab] = useState<Tab>('medium');
  const [copied, setCopied] = useState<Tab | null>(null);

  const url =
    typeof window !== 'undefined'
      ? `${window.location.origin}/signup?ref=${code}`
      : '';
  const sender = firstName?.trim() || null;

  const messages: Record<Tab, { label: string; shortLabel: string; icon: typeof MessageCircle; body: string }> = {
    short: {
      label: 'Court (WhatsApp, SMS)',
      shortLabel: 'Court',
      icon: MessageCircle,
      body: `Bonjour,

Je vous recommande MakeItAds, une plateforme qui génère des stratégies publicitaires adaptées au marché africain.

Inscription : ${url}
Ou code parrain : ${code}

Cordialement${sender ? `,\n${sender}` : ''}`,
    },
    medium: {
      label: 'Moyen (Telegram, email)',
      shortLabel: 'Moyen',
      icon: Send,
      body: `Bonjour,

Je me permets de vous partager MakeItAds, une plateforme que j'utilise pour structurer mes campagnes publicitaires. Elle génère des stratégies complètes adaptées au contexte africain : ciblage par ville, budgets réalistes, scripts WhatsApp et recommandations concrètes.

Si cela peut vous intéresser, vous pouvez créer un compte ici :
${url}

Vous pouvez également renseigner ce code parrain lors de votre inscription :
${code}

Bien cordialement${sender ? `,\n${sender}` : ''}`,
    },
    long: {
      label: 'Long (email formel)',
      shortLabel: 'Long',
      icon: Mail,
      body: `Bonjour,

Je me permets de vous contacter au sujet de MakeItAds, une plateforme d'intelligence artificielle dédiée à la création de stratégies publicitaires pour le marché africain.

Concrètement, MakeItAds permet de :
- Générer des stratégies publicitaires complètes en quelques minutes ;
- Cibler précisément les audiences locales (par ville, secteur, comportement) ;
- Obtenir des scripts WhatsApp et des recommandations budgétaires adaptées aux réalités du terrain.

Si vous souhaitez tester la plateforme, vous pouvez créer un compte ici :
${url}

Alternativement, vous pouvez renseigner le code parrain suivant lors de votre inscription :
${code}

Je reste à votre disposition pour tout complément d'information.

Bien cordialement${sender ? `,\n${sender}` : ''}`,
    },
  };

  const handleCopy = async (key: Tab) => {
    try {
      await navigator.clipboard.writeText(messages[key].body);
      setCopied(key);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      /* silencieux */
    }
  };

  const current = messages[tab];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#8B5CF6]/10 text-[#8B5CF6]">
          <Send className="h-3.5 w-3.5" />
        </div>
        <h3 className="text-sm font-semibold text-[#18181B]">
          Messages d&apos;invitation prêts à l&apos;emploi
        </h3>
      </div>

      <p className="mb-4 text-xs leading-relaxed text-slate-500">
        Choisissez un modèle, copiez-le, puis collez-le dans WhatsApp, Telegram ou par email.
        Le lien et le code de parrainage y sont déjà intégrés.
      </p>

      {/* Onglets */}
      <div className="mb-3 flex gap-1.5 overflow-x-auto">
        {(Object.keys(messages) as Tab[]).map((key) => {
          const Icon = messages[key].icon;
          const isActive = tab === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[10.5px] font-medium transition-colors sm:text-[11.5px] ${
                isActive
                  ? 'bg-[#6366F1] text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Icon className="h-3 w-3" />
              {messages[key].shortLabel}
            </button>
          );
        })}
      </div>

      {/* Prévisualisation */}
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
        <pre className="whitespace-pre-wrap break-words font-sans text-[11px] leading-relaxed text-slate-700 sm:text-[12px]">
          {current.body}
        </pre>
      </div>

      <button
        type="button"
        onClick={() => handleCopy(tab)}
        className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-[#6366F1] px-4 py-2 text-[11.5px] font-semibold text-white transition-colors hover:bg-[#5558e6] sm:text-xs"
      >
        {copied === tab ? (
          <>
            <Check className="h-3.5 w-3.5" /> Message copié
          </>
        ) : (
          <>
            <Copy className="h-3.5 w-3.5" /> Copier ce message
          </>
        )}
      </button>
    </div>
  );
}