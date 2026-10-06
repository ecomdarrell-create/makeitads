"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Loader2, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

import ProgressBar from "@/components/wizard/ProgressBar";
import ChoiceCard from "@/components/wizard/ChoiceCard";
import StrategyResult from "@/components/wizard/StrategyResult";
import type { Strategy } from "@/lib/prompts";

// ═══════════════════════════════════════════════════════════
// CONFIGURATION DES ÉTAPES
// ═══════════════════════════════════════════════════════════

const BUSINESS_TYPES = [
  { value: "e-commerce", label: "E-commerce", description: "Vente de produits physiques en ligne" },
  { value: "service", label: "Service", description: "Prestation de services (B2B ou B2C)" },
  { value: "infoproduit", label: "Infoproduit", description: "Formations, ebooks, coaching" },
  { value: "restauration", label: "Restauration", description: "Food, livraison, traiteur" },
  { value: "mode-beaute", label: "Mode & Beauté", description: "Vêtements, cosmétiques, accessoires" },
  { value: "autre", label: "Autre", description: "Un autre type d'activité" },
];

const OBJECTIFS = [
  { value: "ventes-directes", label: "Ventes directes", description: "Convertir en achats immédiats" },
  { value: "messages-whatsapp", label: "Messages WhatsApp", description: "Initier des conversations qualifiées" },
  { value: "notoriete", label: "Notoriété", description: "Faire connaître la marque" },
];

const MOYENS_PAIEMENT = [
  "Wave",
  "Orange Money",
  "MTN MoMo",
  "Moov Money",
  "Carte bancaire",
  "Paiement à la livraison",
  "PayPal",
];

// ═══════════════════════════════════════════════════════════
// TYPES DU FORMULAIRE
// ═══════════════════════════════════════════════════════════

type FormData = {
  // Étape 1
  type_business: string;
  // Étape 2
  produit: string;
  prix_moyen: string; // optionnel
  // Étape 3
  client_ideal: string;
  tranche_age: string; // optionnel
  // Étape 4
  zone_geographique: string;
  cible_diaspora: boolean; // optionnel
  // Étape 5
  budget_mensuel_fcfa: number;
  // Étape 6
  objectif: string;
  // Étape 7
  moyens_paiement: string[];
  // Étape 8
  concurrents: string;
};

const INITIAL_DATA: FormData = {
  type_business: "",
  produit: "",
  prix_moyen: "",
  client_ideal: "",
  tranche_age: "",
  zone_geographique: "",
  cible_diaspora: false,
  budget_mensuel_fcfa: 50000,
  objectif: "",
  moyens_paiement: [],
  concurrents: "",
};

// ═══════════════════════════════════════════════════════════
// PAGE PRINCIPALE
// ═══════════════════════════════════════════════════════════

export default function GeneratePage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<FormData>(INITIAL_DATA);
  const [strategy, setStrategy] = useState<Strategy | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalSteps = 8;

  const update = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const canContinue = (): boolean => {
    switch (step) {
      case 0: return !!data.type_business;
      case 1: return data.produit.trim().length >= 5;
      case 2: return data.client_ideal.trim().length >= 10;
      case 3: return data.zone_geographique.trim().length >= 2;
      case 4: return data.budget_mensuel_fcfa >= 1000;
      case 5: return !!data.objectif;
      case 6: return data.moyens_paiement.length > 0;
      case 7: return true; // concurrents optionnel
      default: return false;
    }
  };

  const next = () => {
    if (step < totalSteps - 1 && canContinue()) setStep(step + 1);
  };

  const back = () => {
    if (step > 0) setStep(step - 1);
  };

  const submit = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/generate-strategy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type_business: data.type_business,
          produit: data.prix_moyen
            ? `${data.produit} (prix moyen : ${data.prix_moyen})`
            : data.produit,
          client_ideal: data.tranche_age
            ? `${data.client_ideal} (tranche d'âge : ${data.tranche_age})`
            : data.client_ideal,
          zone_geographique: data.cible_diaspora
            ? `${data.zone_geographique} + diaspora africaine`
            : data.zone_geographique,
          budget_mensuel_fcfa: data.budget_mensuel_fcfa,
          objectif: data.objectif,
          moyens_paiement: data.moyens_paiement,
          concurrents: data.concurrents || undefined,
        }),
      });

      const json = await response.json();

      if (!response.ok || !json.success) {
        throw new Error(json.error || "Erreur lors de la génération");
      }

      setStrategy(json.strategy);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Erreur inconnue";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // ─── Affichage du résultat ───
  if (strategy) {
    return (
      <main className="min-h-screen bg-[#F8F8FC] px-4 py-8 sm:px-6 md:py-12">
        <div className="mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 text-center"
          >
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#6366F1]/10 px-3 py-1.5">
              <Sparkles className="h-3.5 w-3.5 text-[#6366F1]" />
              <span className="text-[11px] font-bold text-[#6366F1]">
                Stratégie générée
              </span>
            </div>
            <h1 className="text-2xl font-semibold text-[#18181B] md:text-3xl">
              Ta stratégie est <span className="text-[#6366F1]">prête</span>
            </h1>
            <p className="mt-2 text-sm text-[#71717A]">
              Analyse, applique, mesure. Puis recommence.
            </p>
          </motion.div>

          <StrategyResult strategy={strategy} />

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={() => {
                setStrategy(null);
                setStep(0);
                setData(INITIAL_DATA);
              }}
              className="flex-1 rounded-full border border-gray-200 bg-white px-5 py-2.5 text-xs font-semibold text-[#18181B] transition-all hover:bg-gray-50 md:text-sm"
            >
              Générer une autre stratégie
            </button>
            <button
              onClick={() => router.push("/dashboard")}
              className="flex-1 rounded-full bg-[#6366f1] px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-[#6366f1]/25 transition-all hover:bg-[#5558e6] md:text-sm"
            >
              Accéder au Dashboard
            </button>
          </div>
        </div>
      </main>
    );
  }

  // ─── Affichage du wizard ───
  return (
    <main className="min-h-screen bg-[#F8F8FC] px-4 py-6 sm:px-6 md:py-10">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-[#18181B] md:text-2xl">
            Créons ta <span className="text-[#6366F1]">stratégie</span>
          </h1>
          <p className="mt-1 text-xs text-[#71717A] md:text-sm">
            Réponds à 8 questions. Reçois une stratégie complète en 30 secondes.
          </p>
        </div>

        {/* Barre de progression */}
        <div className="mb-6 rounded-[20px] border border-gray-100 bg-white p-4 shadow-sm">
          <ProgressBar currentStep={step} totalSteps={totalSteps} />
        </div>

        {/* Contenu de l'étape */}
        <div className="rounded-[20px] border border-gray-100 bg-white p-5 shadow-sm md:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              {renderStep(step, data, update)}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Erreur */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3"
          >
            <p className="text-xs text-red-700">{error}</p>
          </motion.div>
        )}

        {/* Navigation */}
        <div className="mt-6 flex items-center justify-between gap-3">
          <button
            onClick={back}
            disabled={step === 0 || loading}
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2.5 text-xs font-semibold text-[#18181B] transition-all hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 md:text-sm"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Retour
          </button>

          {step < totalSteps - 1 ? (
            <button
              onClick={next}
              disabled={!canContinue()}
              className="inline-flex items-center gap-2 rounded-full bg-[#6366f1] px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-[#6366f1]/25 transition-all hover:bg-[#5558e6] disabled:cursor-not-allowed disabled:opacity-40 md:text-sm"
            >
              Continuer
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          ) : (
            <button
              onClick={submit}
              disabled={loading || !canContinue()}
              className="inline-flex items-center gap-2 rounded-full bg-[#6366f1] px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-[#6366f1]/25 transition-all hover:bg-[#5558e6] disabled:cursor-not-allowed disabled:opacity-40 md:text-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Génération...
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5" />
                  Générer ma stratégie
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </main>
  );
}

// ═══════════════════════════════════════════════════════════
// RENDU DE CHAQUE ÉTAPE
// ═══════════════════════════════════════════════════════════

function renderStep(
  step: number,
  data: FormData,
  update: <K extends keyof FormData>(key: K, value: FormData[K]) => void
) {
  switch (step) {
    // ─── ÉTAPE 1 : TYPE DE BUSINESS ───
    case 0:
      return (
        <StepLayout
          title="Quel est ton type de business ?"
          subtitle="Choisis l'option qui correspond le mieux à ton activité."
        >
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {BUSINESS_TYPES.map((b) => (
              <ChoiceCard
                key={b.value}
                label={b.label}
                description={b.description}
                selected={data.type_business === b.value}
                onClick={() => update("type_business", b.value)}
              />
            ))}
          </div>
        </StepLayout>
      );

    // ─── ÉTAPE 2 : PRODUIT ───
    case 1:
      return (
        <StepLayout
          title="Que vends-tu exactement ?"
          subtitle="Décris ton produit ou service en une phrase. Sois concret."
        >
          <textarea
            value={data.produit}
            onChange={(e) => update("produit", e.target.value)}
            placeholder="Ex : Savons artisanaux au karité pour peaux sensibles"
            rows={3}
            className="input resize-none"
          />
          <div className="mt-4">
            <label className="text-[11px] font-semibold text-[#475569]">
              Prix moyen de ton produit{" "}
              <span className="font-normal text-[#71717A]">(optionnel)</span>
            </label>
            <input
              type="text"
              value={data.prix_moyen}
              onChange={(e) => update("prix_moyen", e.target.value)}
              placeholder="Ex : 5 000 FCFA"
              className="input mt-1.5"
            />
          </div>
        </StepLayout>
      );

    // ─── ÉTAPE 3 : CLIENT IDÉAL ───
    case 2:
      return (
        <StepLayout
          title="Décris ton client idéal"
          subtitle="Âge, ville, situation, problème principal. Plus tu es précis, mieux c'est."
        >
          <textarea
            value={data.client_ideal}
            onChange={(e) => update("client_ideal", e.target.value)}
            placeholder="Ex : Femmes 28-40 ans à Abidjan, actives, qui ont déjà eu des réactions cutanées avec des savons classiques"
            rows={4}
            className="input resize-none"
          />
          <div className="mt-4">
            <label className="text-[11px] font-semibold text-[#475569]">
              Tranche d'âge précise{" "}
              <span className="font-normal text-[#71717A]">(optionnel)</span>
            </label>
            <input
              type="text"
              value={data.tranche_age}
              onChange={(e) => update("tranche_age", e.target.value)}
              placeholder="Ex : 25-45 ans"
              className="input mt-1.5"
            />
          </div>
        </StepLayout>
      );

    // ─── ÉTAPE 4 : ZONE GÉOGRAPHIQUE ───
    case 3:
      return (
        <StepLayout
          title="Quelle est ta zone géographique ?"
          subtitle="Ville et rayon autour. Exemple : Abidjan + 30 km."
        >
          <input
            type="text"
            value={data.zone_geographique}
            onChange={(e) => update("zone_geographique", e.target.value)}
            placeholder="Ex : Abidjan et banlieue, rayon 30 km"
            className="input"
          />
          <label className="mt-4 flex cursor-pointer items-center gap-3 rounded-xl border border-gray-100 bg-[#F8F8FC] p-3">
            <input
              type="checkbox"
              checked={data.cible_diaspora}
              onChange={(e) => update("cible_diaspora", e.target.checked)}
              className="h-4 w-4 accent-[#6366F1]"
            />
            <div>
              <p className="text-xs font-semibold text-[#18181B]">
                Je veux aussi cibler la diaspora
              </p>
              <p className="text-[10px] text-[#71717A]">
                Ajoute un ciblage supplémentaire pour les Africains à l'étranger.
              </p>
            </div>
          </label>
        </StepLayout>
      );

    // ─── ÉTAPE 5 : BUDGET ───
    case 4:
      return (
        <StepLayout
          title="Quel est ton budget publicitaire mensuel ?"
          subtitle="Un budget réaliste. Même petit, une bonne stratégie fait la différence."
        >
          <div className="rounded-2xl border-2 border-[#6366F1]/20 bg-[#6366F1]/5 p-5 text-center">
            <p className="text-3xl font-bold text-[#6366F1]">
              {data.budget_mensuel_fcfa.toLocaleString("fr-FR")}
              <span className="ml-1 text-sm font-medium text-[#475569]">FCFA</span>
            </p>
          </div>
          <input
            type="range"
            min={5000}
            max={1000000}
            step={5000}
            value={data.budget_mensuel_fcfa}
            onChange={(e) =>
              update("budget_mensuel_fcfa", Number(e.target.value))
            }
            className="mt-5 w-full accent-[#6366F1]"
          />
          <div className="mt-1 flex justify-between text-[10px] text-[#71717A]">
            <span>5 000 F</span>
            <span>1 000 000 F</span>
          </div>
        </StepLayout>
      );

    // ─── ÉTAPE 6 : OBJECTIF ───
    case 5:
      return (
        <StepLayout
          title="Quel est ton objectif principal ?"
          subtitle="Choisis ce qui compte le plus pour toi en ce moment."
        >
          <div className="space-y-2.5">
            {OBJECTIFS.map((o) => (
              <ChoiceCard
                key={o.value}
                label={o.label}
                description={o.description}
                selected={data.objectif === o.value}
                onClick={() => update("objectif", o.value)}
              />
            ))}
          </div>
        </StepLayout>
      );

    // ─── ÉTAPE 7 : MOYENS DE PAIEMENT ───
    case 6:
      return (
        <StepLayout
          title="Quels moyens de paiement acceptes-tu ?"
          subtitle="Tu peux en sélectionner plusieurs."
        >
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {MOYENS_PAIEMENT.map((m) => {
              const selected = data.moyens_paiement.includes(m);
              return (
                <ChoiceCard
                  key={m}
                  label={m}
                  selected={selected}
                  onClick={() => {
                    const next = selected
                      ? data.moyens_paiement.filter((x) => x !== m)
                      : [...data.moyens_paiement, m];
                    update("moyens_paiement", next);
                  }}
                />
              );
            })}
          </div>
        </StepLayout>
      );

    // ─── ÉTAPE 8 : CONCURRENTS ───
    case 7:
      return (
        <StepLayout
          title="Qui sont tes principaux concurrents ?"
          subtitle="Optionnel. Mais ça aide l'IA à mieux positionner ta stratégie."
        >
          <textarea
            value={data.concurrents}
            onChange={(e) => update("concurrents", e.target.value)}
            placeholder="Ex : Cosmétiques importés, savons industriels, marques locales de karité"
            rows={4}
            className="input resize-none"
          />
        </StepLayout>
      );

    default:
      return null;
  }
}

// ─── Layout d'étape réutilisable ───

function StepLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-[#18181B] md:text-xl">{title}</h2>
      <p className="mt-1 mb-5 text-xs text-[#71717A] md:text-sm">{subtitle}</p>
      {children}
    </div>
  );
}