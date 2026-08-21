"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Loader2,
  AlertCircle,
  Plus,
  Trash2,
  Sparkles,
  Zap,
} from "lucide-react";
import Link from "next/link";

// ═══════════════════════════════════════════════════════════
// TYPES
// ═════════════════════════════════════════════════════════

interface FormData {
  businessName: string;
  businessDescription: string;
  sector: string;
  customSector: string;
  offerName: string;
  offerPrice: string;
  offerCurrency: string;
  offerType: string;
  valueProposition: string;
  audienceDescription: string;
  ageMin: string;
  ageMax: string;
  ageUnknown: boolean;
  gender: string;
  mainProblem: string;
  mainDesire: string;
  countries: string[];
  geoZone: string;
  cities: string[];
  language: string;
  mainObjective: string;
  secondaryObjective: string;
  budget: string;
  budgetPeriod: string;
  budgetUnknown: boolean;
  mainCompetitor: string;
  competitorUrl: string;
  otherCompetitors: string[];
  competitorAdvantage: string;
  noCompetitors: boolean;
  platforms: string[];
  unknownPlatform: boolean;
  campaignStatus: string;
  campaignIssues: string;
}

const INITIAL_FORM_DATA: FormData = {
  businessName: "",
  businessDescription: "",
  sector: "",
  customSector: "",
  offerName: "",
  offerPrice: "",
  offerCurrency: "FCFA",
  offerType: "",
  valueProposition: "",
  audienceDescription: "",
  ageMin: "",
  ageMax: "",
  ageUnknown: false,
  gender: "Tous",
  mainProblem: "",
  mainDesire: "",
  countries: [],
  geoZone: "",
  cities: [],
  language: "Français",
  mainObjective: "",
  secondaryObjective: "",
  budget: "",
  budgetPeriod: "mois",
  budgetUnknown: false,
  mainCompetitor: "",
  competitorUrl: "",
  otherCompetitors: [],
  competitorAdvantage: "",
  noCompetitors: false,
  platforms: [],
  unknownPlatform: false,
  campaignStatus: "",
  campaignIssues: "",
};

const SECTORS = [
  "E-commerce",
  "Beauté & Cosmétiques",
  "Mode & Accessoires",
  "Santé & Bien-être",
  "Éducation & Formation",
  "Finance & Assurance",
  "Immobilier",
  "Services aux entreprises",
  "Restauration & Alimentation",
  "Technologie & SaaS",
  "Artisanat & Produits locaux",
  "Tourisme & Hôtellerie",
  "Agriculture & Agroalimentaire",
  "Autre",
];

const OFFER_TYPES = [
  { value: "physical", label: "Produit physique", icon: "📦" },
  { value: "digital", label: "Produit digital", icon: "💻" },
  { value: "service", label: "Service", icon: "🛠️" },
  { value: "subscription", label: "Abonnement", icon: "🔄" },
  { value: "training", label: "Formation", icon: "" },
  { value: "saas", label: "Application / SaaS", icon: "️" },
  { value: "other", label: "Autre", icon: "✨" },
];

const COUNTRIES = [
  "Côte d'Ivoire",
  "Sénégal",
  "Cameroun",
  "Bénin",
  "Togo",
  "Gabon",
  "Burkina Faso",
  "Mali",
  "Guinée",
  "RDC",
  "Madagascar",
  "Maroc",
  "Tunisie",
  "Algérie",
  "France",
  "Belgique",
  "Canada",
  "Suisse",
];

const OBJECTIVES = [
  { value: "sales", label: "Générer des ventes", desc: "Vendre directement vos produits/services" },
  { value: "leads", label: "Obtenir des prospects", desc: "Collecter des contacts qualifiés" },
  { value: "whatsapp", label: "Recevoir des messages WhatsApp", desc: "Initier des conversations directes" },
  { value: "signups", label: "Obtenir des inscriptions", desc: "Augmenter votre base d'utilisateurs" },
  { value: "traffic", label: "Générer du trafic", desc: "Amener des visiteurs sur votre site" },
  { value: "awareness", label: "Faire connaître mon offre", desc: "Augmenter la notoriété de votre marque" },
  { value: "retargeting", label: "Retargeter une audience", desc: "Recontacter des visiteurs précédents" },
];

const PLATFORMS = [
  { value: "meta", label: "Meta (Facebook & Instagram)" },
  { value: "tiktok", label: "TikTok" },
  { value: "google", label: "Google Ads" },
];

// ═══════════════════════════════════════════════════════════
// COMPOSANTS UI
// ══════════════════════════════════════════════════════════

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-sm font-medium text-[#18181B] mb-1.5">
      {children}
      {required && <span className="text-[#6366F1] ml-1">*</span>}
    </label>
  );
}

function HelpText({ children }: { children: React.ReactNode }) {
  return <p className="text-xs text-[#71717A] mt-1.5">{children}</p>;
}

function ErrorText({ children }: { children: React.ReactNode }) {
  if (!children) return null;
  return (
    <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1">
      <AlertCircle className="h-3 w-3" />
      {children}
    </p>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder,
  help,
  error,
  required,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  help?: string;
  error?: string;
  required?: boolean;
  type?: string;
}) {
  return (
    <div className="mb-5">
      <Label required={required}>{label}</Label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-4 py-3 rounded-lg border text-[15px] text-[#18181B] placeholder:text-[#A1A1AA] outline-none transition-all ${
          error
            ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/10"
            : "border-[#E7E7EB] focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/10"
        } bg-white`}
      />
      {help && <HelpText>{help}</HelpText>}
      <ErrorText>{error}</ErrorText>
    </div>
  );
}

function Textarea({
  label,
  value,
  onChange,
  placeholder,
  help,
  error,
  required,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  help?: string;
  error?: string;
  required?: boolean;
  rows?: number;
}) {
  return (
    <div className="mb-5">
      <Label required={required}>{label}</Label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className={`w-full px-4 py-3 rounded-lg border text-[15px] text-[#18181B] placeholder:text-[#A1A1AA] outline-none transition-all resize-none ${
          error
            ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/10"
            : "border-[#E7E7EB] focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/10"
        } bg-white`}
      />
      {help && <HelpText>{help}</HelpText>}
      <ErrorText>{error}</ErrorText>
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
  placeholder,
  error,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  error?: string;
  required?: boolean;
}) {
  return (
    <div className="mb-5">
      <Label required={required}>{label}</Label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-4 py-3 rounded-lg border text-[15px] text-[#18181B] outline-none transition-all bg-white cursor-pointer ${
          error
            ? "border-red-300 focus:border-red-500"
            : "border-[#E7E7EB] focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/10"
        }`}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ErrorText>{error}</ErrorText>
    </div>
  );
}

function RadioGroup({
  label,
  value,
  onChange,
  options,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string; desc?: string }[];
  required?: boolean;
}) {
  return (
    <div className="mb-5">
      <Label required={required}>{label}</Label>
      <div className="space-y-2">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${
              value === opt.value
                ? "border-[#6366F1] bg-[#6366F1]/5 ring-2 ring-[#6366F1]/10"
                : "border-[#E7E7EB] bg-white hover:border-[#6366F1]/30"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                  value === opt.value ? "border-[#6366F1]" : "border-[#D4D4D8]"
                }`}
              >
                {value === opt.value && <div className="w-2 h-2 rounded-full bg-[#6366F1]" />}
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-[#18181B]">{opt.label}</div>
                {opt.desc && <div className="text-xs text-[#71717A] mt-0.5">{opt.desc}</div>}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// ÉTAPES DU WIZARD
// ══════════════════════════════════════════════════════════

function Step1Entreprise({ data, update, errors }: { data: FormData; update: (d: Partial<FormData>) => void; errors: Record<string, string> }) {
  return (
    <div>
      <h1 className="text-[28px] md:text-[32px] font-bold text-[#18181B] tracking-tight mb-2">
        Commençons par votre entreprise.
      </h1>
      <p className="text-[15px] text-[#71717A] mb-8 leading-relaxed">
        Ces informations permettent à MakeItAds de comprendre votre activité avant de recommander une stratégie publicitaire.
      </p>

      <Input
        label="Nom de l'entreprise"
        value={data.businessName}
        onChange={(v) => update({ businessName: v })}
        placeholder="Exemple : Naya Cosmetics"
        error={errors.businessName}
        required
      />

      <Textarea
        label="Que fait votre entreprise ?"
        value={data.businessDescription}
        onChange={(v) => update({ businessDescription: v })}
        placeholder="Décrivez simplement ce que vous vendez et à qui vous le vendez."
        help="Exemple : Nous vendons des produits de soins naturels pour femmes."
        error={errors.businessDescription}
        required
        rows={4}
      />

      <Select
        label="Votre secteur"
        value={data.sector}
        onChange={(v) => update({ sector: v, customSector: v === "Autre" ? data.customSector : "" })}
        options={SECTORS.map((s) => ({ value: s, label: s }))}
        placeholder="Sélectionnez votre secteur"
        error={errors.sector}
        required
      />

      {data.sector === "Autre" && (
        <Input
          label="Précisez votre secteur"
          value={data.customSector}
          onChange={(v) => update({ customSector: v })}
          placeholder="Exemple : Artisanat local"
          error={errors.customSector}
          required
        />
      )}
    </div>
  );
}

function Step2Offre({ data, update, errors }: { data: FormData; update: (d: Partial<FormData>) => void; errors: Record<string, string> }) {
  return (
    <div>
      <h1 className="text-[28px] md:text-[32px] font-bold text-[#18181B] tracking-tight mb-2">
        Que voulez-vous vendre ?
      </h1>
      <p className="text-[15px] text-[#71717A] mb-8 leading-relaxed">
        Une bonne publicité commence par une offre clairement définie.
      </p>

      <Input
        label="Nom de l'offre"
        value={data.offerName}
        onChange={(v) => update({ offerName: v })}
        placeholder="Exemple : Programme Fitness 90 jours"
        error={errors.offerName}
        required
      />

      <div className="mb-5">
        <Label required>Prix de vente</Label>
        <div className="flex gap-2">
          <input
            type="text"
            value={data.offerPrice}
            onChange={(e) => update({ offerPrice: e.target.value })}
            placeholder="50 000"
            className={`flex-1 px-4 py-3 rounded-lg border text-[15px] text-[#18181B] placeholder:text-[#A1A1AA] outline-none transition-all bg-white ${
              errors.offerPrice ? "border-red-300" : "border-[#E7E7EB] focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/10"
            }`}
          />
          <select
            value={data.offerCurrency}
            onChange={(e) => update({ offerCurrency: e.target.value })}
            className="px-3 py-3 rounded-lg border border-[#E7E7EB] text-sm font-medium text-[#18181B] bg-white outline-none focus:border-[#6366F1]"
          >
            <option value="FCFA">FCFA</option>
            <option value="EUR">€</option>
            <option value="USD">$</option>
          </select>
        </div>
        <ErrorText>{errors.offerPrice}</ErrorText>
      </div>

      <div className="mb-5">
        <Label required>Type d'offre</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {OFFER_TYPES.map((type) => (
            <button
              key={type.value}
              type="button"
              onClick={() => update({ offerType: type.value })}
              className={`px-4 py-3 rounded-lg border transition-all text-left ${
                data.offerType === type.value
                  ? "border-[#6366F1] bg-[#6366F1]/5 ring-2 ring-[#6366F1]/10"
                  : "border-[#E7E7EB] bg-white hover:border-[#6366F1]/30"
              }`}
            >
              <div className="text-lg mb-1">{type.icon}</div>
              <div className="text-xs font-medium text-[#18181B]">{type.label}</div>
            </button>
          ))}
        </div>
        <ErrorText>{errors.offerType}</ErrorText>
      </div>

      <Textarea
        label="Pourquoi un client devrait-il choisir votre offre ?"
        value={data.valueProposition}
        onChange={(v) => update({ valueProposition: v })}
        placeholder="Qu'est-ce qui vous différencie ?"
        help="Pas besoin d'une phrase marketing parfaite. Expliquez simplement votre avantage."
        error={errors.valueProposition}
        required
        rows={3}
      />
    </div>
  );
}

function Step3Audience({ data, update, errors }: { data: FormData; update: (d: Partial<FormData>) => void; errors: Record<string, string> }) {
  return (
    <div>
      <h1 className="text-[28px] md:text-[32px] font-bold text-[#18181B] tracking-tight mb-2">
        À qui voulez-vous vendre ?
      </h1>
      <p className="text-[15px] text-[#71717A] mb-8 leading-relaxed">
        MakeItAds va utiliser ces informations pour construire votre ciblage et vos angles publicitaires.
      </p>

      <Textarea
        label="Qui est votre client idéal ?"
        value={data.audienceDescription}
        onChange={(v) => update({ audienceDescription: v })}
        placeholder="Exemple : Femmes de 25 à 40 ans vivant en zone urbaine, intéressées par les soins de la peau."
        error={errors.audienceDescription}
        required
        rows={3}
      />

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <Label>Âge minimum</Label>
          <input
            type="number"
            value={data.ageMin}
            onChange={(e) => update({ ageMin: e.target.value })}
            placeholder="25"
            disabled={data.ageUnknown}
            className="w-full px-4 py-3 rounded-lg border border-[#E7E7EB] text-[15px] text-[#18181B] placeholder:text-[#A1A1AA] outline-none focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/10 bg-white disabled:opacity-50"
          />
        </div>
        <div>
          <Label>Âge maximum</Label>
          <input
            type="number"
            value={data.ageMax}
            onChange={(e) => update({ ageMax: e.target.value })}
            placeholder="40"
            disabled={data.ageUnknown}
            className="w-full px-4 py-3 rounded-lg border border-[#E7E7EB] text-[15px] text-[#18181B] placeholder:text-[#A1A1AA] outline-none focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/10 bg-white disabled:opacity-50"
          />
        </div>
      </div>

      <label className="flex items-center gap-2 mb-5 cursor-pointer">
        <input
          type="checkbox"
          checked={data.ageUnknown}
          onChange={(e) => update({ ageUnknown: e.target.checked })}
          className="w-4 h-4 rounded border-[#E7E7EB] text-[#6366F1] focus:ring-[#6366F1]/20"
        />
        <span className="text-sm text-[#71717A]">Je ne sais pas</span>
      </label>

      <RadioGroup
        label="Genre"
        value={data.gender}
        onChange={(v) => update({ gender: v })}
        options={[
          { value: "Tous", label: "Tous" },
          { value: "Femmes", label: "Femmes" },
          { value: "Hommes", label: "Hommes" },
        ]}
      />

      <Textarea
        label="Quel problème votre client cherche-t-il à résoudre ?"
        value={data.mainProblem}
        onChange={(v) => update({ mainProblem: v })}
        placeholder="Exemple : Peau sensible, manque de temps, budget limité..."
        error={errors.mainProblem}
        required
        rows={3}
      />

      <Textarea
        label="Quel résultat votre client souhaite-t-il obtenir ?"
        value={data.mainDesire}
        onChange={(v) => update({ mainDesire: v })}
        placeholder="Exemple : Une peau éclatante, gagner du temps, se sentir confiant..."
        error={errors.mainDesire}
        required
        rows={3}
      />
    </div>
  );
}

function Step4Marche({ data, update, errors }: { data: FormData; update: (d: Partial<FormData>) => void; errors: Record<string, string> }) {
  const toggleCountry = (country: string) => {
    if (data.countries.includes(country)) {
      update({ countries: data.countries.filter((c) => c !== country) });
    } else {
      update({ countries: [...data.countries, country] });
    }
  };

  const addCity = () => update({ cities: [...data.cities, ""] });
  const updateCity = (index: number, value: string) => {
    const newCities = [...data.cities];
    newCities[index] = value;
    update({ cities: newCities });
  };
  const removeCity = (index: number) => update({ cities: data.cities.filter((_, i) => i !== index) });

  return (
    <div>
      <h1 className="text-[28px] md:text-[32px] font-bold text-[#18181B] tracking-tight mb-2">
        Où voulez-vous vendre ?
      </h1>
      <p className="text-[15px] text-[#71717A] mb-8 leading-relaxed">
        Le marché influence directement le canal, le ciblage et la structure de votre campagne.
      </p>

      <div className="mb-5">
        <Label required>Pays ciblés</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-3">
          {COUNTRIES.map((country) => (
            <button
              key={country}
              type="button"
              onClick={() => toggleCountry(country)}
              className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all ${
                data.countries.includes(country)
                  ? "border-[#6366F1] bg-[#6366F1]/5 text-[#6366F1]"
                  : "border-[#E7E7EB] bg-white text-[#18181B] hover:border-[#6366F1]/30"
              }`}
            >
              {country}
            </button>
          ))}
        </div>
        <ErrorText>{errors.countries}</ErrorText>
      </div>

      <RadioGroup
        label="Zone géographique"
        value={data.geoZone}
        onChange={(v) => update({ geoZone: v })}
        options={[
          { value: "Pays entier", label: "Pays entier" },
          { value: "Villes spécifiques", label: "Villes spécifiques" },
          { value: "Zones urbaines", label: "Zones urbaines" },
          { value: "Zones rurales", label: "Zones rurales" },
          { value: "Je ne sais pas", label: "Je ne sais pas" },
        ]}
        required
      />
      <ErrorText>{errors.geoZone}</ErrorText>

      {data.geoZone === "Villes spécifiques" && (
        <div className="mb-5">
          <Label>Villes</Label>
          {data.cities.map((city, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input
                type="text"
                value={city}
                onChange={(e) => updateCity(i, e.target.value)}
                placeholder="Exemple : Abidjan"
                className="flex-1 px-4 py-2.5 rounded-lg border border-[#E7E7EB] text-sm text-[#18181B] placeholder:text-[#A1A1AA] outline-none focus:border-[#6366F1] bg-white"
              />
              <button
                type="button"
                onClick={() => removeCity(i)}
                className="px-3 py-2 rounded-lg border border-[#E7E7EB] text-[#71717A] hover:text-red-600 hover:border-red-300 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addCity}
            className="flex items-center gap-1.5 text-sm font-medium text-[#6366F1] hover:text-[#8B5CF6] transition-colors"
          >
            <Plus className="h-4 w-4" />
            Ajouter une ville
          </button>
        </div>
      )}

      <Select
        label="Langue de l'audience"
        value={data.language}
        onChange={(v) => update({ language: v })}
        options={[
          { value: "Français", label: "Français" },
          { value: "Anglais", label: "Anglais" },
          { value: "Français + Anglais", label: "Français + Anglais" },
          { value: "Autre", label: "Autre" },
        ]}
      />
    </div>
  );
}

function Step5Objectif({ data, update, errors }: { data: FormData; update: (d: Partial<FormData>) => void; errors: Record<string, string> }) {
  return (
    <div>
      <h1 className="text-[28px] md:text-[32px] font-bold text-[#18181B] tracking-tight mb-2">
        Quel résultat voulez-vous obtenir ?
      </h1>
      <p className="text-[15px] text-[#71717A] mb-8 leading-relaxed">
        Votre objectif déterminera la structure et les recommandations de votre stratégie.
      </p>

      <RadioGroup
        label="Objectif principal"
        value={data.mainObjective}
        onChange={(v) => update({ mainObjective: v })}
        options={OBJECTIVES}
        required
      />
      <ErrorText>{errors.mainObjective}</ErrorText>

      <Select
        label="Objectif secondaire (optionnel)"
        value={data.secondaryObjective}
        onChange={(v) => update({ secondaryObjective: v })}
        options={[
          { value: "", label: "Aucun" },
          ...OBJECTIVES.map((o) => ({ value: o.value, label: o.label })),
        ]}
        placeholder="Sélectionnez un objectif secondaire"
      />

      <div className="mt-8 pt-6 border-t border-[#E7E7EB]">
        <h2 className="text-lg font-semibold text-[#18181B] mb-4">Quel budget publicitaire prévoyez-vous ?</h2>

        <label className="flex items-center gap-2 mb-4 cursor-pointer">
          <input
            type="checkbox"
            checked={data.budgetUnknown}
            onChange={(e) => update({ budgetUnknown: e.target.checked, budget: "" })}
            className="w-4 h-4 rounded border-[#E7E7EB] text-[#6366F1] focus:ring-[#6366F1]/20"
          />
          <span className="text-sm text-[#71717A]">Je ne sais pas encore</span>
        </label>

        {!data.budgetUnknown && (
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="col-span-2">
              <Label>Montant</Label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={data.budget}
                  onChange={(e) => update({ budget: e.target.value })}
                  placeholder="100 000"
                  className="flex-1 px-4 py-3 rounded-lg border border-[#E7E7EB] text-[15px] text-[#18181B] placeholder:text-[#A1A1AA] outline-none focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/10 bg-white"
                />
                <select
                  value={data.budgetPeriod}
                  onChange={(e) => update({ budgetPeriod: e.target.value })}
                  className="px-3 py-3 rounded-lg border border-[#E7E7EB] text-sm font-medium text-[#18181B] bg-white outline-none focus:border-[#6366F1]"
                >
                  <option value="jour">/ jour</option>
                  <option value="semaine">/ semaine</option>
                  <option value="mois">/ mois</option>
                  <option value="total">total</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Step6Concurrence({ data, update, errors }: { data: FormData; update: (d: Partial<FormData>) => void; errors: Record<string, string> }) {
  const addCompetitor = () => update({ otherCompetitors: [...data.otherCompetitors, ""] });
  const updateCompetitor = (index: number, value: string) => {
    const newCompetitors = [...data.otherCompetitors];
    newCompetitors[index] = value;
    update({ otherCompetitors: newCompetitors });
  };
  const removeCompetitor = (index: number) => update({ otherCompetitors: data.otherCompetitors.filter((_, i) => i !== index) });

  return (
    <div>
      <h1 className="text-[28px] md:text-[32px] font-bold text-[#18181B] tracking-tight mb-2">
        Qui affrontez-vous ?
      </h1>
      <p className="text-[15px] text-[#71717A] mb-8 leading-relaxed">
        Comprendre votre environnement concurrentiel permet d'éviter les campagnes génériques.
      </p>

      <label className="flex items-center gap-2 mb-5 cursor-pointer">
        <input
          type="checkbox"
          checked={data.noCompetitors}
          onChange={(e) => update({ noCompetitors: e.target.checked })}
          className="w-4 h-4 rounded border-[#E7E7EB] text-[#6366F1] focus:ring-[#6366F1]/20"
        />
        <span className="text-sm text-[#71717A]">Je ne connais pas encore mes concurrents</span>
      </label>

      {!data.noCompetitors && (
        <>
          <Input
            label="Concurrent principal"
            value={data.mainCompetitor}
            onChange={(v) => update({ mainCompetitor: v })}
            placeholder="Nom de votre principal concurrent"
            help="Laissez vide si vous ne connaissez pas de concurrent direct."
          />

          <Input
            label="Site / page du concurrent (optionnel)"
            value={data.competitorUrl}
            onChange={(v) => update({ competitorUrl: v })}
            placeholder="https://..."
          />

          <div className="mb-5">
            <Label>Autres concurrents</Label>
            {data.otherCompetitors.map((comp, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={comp}
                  onChange={(e) => updateCompetitor(i, e.target.value)}
                  placeholder="Nom du concurrent"
                  className="flex-1 px-4 py-2.5 rounded-lg border border-[#E7E7EB] text-sm text-[#18181B] placeholder:text-[#A1A1AA] outline-none focus:border-[#6366F1] bg-white"
                />
                <button
                  type="button"
                  onClick={() => removeCompetitor(i)}
                  className="px-3 py-2 rounded-lg border border-[#E7E7EB] text-[#71717A] hover:text-red-600 hover:border-red-300 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addCompetitor}
              className="flex items-center gap-1.5 text-sm font-medium text-[#6366F1] hover:text-[#8B5CF6] transition-colors"
            >
              <Plus className="h-4 w-4" />
              Ajouter un concurrent
            </button>
          </div>

          <Textarea
            label="Pourquoi vos clients choisissent-ils parfois vos concurrents ?"
            value={data.competitorAdvantage}
            onChange={(v) => update({ competitorAdvantage: v })}
            placeholder="Prix, confiance, notoriété, qualité, disponibilité..."
            help="Cette information nous aide à positionner votre offre."
            rows={3}
          />
        </>
      )}
    </div>
  );
}

function Step7Campagne({ data, update, errors }: { data: FormData; update: (d: Partial<FormData>) => void; errors: Record<string, string> }) {
  const togglePlatform = (platform: string) => {
    if (platform === "unknown") {
      update({ unknownPlatform: !data.unknownPlatform, platforms: [] });
    } else {
      if (data.platforms.includes(platform)) {
        update({ platforms: data.platforms.filter((p) => p !== platform), unknownPlatform: false });
      } else {
        update({ platforms: [...data.platforms, platform], unknownPlatform: false });
      }
    }
  };

  return (
    <div>
      <h1 className="text-[28px] md:text-[32px] font-bold text-[#18181B] tracking-tight mb-2">
        Comment souhaitez-vous lancer votre campagne ?
      </h1>
      <p className="text-[15px] text-[#71717A] mb-8 leading-relaxed">
        Quelques dernières informations avant de construire votre stratégie.
      </p>

      <div className="mb-5">
        <Label>Plateformes souhaitées</Label>
        <div className="space-y-2 mb-3">
          {PLATFORMS.map((platform) => (
            <button
              key={platform.value}
              type="button"
              onClick={() => togglePlatform(platform.value)}
              className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${
                data.platforms.includes(platform.value)
                  ? "border-[#6366F1] bg-[#6366F1]/5"
                  : "border-[#E7E7EB] bg-white hover:border-[#6366F1]/30"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                    data.platforms.includes(platform.value) ? "border-[#6366F1] bg-[#6366F1]" : "border-[#D4D4D8]"
                  }`}
                >
                  {data.platforms.includes(platform.value) && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
                </div>
                <span className="text-sm font-medium text-[#18181B]">{platform.label}</span>
              </div>
            </button>
          ))}
          <button
            type="button"
            onClick={() => togglePlatform("unknown")}
            className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${
              data.unknownPlatform
                ? "border-[#6366F1] bg-[#6366F1]/5"
                : "border-[#E7E7EB] bg-white hover:border-[#6366F1]/30"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                  data.unknownPlatform ? "border-[#6366F1] bg-[#6366F1]" : "border-[#D4D4D8]"
                }`}
              >
                {data.unknownPlatform && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
              </div>
              <span className="text-sm font-medium text-[#18181B]">Je ne sais pas — MakeItAds décidera</span>
            </div>
          </button>
        </div>
        <HelpText>Si vous ne savez pas, MakeItAds déterminera automatiquement le canal le plus pertinent.</HelpText>
      </div>

      <RadioGroup
        label="Statut de vos campagnes"
        value={data.campaignStatus}
        onChange={(v) => update({ campaignStatus: v })}
        options={[
          { value: "new", label: "Je démarre de zéro" },
          { value: "existing", label: "J'ai déjà lancé des campagnes" },
          { value: "struggling", label: "Je suis actuellement en difficulté" },
        ]}
      />

      {(data.campaignStatus === "existing" || data.campaignStatus === "struggling") && (
        <Textarea
          label="Qu'est-ce qui ne fonctionne pas actuellement ?"
          value={data.campaignIssues}
          onChange={(v) => update({ campaignIssues: v })}
          placeholder="Exemple : Beaucoup de clics mais peu de ventes."
          rows={3}
        />
      )}

      {/* Récapitulatif */}
      <div className="mt-8 pt-6 border-t border-[#E7E7EB]">
        <h2 className="text-lg font-semibold text-[#18181B] mb-4 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-[#6366F1]" />
          Votre stratégie
        </h2>
        <div className="bg-[#F7F7F8] rounded-lg p-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-[#71717A]">Entreprise</span>
            <span className="font-medium text-[#18181B]">{data.businessName || "—"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#71717A]">Offre</span>
            <span className="font-medium text-[#18181B]">{data.offerName || "—"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#71717A]">Marché</span>
            <span className="font-medium text-[#18181B]">{data.countries.join(", ") || "—"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#71717A]">Audience</span>
            <span className="font-medium text-[#18181B]">{data.audienceDescription.slice(0, 50) || "—"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#71717A]">Objectif</span>
            <span className="font-medium text-[#18181B]">
              {OBJECTIVES.find((o) => o.value === data.mainObjective)?.label || "—"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#71717A]">Budget</span>
            <span className="font-medium text-[#18181B]">
              {data.budgetUnknown ? "À déterminer" : `${data.budget} ${data.offerCurrency} / ${data.budgetPeriod}`}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#71717A]">Canaux</span>
            <span className="font-medium text-[#18181B]">
              {data.unknownPlatform ? "À déterminer par MakeItAds" : data.platforms.join(", ") || "—"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
// PAGE PRINCIPALE
// ══════════════════════════════════════════════════════════

export default function StrategyWizardPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [credits, setCredits] = useState(3); // À remplacer par usePlan

  // Sauvegarde automatique
  useEffect(() => {
    const saved = localStorage.getItem("strategy-draft");
    if (saved) {
      try {
        setFormData(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem("strategy-draft", JSON.stringify(formData));
    }, 1000);
    return () => clearTimeout(timer);
  }, [formData]);

  const updateFormData = useCallback((updates: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
    setErrors((prev) => {
      const newErrors = { ...prev };
      Object.keys(updates).forEach((key) => delete newErrors[key]);
      return newErrors;
    });
  }, []);

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 0:
        if (!formData.businessName.trim()) newErrors.businessName = "Ajoutez le nom de votre entreprise pour continuer.";
        if (!formData.businessDescription.trim()) newErrors.businessDescription = "Décrivez votre entreprise pour continuer.";
        if (!formData.sector) newErrors.sector = "Sélectionnez votre secteur.";
        if (formData.sector === "Autre" && !formData.customSector.trim()) newErrors.customSector = "Précisez votre secteur.";
        break;
      case 1:
        if (!formData.offerName.trim()) newErrors.offerName = "Donnez un nom à votre offre.";
        if (!formData.offerPrice.trim()) newErrors.offerPrice = "Indiquez le prix de votre offre.";
        if (!formData.offerType) newErrors.offerType = "Sélectionnez le type d'offre.";
        if (!formData.valueProposition.trim()) newErrors.valueProposition = "Expliquez votre avantage concurrentiel.";
        break;
      case 2:
        if (!formData.audienceDescription.trim()) newErrors.audienceDescription = "Décrivez votre client idéal.";
        if (!formData.mainProblem.trim()) newErrors.mainProblem = "Quel problème votre client cherche-t-il à résoudre ?";
        if (!formData.mainDesire.trim()) newErrors.mainDesire = "Quel résultat votre client souhaite-t-il obtenir ?";
        break;
      case 3:
        if (formData.countries.length === 0) newErrors.countries = "Sélectionnez au moins un pays.";
        if (!formData.geoZone) newErrors.geoZone = "Sélectionnez une zone géographique.";
        break;
      case 4:
        if (!formData.mainObjective) newErrors.mainObjective = "Sélectionnez votre objectif principal.";
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 6) setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const handleGenerate = async () => {
    if (!validateStep(6)) return;

    if (credits <= 0) {
      setErrors({ api: "CRÉDITS_INSUFFISANTS" });
      return;
    }

    setIsGenerating(true);
    setErrors({});

    try {
      const res = await fetch("/api/generate-strategy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formData }),
      });

      const result = await res.json();

      if (!res.ok) {
        if (result.error === "CRÉDITS_INSUFFISANTS") {
          setErrors({ api: "CRÉDITS_INSUFFISANTS" });
          setIsGenerating(false);
          return;
        }
        throw new Error(result.error || "ÉCHEC_GÉNÉRATION");
      }

      if (result.strategyId) {
        localStorage.removeItem("strategy-draft");
        router.push(`/dashboard/strategies/${result.strategyId}`);
      } else {
        throw new Error("ID_STRATÉGIE_MANQUANT");
      }
    } catch (err: any) {
      console.error(err);
      setIsGenerating(false);
      setErrors({ api: "Impossible de terminer votre stratégie. Votre crédit n'a pas été consommé." });
    }
  };

  const stepTitles = ["Entreprise", "Offre", "Audience", "Marché", "Objectif", "Concurrence", "Campagne"];
  const progressText = currentStep === 6 ? "Dernière étape" : currentStep === 0 ? "Environ 3 minutes" : `Plus que ${7 - currentStep - 1} étapes`;

  return (
    <div className="min-h-screen bg-[#F7F7F8]">
      {/* Header */}
      <header className="bg-white border-b border-[#E7E7EB] px-4 md:px-6 py-4">
        <div className="max-w-[720px] mx-auto flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center">
              <Zap className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-sm font-bold">
              MakeIt<span className="text-[#6366F1]">Ads</span>
            </span>
          </Link>
          <div className="text-xs text-[#71717A]">Étape {currentStep + 1} sur 7</div>
        </div>
      </header>

      {/* Progress */}
      <div className="bg-white border-b border-[#E7E7EB] px-4 md:px-6 py-3">
        <div className="max-w-[720px] mx-auto">
          <div className="flex items-center justify-between mb-2">
            <div className="flex gap-1">
              {stepTitles.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${
                    i <= currentStep ? "w-8 bg-[#6366F1]" : "w-8 bg-[#E7E7EB]"
                  }`}
                />
              ))}
            </div>
          </div>
          <p className="text-xs text-[#71717A]">{progressText}</p>
        </div>
      </div>

      {/* Content */}
      <main className="px-4 md:px-6 py-8 md:py-12">
        <div className="max-w-[720px] mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {currentStep === 0 && <Step1Entreprise data={formData} update={updateFormData} errors={errors} />}
              {currentStep === 1 && <Step2Offre data={formData} update={updateFormData} errors={errors} />}
              {currentStep === 2 && <Step3Audience data={formData} update={updateFormData} errors={errors} />}
              {currentStep === 3 && <Step4Marche data={formData} update={updateFormData} errors={errors} />}
              {currentStep === 4 && <Step5Objectif data={formData} update={updateFormData} errors={errors} />}
              {currentStep === 5 && <Step6Concurrence data={formData} update={updateFormData} errors={errors} />}
              {currentStep === 6 && <Step7Campagne data={formData} update={updateFormData} errors={errors} />}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-12 pt-6 border-t border-[#E7E7EB]">
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium text-[#71717A] hover:text-[#18181B] hover:bg-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour
            </button>

            {currentStep < 6 ? (
              <button
                onClick={handleNext}
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-lg bg-[#6366F1] text-sm font-semibold text-white hover:bg-[#5558e6] transition-colors shadow-sm shadow-[#6366F1]/20"
              >
                Continuer
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={handleGenerate}
                disabled={credits <= 0}
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-lg bg-[#6366F1] text-sm font-semibold text-white hover:bg-[#5558e6] transition-colors shadow-sm shadow-[#6366F1]/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Sparkles className="h-4 w-4" />
                Construire ma stratégie
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Gestion des erreurs API */}
          {errors.api && (
            <div className="mt-6 p-4 rounded-lg bg-red-50 border border-red-200">
              {errors.api === "CRÉDITS_INSUFFISANTS" ? (
                <>
                  <p className="text-sm text-red-900 font-medium mb-2">Vous n'avez plus de crédits disponibles.</p>
                  <p className="text-xs text-red-700 mb-3">Rechargez votre compte pour continuer à générer des stratégies.</p>
                  <div className="flex gap-2">
                    <Link href="/dashboard/credits" className="px-4 py-2 rounded-lg bg-red-600 text-xs font-semibold text-white hover:bg-red-700 transition-colors">
                      Obtenir des crédits
                    </Link>
                    <button onClick={() => setErrors({})} className="px-4 py-2 rounded-lg border border-red-300 text-xs font-medium text-red-700 hover:bg-red-100 transition-colors">
                      Annuler
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-sm text-red-900 font-medium mb-2">{errors.api}</p>
                  <div className="flex gap-2">
                    <button onClick={handleGenerate} className="px-4 py-2 rounded-lg bg-red-600 text-xs font-semibold text-white hover:bg-red-700 transition-colors">
                      Réessayer
                    </button>
                    <Link href="/dashboard/strategies" className="px-4 py-2 rounded-lg border border-red-300 text-xs font-medium text-red-700 hover:bg-red-100 transition-colors">
                      Retour
                    </Link>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}