"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import Link from "next/link";
import { motion } from "framer-motion";
import AuthVisualPanel from "@/components/AuthVisualPanel";

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [shakeField, setShakeField] = useState("");

  // Indicateur de force du mot de passe
  const getPasswordStrength = (pwd: string) => {
    if (pwd.length === 0) return { strength: 0, label: "", color: "" };
    if (pwd.length < 6) return { strength: 25, label: "Weak", color: "bg-red-500" };
    if (pwd.length < 10) return { strength: 50, label: "Fair", color: "bg-amber-500" };
    if (pwd.length < 14) return { strength: 75, label: "Good", color: "bg-blue-500" };
    return { strength: 100, label: "Strong", color: "bg-emerald-500" };
  };

  const passwordStrength = getPasswordStrength(password);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setShakeField("");

    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      setShakeField("email");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      setShakeField("password");
      setLoading(false);
      return;
    }

    const supabase = createClient();

    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name,
          onboarding_completed: false,
        },
      },
    });

    if (authError) {
      setError(authError.message);
      setShakeField("password");
      setLoading(false);
    } else {
      if (data.user) {
        fetch("/api/send-welcome", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email,
            name: name || "Utilisateur",
          }),
        }).catch((err) => console.error("Erreur email bienvenue:", err));
      }

      router.push("/dashboard");
    }
  };

  return (
    <main className="flex min-h-screen bg-[#080810]">
      <AuthVisualPanel variant="signup" />
      <div className="flex w-full lg:w-[45%] items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="w-full max-w-md space-y-8"
        >
          {/* En-tête mobile */}
          <div className="lg:hidden text-center mb-8">
            <Link href="/" className="inline-flex items-center">
              <span className="text-2xl font-bold text-white tracking-tight">Make</span>
              <span className="bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#38bdf8] bg-clip-text text-2xl font-bold text-transparent tracking-tight">
                ItAds
              </span>
            </Link>
          </div>

          <div>
            <h1 className="text-4xl font-bold tracking-tight text-white">Create your account</h1>
            <p className="mt-3 text-base text-slate-400">Start generating AI-powered strategies in minutes</p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSignup} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-[0.28em] text-slate-400 mb-2">
                Full name
              </label>
              <motion.input
                animate={shakeField === "name" ? { x: [0, -10, 10, -5, 5, 0] } : {}}
                transition={{ duration: 0.4 }}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="John Doe"
                className="w-full rounded-2xl border border-white/10 bg-[#080810] px-5 py-4 text-sm text-white outline-none transition-all focus:border-[#6366f1] focus:ring-4 focus:ring-[#6366f1]/20 placeholder:text-slate-600"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-[0.28em] text-slate-400 mb-2">
                Email address
              </label>
              <motion.input
                animate={shakeField === "email" ? { x: [0, -10, 10, -5, 5, 0] } : {}}
                transition={{ duration: 0.4 }}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full rounded-2xl border border-white/10 bg-[#080810] px-5 py-4 text-sm text-white outline-none transition-all focus:border-[#6366f1] focus:ring-4 focus:ring-[#6366f1]/20 placeholder:text-slate-600"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-[0.28em] text-slate-400 mb-2">
                Password
              </label>
              <div className="relative">
                <motion.input
                  animate={shakeField === "password" ? { x: [0, -10, 10, -5, 5, 0] } : {}}
                  transition={{ duration: 0.4 }}
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="••••••••"
                  className="w-full rounded-2xl border border-white/10 bg-[#080810] px-5 py-4 pr-12 text-sm text-white outline-none transition-all focus:border-[#6366f1] focus:ring-4 focus:ring-[#6366f1]/20 placeholder:text-slate-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              
              {/* Indicateur de force du mot de passe */}
              {password.length > 0 && (
                <div className="mt-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${passwordStrength.strength}%` }}
                        transition={{ duration: 0.3 }}
                        className={`h-full ${passwordStrength.color}`}
                      />
                    </div>
                    <span className={`text-xs font-semibold ${
                      passwordStrength.strength <= 25 ? "text-red-400" :
                      passwordStrength.strength <= 50 ? "text-amber-400" :
                      passwordStrength.strength <= 75 ? "text-blue-400" :
                      "text-emerald-400"
                    }`}>
                      {passwordStrength.label}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Bouton principal */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] py-4 text-sm font-bold text-white shadow-[0_20px_60px_rgba(99,102,241,0.3)] transition-all hover:shadow-[0_25px_80px_rgba(139,92,246,0.4)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span className="relative z-10">
                {loading ? "Creating account..." : "Create account"}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#8b5cf6] to-[#38bdf8] opacity-0 transition-opacity group-hover:opacity-100" />
            </motion.button>
          </form>

          {/* Lien vers login */}
          <p className="text-center text-sm text-slate-400">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-[#8b5cf6] transition-colors hover:text-[#a78bfa]">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </main>
  );
}