"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, ArrowRight, CheckCircle2, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase";
import { AuthInput } from "@/components/auth/AuthInput";
import AuthButton from "@/components/auth/AuthButton";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError("Email ou mot de passe incorrect. Veuillez réessayer.");
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch (err) {
      setError("Une erreur inattendue est survenue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row">
      
      {/* COLONNE GAUCHE - Value proposition (Visible uniquement sur PC) */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 flex-col justify-between p-12 xl:p-20 relative overflow-hidden bg-gradient-to-br from-[#FAFAFC] to-white">
        {/* Élément décoratif d'arrière-plan */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#6366f1]/5 rounded-full blur-[120px] -translate-y-1/3 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#8b5cf6]/5 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3 pointer-events-none" />

        <div className="relative z-10">
          {/* Logo Texte Uniquement */}
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
            Transformez vos idées en{" "}
            <span className="bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] bg-clip-text text-transparent">
              stratégies publicitaires rentables
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-[#475569] mb-12 max-w-lg leading-relaxed"
          >
            Rejoignez les entrepreneurs en Afrique qui arrêtent de gaspiller leur budget et commencent à convertir avec des stratégies IA calibrées pour leur marché.
          </motion.p>

          {/* Bloc de preuve sociale avec petites images */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-sm max-w-md"
          >
            <div className="flex -space-x-3">
              <Image
                src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=80&h=80&fit=crop&crop=face"
                alt="Utilisateur"
                width={40}
                height={40}
                className="w-10 h-10 rounded-full border-2 border-white object-cover"
              />
              <Image
                src="https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=80&h=80&fit=crop&crop=face"
                alt="Utilisateur"
                width={40}
                height={40}
                className="w-10 h-10 rounded-full border-2 border-white object-cover"
              />
              <Image
                src="https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=80&h=80&fit=crop&crop=face"
                alt="Utilisateur"
                width={40}
                height={40}
                className="w-10 h-10 rounded-full border-2 border-white object-cover"
              />
              <Image
                src="https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=80&h=80&fit=crop&crop=face"
                alt="Utilisateur"
                width={40}
                height={40}
                className="w-10 h-10 rounded-full border-2 border-white object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-1 mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-[#FBBF24] text-[#FBBF24]" />
                ))}
                <span className="text-xs font-bold text-[#0F172A] ml-1">4.9/5</span>
              </div>
              <p className="text-xs text-[#64748B]">+500 entrepreneurs en Afrique nous font confiance</p>
            </div>
          </motion.div>
        </div>

        {/* Footer gauche */}
        <div className="relative z-10 mt-12">
          <p className="text-xs text-[#94A3B8]">
            © 2025 MakeItAds. Tous droits réservés.
          </p>
        </div>
      </div>

      {/* COLONNE DROITE - Formulaire */}
      <div className="w-full lg:w-1/2 xl:w-2/5 flex items-center justify-center p-6 sm:p-12 bg-white">
        <div className="w-full max-w-md">
          {/* Logo Mobile (Texte Uniquement) */}
          <div className="lg:hidden flex justify-center mb-8">
            <span className="text-2xl font-bold tracking-tight">
              <span className="text-[#0F172A]">MakeIt</span>
              <span className="text-[#6366f1]">Ads</span>
            </span>
          </div>

          {/* Header Formulaire */}
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] mb-2 tracking-tight">Bon retour parmi nous</h2>
            <p className="text-[#64748B]">Connectez-vous pour accéder à vos stratégies et gérer vos crédits.</p>
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
                <p className="text-[#0F172A] font-semibold text-lg">Connexion réussie !</p>
                <p className="text-sm text-[#64748B] mt-1">Redirection vers votre tableau de bord...</p>
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
                <AuthInput
                  type="email"
                  icon={Mail}
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />

                <div className="relative">
                  <AuthInput
                    type={showPassword ? "text" : "password"}
                    icon={Lock}
                    placeholder="Votre mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#6366f1] transition-colors p-1"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>

                <div className="flex justify-end">
                  <Link href="/reset-password" className="text-sm text-[#6366f1] hover:text-[#8b5cf6] transition-colors font-medium">
                    Mot de passe oublié ?
                  </Link>
                </div>

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

                <AuthButton type="submit" loading={loading} className="w-full py-3.5 text-base font-semibold">
                  Se connecter <ArrowRight className="h-4 w-4 ml-2" />
                </AuthButton>

                <p className="text-center text-sm text-[#64748B] pt-2">
                  Pas encore de compte ?{" "}
                  <Link href="/register" className="font-semibold text-[#6366f1] hover:text-[#8b5cf6] transition-colors">
                    Créer un compte
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