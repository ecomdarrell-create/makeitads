"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Copy,
  Check,
  Pencil,
  X,
  Shield,
  LogOut,
  HelpCircle,
  BookOpen,
  MessageCircle,
  Loader2,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { useSession } from "@/hooks/useSession";

// ═══════════════════════════════════════════════════════════
// COMPOSANT TOGGLE PERSONNALISÉ
// ══════════════════════════════════════════════════════════

function Toggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description: string;
}) {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex-1 pr-4">
        <p className="text-sm font-medium text-[#18181B]">{label}</p>
        <p className="text-xs text-[#71717A] mt-0.5 leading-relaxed">{description}</p>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
          checked ? "bg-[#6366F1]" : "bg-[#E7E7EB]"
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// PAGE PRINCIPALE
// ══════════════════════════════════════════════════════════

export default function SettingsPage() {
  const router = useRouter();
  const { user } = useSession();
  
  // États Compte
  const [fullName, setFullName] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");

  // États Préférences
  const [importantEmails, setImportantEmails] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);

  // États UI
  const [isCopied, setIsCopied] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    if (user) {
      const name = user.user_metadata?.full_name || user.user_metadata?.first_name || "Utilisateur";
      setFullName(name);
      setTempName(name);
    }
  }, [user]);

  // --- Handlers ---

  const handleCopyEmail = async () => {
    if (!user?.email) return;
    try {
      await navigator.clipboard.writeText(user.email);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Échec de la copie", err);
    }
  };

  const handleSaveName = async () => {
    if (!tempName.trim() || tempName === fullName) {
      setIsEditingName(false);
      return;
    }

    setIsSaving(true);
    setSaveStatus("idle");

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({
        data: { full_name: tempName.trim(), first_name: tempName.trim().split(" ")[0] },
      });

      if (error) throw error;

      setFullName(tempName.trim());
      setSaveStatus("success");
      setIsEditingName(false);
      
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch (err) {
      console.error(err);
      setSaveStatus("error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push("/login");
    } catch (err) {
      console.error("Erreur de déconnexion", err);
    }
  };

  const email = user?.email || "non-disponible";

  return (
    <div className="max-w-[760px] mx-auto pb-12">
      {/* ══════════════════════════════════════════════════════
          HEADER
      ═══════════════════════════════════════════════════════ */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-[28px] font-bold text-[#18181B] tracking-tight">Paramètres</h1>
        <p className="text-[15px] text-[#71717A] mt-1.5">
          Gérez les informations et préférences associées à votre compte MakeItAds.
        </p>
      </motion.div>

      <div className="space-y-6">
        {/* ══════════════════════════════════════════════════════
            SECTION 1 : COMPTE
        ═══════════════════════════════════════════════════════ */}
        <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <h2 className="text-xs font-bold text-[#71717A] uppercase tracking-wider mb-3">Compte</h2>
          <div className="bg-white rounded-[14px] border border-[#E7E7EB] p-5 md:p-6">
            {/* Nom */}
            <div className="pb-5 border-b border-[#F7F7F8] mb-5">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-[#18181B]">Nom complet</label>
                {!isEditingName && (
                  <button
                    onClick={() => {
                      setTempName(fullName);
                      setIsEditingName(true);
                      setSaveStatus("idle");
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6366F1] hover:text-[#8B5CF6] transition-colors"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Modifier
                  </button>
                )}
              </div>

              {isEditingName ? (
                <div className="space-y-3">
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#71717A]" />
                    <input
                      type="text"
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-[#E7E7EB] text-sm text-[#18181B] focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/10 outline-none transition-all"
                      autoFocus
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs">
                      {saveStatus === "success" && <span className="text-emerald-600 flex items-center gap-1"><Check className="h-3 w-3" /> Modifications enregistrées</span>}
                      {saveStatus === "error" && <span className="text-red-600 flex items-center gap-1"><AlertCircle className="h-3 w-3" /> Impossible d'enregistrer</span>}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setIsEditingName(false);
                          setSaveStatus("idle");
                        }}
                        disabled={isSaving}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium text-[#71717A] hover:bg-[#F7F7F8] transition-colors disabled:opacity-50"
                      >
                        Annuler
                      </button>
                      <button
                        onClick={handleSaveName}
                        disabled={isSaving || !tempName.trim()}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#6366F1] text-xs font-semibold text-white hover:bg-[#5558e6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSaving && <Loader2 className="h-3 w-3 animate-spin" />}
                        Enregistrer
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-[#18181B] font-medium">{fullName}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-[#18181B]">Adresse email</label>
                <button
                  onClick={handleCopyEmail}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6366F1] hover:text-[#8B5CF6] transition-colors"
                >
                  {isCopied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {isCopied ? "Copié ✓" : "Copier"}
                </button>
              </div>
              <p className="text-sm text-[#18181B] font-medium truncate">{email}</p>
              <p className="text-xs text-[#71717A] mt-1.5 leading-relaxed">
                Votre adresse email est utilisée pour vous connecter à MakeItAds et recevoir les communications importantes liées à votre compte.
              </p>
            </div>
          </div>
        </motion.section>

        {/* ══════════════════════════════════════════════════════
            SECTION 2 : PRÉFÉRENCES
        ═══════════════════════════════════════════════════════ */}
        <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h2 className="text-xs font-bold text-[#71717A] uppercase tracking-wider mb-3">Préférences</h2>
          <div className="bg-white rounded-[14px] border border-[#E7E7EB] p-5 md:p-6">
            <Toggle
              checked={importantEmails}
              onChange={setImportantEmails}
              label="Recevoir les emails importants"
              description="Confirmation d'achat, créditing, génération de stratégie et informations importantes liées au compte."
            />
            <div className="border-t border-[#F7F7F8] my-2" />
            <Toggle
              checked={marketingEmails}
              onChange={setMarketingEmails}
              label="Recevoir les nouveautés MakeItAds"
              description="Nouvelles fonctionnalités, ressources et offres. Vous pouvez vous désinscrire à tout moment."
            />
          </div>
        </motion.section>

        {/* ══════════════════════════════════════════════════════
            SECTION 3 : SÉCURITÉ & SESSION
        ═══════════════════════════════════════════════════════ */}
        <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <h2 className="text-xs font-bold text-[#71717A] uppercase tracking-wider mb-3">Sécurité</h2>
          <div className="bg-white rounded-[14px] border border-[#E7E7EB] p-5 md:p-6">
            <div className="flex items-start gap-3 mb-5 pb-5 border-b border-[#F7F7F8]">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
                <Shield className="h-4.5 w-4.5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-[#18181B]">Session actuelle</p>
                <p className="text-xs text-[#71717A] mt-0.5">Vous êtes actuellement connecté à cet appareil de manière sécurisée.</p>
              </div>
            </div>
            <button
              onClick={() => setShowLogoutModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-red-200 bg-red-50 text-sm font-semibold text-red-600 hover:bg-red-100 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Se déconnecter
            </button>
          </div>
        </motion.section>

        {/* ══════════════════════════════════════════════════════
            SECTION 4 : ASSISTANCE
        ═══════════════════════════════════════════════════════ */}
        <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h2 className="text-xs font-bold text-[#71717A] uppercase tracking-wider mb-3">Assistance</h2>
          <div className="bg-[#F7F7F8] rounded-[14px] border border-[#E7E7EB] p-5 md:p-6">
            <h3 className="text-base font-bold text-[#18181B] mb-1">Besoin d'aide ?</h3>
            <p className="text-sm text-[#71717A] mb-5 leading-relaxed">
              Une question concernant votre compte, vos crédits ou votre stratégie ? Notre équipe est là pour vous aider.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mb-5">
              <a
                href="mailto:support@makeitads.pro"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#6366F1] text-sm font-semibold text-white hover:bg-[#5558e6] transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                Contacter le support
              </a>
              <Link
                href="/dashboard/resources"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-white border border-[#E7E7EB] text-sm font-semibold text-[#18181B] hover:bg-[#FFFFFF] hover:border-[#6366F1]/30 transition-colors"
              >
                <BookOpen className="h-4 w-4" />
                Centre d'aide
              </Link>
            </div>
            <Link
              href="/dashboard/resources"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[#6366F1] hover:text-[#8B5CF6] transition-colors"
            >
              Vous cherchez une réponse rapide ? Consulter les ressources
              <HelpCircle className="h-3.5 w-3.5" />
            </Link>
          </div>
        </motion.section>

        {/* ══════════════════════════════════════════════════════
            FOOTER LÉGAL
        ═══════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="pt-6 border-t border-[#E7E7EB] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#71717A]"
        >
          <div className="flex items-center gap-4">
            <Link href="/terms" className="hover:text-[#18181B] transition-colors">
              Conditions d'utilisation
            </Link>
            <Link href="/privacy" className="hover:text-[#18181B] transition-colors">
              Politique de confidentialité
            </Link>
          </div>
          <span className="font-mono text-[10px] text-[#A1A1AA]">
            MakeItAds v1.0.0
          </span>
        </motion.div>
      </div>

      {/* ══════════════════════════════════════════════════════
          MODAL DE DÉCONNEXION
      ═══════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {showLogoutModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLogoutModal(false)}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="w-full max-w-sm rounded-[14px] bg-white border border-[#E7E7EB] p-6 shadow-xl">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
                    <LogOut className="h-5 w-5 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-[#18181B] mb-1">
                      Se déconnecter de MakeItAds ?
                    </h3>
                    <p className="text-sm text-[#71717A] leading-relaxed">
                      Vous devrez vous reconnecter pour accéder à votre compte et à vos stratégies.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 justify-end">
                  <button
                    onClick={() => setShowLogoutModal(false)}
                    className="px-4 py-2 rounded-lg border border-[#E7E7EB] text-sm font-medium text-[#18181B] hover:bg-[#F7F7F8] transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 rounded-lg bg-red-600 text-sm font-semibold text-white hover:bg-red-700 transition-colors"
                  >
                    Se déconnecter
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}