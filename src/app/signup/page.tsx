"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, ArrowRight, TrendingUp, Users, Zap, Check } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { AuthInput } from "@/components/auth/AuthInput";
import AuthButton from "@/components/auth/AuthButton";
import SocialLogin from "@/components/auth/SocialLogin";

export default function SignupPage() {
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
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (!acceptTerms) {
      setError("Please accept the terms and conditions");
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
      }, 2000);
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAFAFC] via-white to-[#F8FAFC] flex">
      {/* COLONNE GAUCHE - Value proposition */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 flex-col justify-between p-12 xl:p-20">
        <div>
          <div className="flex items-center gap-2 mb-12">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <span className="text-xl font-bold text-[#0F172A]">
              Make<span className="text-[#6366f1]">ItAds</span>
            </span>
          </div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl xl:text-5xl font-bold text-[#0F172A] leading-tight mb-6"
          >
            Start your{" "}
            <span className="bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] bg-clip-text text-transparent">
              free trial today
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-[#475569] mb-12 max-w-lg"
          >
            No credit card required. Get instant access to AI-powered marketing strategies.
          </motion.p>

          {/* Features */}
          <div className="space-y-4 mb-12">
            {[
              "Free strategy generation (1/month)",
              "AI-powered competitor analysis",
              "Complete marketing roadmap",
              "Export to PDF & share",
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                  <Check className="h-3 w-3 text-emerald-600" />
                </div>
                <span className="text-[#334155]">{feature}</span>
              </motion.div>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="p-4 rounded-2xl bg-white border border-[#E5E7EB] shadow-sm"
            >
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-[#6366f1]" />
                <span className="text-2xl font-bold text-[#0F172A]">+340%</span>
              </div>
              <p className="text-xs text-[#64748B]">Avg. ROAS increase</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="p-4 rounded-2xl bg-white border border-[#E5E7EB] shadow-sm"
            >
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-5 w-5 text-[#8b5cf6]" />
                <span className="text-2xl font-bold text-[#0F172A]">10k+</span>
              </div>
              <p className="text-xs text-[#64748B]">Active users</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="p-4 rounded-2xl bg-white border border-[#E5E7EB] shadow-sm"
            >
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-5 w-5 text-[#38bdf8]" />
                <span className="text-2xl font-bold text-[#0F172A]">3 min</span>
              </div>
              <p className="text-xs text-[#64748B]">Avg. setup time</p>
            </motion.div>
          </div>
        </div>

        {/* Trust badge */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="flex items-center gap-2 text-sm text-[#64748B]"
        >
          <div className="flex -space-x-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] border-2 border-white flex items-center justify-center">
                <span className="text-white text-xs font-bold">{i}</span>
              </div>
            ))}
          </div>
          <span>Trusted by 10,000+ marketers worldwide</span>
        </motion.div>
      </div>

      {/* COLONNE DROITE - Formulaire */}
      <div className="w-full lg:w-1/2 xl:w-2/5 flex items-center justify-center p-6 sm:p-12 overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <span className="text-xl font-bold text-[#0F172A]">
              Make<span className="text-[#6366f1]">ItAds</span>
            </span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] mb-2">Create your account</h2>
            <p className="text-[#64748B]">Start generating AI-powered marketing strategies in minutes</p>
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
                  <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
                <p className="text-[#0F172A] font-semibold">Account created!</p>
                <p className="text-sm text-[#64748B] mt-1">Check your email to verify your account</p>
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
                  type="text"
                  icon={User}
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoComplete="name"
                />

                <AuthInput
                  type="email"
                  icon={Mail}
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />

                <div className="relative">
                  <AuthInput
                    type={showPassword ? "text" : "password"}
                    icon={Lock}
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#6366f1] transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>

                <div className="relative">
                  <AuthInput
                    type={showConfirmPassword ? "text" : "password"}
                    icon={Lock}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#6366f1] transition-colors"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? (
                      <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>

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
                    I agree to the{" "}
                    <Link href="/terms" className="text-[#6366f1] hover:text-[#8b5cf6] transition-colors font-medium">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-[#6366f1] hover:text-[#8b5cf6] transition-colors font-medium">
                      Privacy Policy
                    </Link>
                  </span>
                </label>

                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="rounded-xl border border-red-500/20 bg-red-50 p-3 text-sm text-red-600"
                    >
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                <AuthButton type="submit" loading={loading}>
                  Create account <ArrowRight className="h-4 w-4 ml-2" />
                </AuthButton>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#E5E7EB]" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-2 bg-white text-[#64748B]">Or continue with</span>
                  </div>
                </div>

                <SocialLogin disabled={loading} />

                <p className="text-center text-sm text-[#64748B]">
                  Already have an account?{" "}
                  <Link href="/login" className="font-medium text-[#6366f1] hover:text-[#8b5cf6] transition-colors">
                    Sign in
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