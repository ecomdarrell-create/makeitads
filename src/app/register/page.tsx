"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, ArrowRight, CheckCircle2, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }

    if (!acceptTerms) {
      setError("Veuillez accepter les conditions d'utilisation.");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: name.split(" ")[0],
            last_name: name.split(" ").slice(1).join(" "),
          },
        },
      });

      if (error) {
        setError(error.message);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/login?registered=true");
      }, 2500);
    } catch (err) {
      setError("Une erreur inattendue est survenue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    // FORCAGE DU FOND BLANC ICI
    <div className="min-h-screen bg-white flex flex-col lg:flex-row text-[#0F172A]">
      
      {/* COLONNE GAUCHE - Value proposition (Visible uniquement sur PC) */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 flex-col justify-between p-12 xl:p-20 relative overflow-hidden bg-gradient-to-br from-[#FAFAFC] to-white">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#6366f1]/5 rounded-full blur-[120px] -translate-y-1/3 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#8b5cf6]/5 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3 pointer-events-none" />

        <div className="relative z-10">
          <div className="mb-16">
            <span className="text-2xl font-bold tracking-tight">
              <span className="text-[#0F172A]">MakeIt</span>
              <span className="text-[#6366f1]">Ads</span>
            </span>
          </div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl xl:text-5xl font-bold text-[#0F172A] leading-[1.1] mb-6 tracking-tight"
          >
            Ne lancez plus de pubs{" "}
            <span className="bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] bg-clip-text text-transparent">
              au hasard.
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-[#64748B] mb-10 max-w-lg leading-relaxed"
          >
            Créez votre compte et obtenez votre première stratégie publicitaire complète, prête à copier-coller, en quelques minutes.
          </motion.p>

          <div className="space-y-4 mb-12">
            {[
              "Stratégie complète générée en 2 minutes",
              "Ciblage et textes calibrés pour l'Afrique",
              "Paiement unique via Mobile Money",
              "Zéro abonnement, zéro engagement",
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                  <svg className="h-3.5 w-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-[#334155] font-medium">{feature}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="relative z-10 mt-12">
          <p className="text-xs text-[#94A3B8]">© 2025 MakeItAds. Tous droits réservés.</p>
        </div>
      </div>

      {/* COLONNE DROITE - Formulaire */}
      <div className="w-full lg:w-1/2 xl:w-2/5 flex items-center justify-center p-6 sm:p-12 bg-white">
        <div className="w-full max-w-md">
          {/* Logo Mobile */}
          <div className="lg:hidden flex justify-center mb-8">
            <span className="text-2xl font-bold tracking-tight">
              <span className="text-[#0F172A]">MakeIt</span>
              <span className="text-[#6366f1]">Ads</span>
            </span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] mb-2 tracking-tight">Créez votre compte</h2>
            <p className="text-[#64748B]">Accédez à votre première stratégie publicitaire IA dès aujourd'hui.</p>
          </div>

          <AnimatePresence mode="wait">
            {success ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="py-8 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center mb-4"
                >
                  <CheckCircle2 className="h-8 w-8 text-white" />
                </motion.div>
                <p className="text-[#0F172A] font-semibold text-lg">Compte créé avec succès !</p>
                <p className="text-sm text-[#64748B] mt-2 max-w-xs mx-auto">Vérifiez votre adresse email pour activer votre compte, puis connectez-vous.</p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                {/* Champ Nom */}
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#94A3B8]" />
                  <input
                    type="text"
                    placeholder="Votre nom complet"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    autoComplete="name"
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-[#E5E7EB] bg-white text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/10 outline-none transition-all"
                  />
                </div>

                {/* Champ Email */}
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#94A3B8]" />
                  <input
                    type="email"
                    placeholder="votre@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-[#E5E7EB] bg-white text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/10 outline-none transition-all"
                  />
                </div>

                {/* Champ Mot de passe */}
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#94A3B8]" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Créer un mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                    className="w-full pl-12 pr-12 py-3.5 rounded-xl border border-[#E5E7EB] bg-white text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/10 outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#6366f1] transition-colors p-1"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>

                {/* Champ Confirmation Mot de passe */}
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#94A3B8]" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirmer le mot de passe"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                    className="w-full pl-12 pr-12 py-3.5 rounded-xl border border-[#E5E7EB] bg-white text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/10 outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#6366f1] transition-colors p-1"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>

                {/* Checkbox Conditions */}
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative mt-0.5">
                    <input
                      type="checkbox"
                      checked={acceptTerms}
                      onChange={(e) => setAcceptTerms(e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`h-5 w-5 rounded-md border transition-all duration-200 flex items-center justify-center ${
                      acceptTerms 
                        ? "bg-[#6366f1] border-[#6366f1]" 
                        : "border-[#E5E7EB] bg-white group-hover:border-[#6366f1]/50"
                    }`}>
                      {acceptTerms && (
                        <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-[#64748B] leading-relaxed">
                    J'accepte les{" "}
                    <Link href="/terms" className="text-[#6366f1] hover:text-[#8b5cf6] transition-colors font-medium">
                      Conditions d'utilisation
                    </Link>{" "}
                    et la{" "}
                    <Link href="/privacy" className="text-[#6366f1] hover:text-[#8b5cf6] transition-colors font-medium">
                      Politique de confidentialité
                    </Link>
                  </span>
                </label>

                {/* Message d'erreur */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="rounded-xl border border-red-500/20 bg-red-50 p-3 text-sm text-red-600 flex items-start gap-2"
                    >
                      <span className="mt-0.5">⚠️</span> {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Bouton Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white font-semibold text-base hover:from-[#5558e6] hover:to-[#7c3aed] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#6366f1]/25 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Créer mon compte
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>

                {/* Lien vers login */}
                <p className="text-center text-sm text-[#64748B] pt-2">
                  Déjà un compte ?{" "}
                  <Link href="/login" className="font-semibold text-[#6366f1] hover:text-[#8b5cf6] transition-colors">
                    Se connecter
                  </Link>
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}