"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, ArrowRight, TrendingUp, Users, Zap } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { AuthInput } from "@/components/auth/AuthInput";
import AuthButton from "@/components/auth/AuthButton";
import SocialLogin from "@/components/auth/SocialLogin";

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
        setError(error.message);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
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
          {/* Logo */}
          <div className="flex items-center gap-2 mb-12">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <span className="text-xl font-bold text-[#0F172A]">
              Make<span className="text-[#6366f1]">ItAds</span>
            </span>
          </div>

          {/* Headline */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl xl:text-5xl font-bold text-[#0F172A] leading-tight mb-6"
          >
            Turn your business into a{" "}
            <span className="bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] bg-clip-text text-transparent">
              marketing machine
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-[#475569] mb-12 max-w-lg"
          >
            Join thousands of businesses generating AI-powered marketing strategies that actually convert.
          </motion.p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mb-12">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
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
              transition={{ delay: 0.3 }}
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
              transition={{ delay: 0.4 }}
              className="p-4 rounded-2xl bg-white border border-[#E5E7EB] shadow-sm"
            >
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-5 w-5 text-[#38bdf8]" />
                <span className="text-2xl font-bold text-[#0F172A]">3 min</span>
              </div>
              <p className="text-xs text-[#64748B]">Avg. setup time</p>
            </motion.div>
          </div>

          {/* Trust badge */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
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

        {/* Demo preview */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="rounded-2xl bg-white border border-[#E5E7EB] p-6 shadow-xl"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <div className="w-3 h-3 rounded-full bg-emerald-400" />
            </div>
            <div className="flex-1 text-center text-xs text-[#64748B]">MakeItAds Dashboard</div>
          </div>
          <div className="space-y-3">
            <div className="h-20 rounded-xl bg-gradient-to-r from-[#6366f1]/10 to-[#8b5cf6]/10 border border-[#6366f1]/20 p-4">
              <div className="h-3 w-32 bg-[#6366f1]/30 rounded mb-2" />
              <div className="h-2 w-full bg-[#6366f1]/20 rounded" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="h-16 rounded-lg bg-[#F8FAFC] border border-[#E5E7EB]" />
              <div className="h-16 rounded-lg bg-[#F8FAFC] border border-[#E5E7EB]" />
              <div className="h-16 rounded-lg bg-[#F8FAFC] border border-[#E5E7EB]" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* COLONNE DROITE - Formulaire */}
      <div className="w-full lg:w-1/2 xl:w-2/5 flex items-center justify-center p-6 sm:p-12">
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
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] mb-2">Welcome back</h2>
            <p className="text-[#64748B]">Sign in to your account to continue</p>
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
                <p className="text-[#0F172A] font-semibold">Login successful!</p>
                <p className="text-sm text-[#64748B] mt-1">Redirecting to dashboard...</p>
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
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
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

                <div className="flex justify-end">
                  <Link href="/reset-password" className="text-xs text-[#6366f1] hover:text-[#8b5cf6] transition-colors font-medium">
                    Forgot password?
                  </Link>
                </div>

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
                  Sign in <ArrowRight className="h-4 w-4 ml-2" />
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
                  Don't have an account?{" "}
                  <Link href="/register" className="font-medium text-[#6366f1] hover:text-[#8b5cf6] transition-colors">
                    Create account
                  </Link>
                </p>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Mobile stats */}
          <div className="lg:hidden mt-8 grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-xl font-bold text-[#6366f1]">+340%</div>
              <div className="text-xs text-[#64748B]">Avg. ROAS</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-[#8b5cf6]">10k+</div>
              <div className="text-xs text-[#64748B]">Users</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-[#38bdf8]">3 min</div>
              <div className="text-xs text-[#64748B]">Setup</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}