"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { User, Mail, Bell, Lock, Save, Check, Shield, Globe, Loader2, Crown, Zap, Key, Trash2, AlertTriangle, Monitor, LogOut, Camera } from "lucide-react";
import { createClient } from "@/lib/supabase";
import { usePlan } from "@/hooks/usePlan";
import { usePermissions } from "@/hooks/usePermissions";
import { useUsage } from "@/hooks/useUsage";
import { useRouter } from "next/navigation";
import PageTransition from "@/components/ui/PageTransition";

const supabase = createClient();

// ═══════════════════════════════════════════════════════════
// TOGGLE COMPONENT - RESPONSIVE
// ═══════════════════════════════════════════════════════════
const Toggle = ({ enabled, onChange, label, description }: { enabled: boolean; onChange: (val: boolean) => void; label: string; description: string }) => (
  <div className="flex items-center justify-between gap-3 py-3 sm:py-4 border-b border-white/5 last:border-0">
    <div className="flex-1 min-w-0 pr-2">
      <p className="text-xs sm:text-sm font-medium text-white break-words">{label}</p>
      <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5 break-words">{description}</p>
    </div>
    <button 
      type="button" 
      onClick={() => onChange(!enabled)} 
      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${enabled ? "bg-[#6366f1]" : "bg-white/10"}`}
    >
      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${enabled ? "translate-x-5" : "translate-x-0"}`} />
    </button>
  </div>
);

export default function SettingsPage() {
  const router = useRouter();
  const { isFree, isPro, isPremium, isEnterprise, loading: planLoading } = usePlan();
  const { isPremium: hasPremium, isEnterprise: hasEnterprise, canAccessAPI } = usePermissions();
  const { usage: usageData } = useUsage();
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [marketingSubscribed, setMarketingSubscribed] = useState(true);
  const [productUpdates, setProductUpdates] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(false);
  const [language, setLanguage] = useState("en");
  const [theme, setTheme] = useState("dark");
  const [timezone, setTimezone] = useState("UTC");

  const currentPlan = isEnterprise ? "enterprise" : isPremium ? "premium" : isPro ? "pro" : "free";
  const strategiesUsed = usageData?.strategiesUsed || 0;
  const strategiesLimit = usageData?.strategiesLimit || 1;

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setFirstName(user.user_metadata?.first_name || "");
        setEmail(user.email || "");
        setMarketingSubscribed(user.user_metadata?.subscribed_marketing ?? true);
        setProductUpdates(user.user_metadata?.product_updates ?? true);
        setWeeklyReport(user.user_metadata?.weekly_report ?? false);
        setLanguage(user.user_metadata?.language || "en");
        setTheme(user.user_metadata?.theme || "dark");
        setTimezone(user.user_metadata?.timezone || "UTC");
      }
    };
    getUser();
  }, []);

  const handleSave = async () => {
    setLoading(true); 
    setSaved(false);
    const { error } = await supabase.auth.updateUser({ 
      data: { 
        first_name: firstName, 
        subscribed_marketing: marketingSubscribed, 
        product_updates: productUpdates, 
        weekly_report: weeklyReport, 
        language, 
        theme, 
        timezone 
      } 
    });
    if (!error) { 
      setSaved(true); 
      setTimeout(() => setSaved(false), 3000); 
    }
    setLoading(false);
  };

  const handleDeleteAccount = async () => {
    if (!confirm("⚠️ Are you sure you want to delete your account? This action cannot be undone.")) return;
    if (!confirm("⚠️ FINAL WARNING: All your data will be permanently deleted. Continue?")) return;
    alert("Account deletion feature coming soon. Please contact support.");
  };

  const handleLogout = async () => { 
    await supabase.auth.signOut(); 
    router.push("/login"); 
  };

  if (planLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-[#6366f1]" />
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="max-w-6xl mx-auto space-y-5 sm:space-y-6 lg:space-y-8">
        
        {/* ═══════════════════════════════════════════════════════════
            HEADER RESPONSIVE
            ═══════════════════════════════════════════════════════════ */}
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-gradient-to-br from-slate-500 to-slate-600 flex items-center justify-center">
            <User className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white no-hyphens">Settings</h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5 sm:mt-1">
              Manage your profile and preferences
            </p>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════
            MAIN GRID - 1 colonne mobile, 3 desktop
            ═══════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
          
          {/* ═══════════════════════════════════════════════════════
              LEFT COLUMN - Main content
              ═══════════════════════════════════════════════════════ */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            
            {/* PROFILE INFORMATION */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="rounded-xl sm:rounded-2xl border border-white/[0.06] bg-[#0f0f1a] p-4 sm:p-6"
            >
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg sm:rounded-xl bg-gradient-to-br from-[#6366f1] to-[#8b5cf6]">
                  <User className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
                <h2 className="text-base sm:text-lg font-bold text-white">Profile Information</h2>
              </div>
              
              <div className="space-y-4">
                {/* Avatar section - empilé sur mobile */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 pb-4 border-b border-white/5">
                  <div 
                    className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] text-lg sm:text-xl font-bold text-white shadow-lg relative group cursor-pointer flex-shrink-0" 
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {firstName ? firstName.charAt(0).toUpperCase() : "U"}
                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                  </div>
                  <input 
                    ref={fileInputRef} 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={(e) => alert("Photo upload will be available once storage is configured.")} 
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white">Profile Picture</p>
                    <p className="text-xs text-slate-400">JPG, GIF or PNG. Max size 2MB.</p>
                    <button 
                      onClick={() => fileInputRef.current?.click()} 
                      className="mt-1 sm:mt-2 text-xs font-medium text-[#8b5cf6] hover:text-[#a78bfa] transition-colors"
                    >
                      Upload new picture
                    </button>
                  </div>
                </div>
                
                {/* Inputs - 1 colonne mobile, 2 desktop */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-[10px] sm:text-xs font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-slate-400 mb-1.5 sm:mb-2">First Name</label>
                    <input 
                      type="text" 
                      value={firstName} 
                      onChange={(e) => setFirstName(e.target.value)} 
                      className="w-full h-10 sm:h-12 rounded-lg sm:rounded-xl border border-white/10 bg-[#080810] px-3 sm:px-4 text-sm text-white outline-none transition-all focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/20" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] sm:text-xs font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-slate-400 mb-1.5 sm:mb-2">Email Address</label>
                    <input 
                      type="email" 
                      value={email} 
                      disabled 
                      className="w-full h-10 sm:h-12 rounded-lg sm:rounded-xl border border-white/5 bg-white/[0.02] px-3 sm:px-4 text-sm text-slate-500 outline-none cursor-not-allowed" 
                    />
                    <p className="text-[9px] sm:text-[10px] text-slate-500 mt-1">Contact support to change your email.</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* NOTIFICATIONS & PREFERENCES */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.1 }} 
              className="rounded-xl sm:rounded-2xl border border-white/[0.06] bg-[#0f0f1a] p-4 sm:p-6"
            >
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg sm:rounded-xl bg-gradient-to-br from-emerald-500 to-green-500">
                  <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
                <h2 className="text-base sm:text-lg font-bold text-white">Notifications</h2>
              </div>
              <div className="divide-y divide-white/5">
                <Toggle enabled={marketingSubscribed} onChange={setMarketingSubscribed} label="Marketing Emails" description="Receive tips and product updates from MakeItAds." />
                <Toggle enabled={productUpdates} onChange={setProductUpdates} label="Product Updates" description="Get notified about new features." />
                <Toggle enabled={weeklyReport} onChange={setWeeklyReport} label="Weekly Strategy Report" description="Receive a weekly summary of your performance." />
              </div>
            </motion.div>

            {/* PREFERENCES */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.2 }} 
              className="rounded-xl sm:rounded-2xl border border-white/[0.06] bg-[#0f0f1a] p-4 sm:p-6"
            >
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg sm:rounded-xl bg-gradient-to-br from-[#38bdf8] to-blue-500">
                  <Globe className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
                <h2 className="text-base sm:text-lg font-bold text-white">Preferences</h2>
              </div>
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-[10px] sm:text-xs font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-slate-400 mb-1.5 sm:mb-2">Language</label>
                  <select 
                    value={language} 
                    onChange={(e) => setLanguage(e.target.value)} 
                    className="w-full h-10 sm:h-12 rounded-lg sm:rounded-xl border border-white/10 bg-[#080810] px-3 sm:px-4 text-sm text-white outline-none transition-all focus:border-[#6366f1]"
                  >
                    <option value="en">English</option>
                    <option value="fr">Français</option>
                    <option value="es">Español</option>
                    <option value="de">Deutsch</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-[10px] sm:text-xs font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-slate-400 mb-1.5 sm:mb-2">Theme</label>
                  <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                    {["dark", "light", "system"].map((t) => (
                      <button 
                        key={t} 
                        onClick={() => setTheme(t)} 
                        className={`rounded-lg border px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-all active:scale-95 ${
                          theme === t 
                            ? "border-[#6366f1] bg-[#6366f1]/10 text-white" 
                            : "border-white/10 bg-white/[0.02] text-slate-400 hover:border-white/30"
                        }`}
                      >
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-[10px] sm:text-xs font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-slate-400 mb-1.5 sm:mb-2">Timezone</label>
                  <select 
                    value={timezone} 
                    onChange={(e) => setTimezone(e.target.value)} 
                    className="w-full h-10 sm:h-12 rounded-lg sm:rounded-xl border border-white/10 bg-[#080810] px-3 sm:px-4 text-sm text-white outline-none transition-all focus:border-[#6366f1]"
                  >
                    <option value="UTC">UTC (Coordinated Universal Time)</option>
                    <option value="America/New_York">Eastern Time (ET)</option>
                    <option value="America/Chicago">Central Time (CT)</option>
                    <option value="America/Denver">Mountain Time (MT)</option>
                    <option value="America/Los_Angeles">Pacific Time (PT)</option>
                    <option value="Europe/London">London (GMT)</option>
                    <option value="Europe/Paris">Paris (CET)</option>
                    <option value="Europe/Berlin">Berlin (CET)</option>
                    <option value="Asia/Tokyo">Tokyo (JST)</option>
                    <option value="Asia/Shanghai">Shanghai (CST)</option>
                    <option value="Australia/Sydney">Sydney (AEST)</option>
                  </select>
                </div>
              </div>
            </motion.div>

            {/* SECURITY */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.3 }} 
              className="rounded-xl sm:rounded-2xl border border-white/[0.06] bg-[#0f0f1a] p-4 sm:p-6"
            >
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg sm:rounded-xl bg-gradient-to-br from-amber-500 to-orange-500">
                  <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
                <h2 className="text-base sm:text-lg font-bold text-white">Security</h2>
              </div>
              <div className="space-y-3 sm:space-y-4">
                {/* Password */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 py-2">
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-white">Password</p>
                    <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5">Last changed 3 months ago</p>
                  </div>
                  <button 
                    onClick={() => alert("Password change feature will be available via Supabase Auth UI soon.")} 
                    className="rounded-lg border border-white/10 bg-white/[0.03] px-3 sm:px-4 py-2 text-[10px] sm:text-xs font-semibold text-slate-300 hover:bg-white/[0.06] hover:text-white transition-all active:scale-95 self-start sm:self-auto"
                  >
                    Change Password
                  </button>
                </div>
                
                {/* 2FA */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 py-3 sm:py-4 border-t border-white/5">
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-white">Two-Factor Authentication</p>
                    <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5">Add an extra layer of security</p>
                  </div>
                  <button 
                    onClick={() => alert("2FA feature will be available via Supabase Auth UI soon.")} 
                    className="rounded-lg border border-white/10 bg-white/[0.03] px-3 sm:px-4 py-2 text-[10px] sm:text-xs font-semibold text-slate-300 hover:bg-white/[0.06] hover:text-white transition-all active:scale-95 self-start sm:self-auto"
                  >
                    Enable 2FA
                  </button>
                </div>
                
                {/* Active Sessions */}
                <div className="pt-3 sm:pt-4 border-t border-white/5">
                  <p className="text-xs sm:text-sm font-medium text-white mb-2 sm:mb-3">Active Sessions</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2 p-2 sm:p-3 rounded-lg bg-white/[0.02] border border-white/5">
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                        <Monitor className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-400 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-[10px] sm:text-xs font-medium text-white truncate">Current Session</p>
                          <p className="text-[9px] sm:text-[10px] text-slate-500">Web • {new Date().toLocaleDateString()}</p>
                        </div>
                      </div>
                      <span className="text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-bold flex-shrink-0">Active</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* API & INTEGRATIONS */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.4 }} 
              className="rounded-xl sm:rounded-2xl border border-white/[0.06] bg-[#0f0f1a] p-4 sm:p-6 relative overflow-hidden"
            >
              {!canAccessAPI && (
                <div className="absolute inset-0 backdrop-blur-sm bg-[#0f0f1a]/70 flex items-center justify-center z-10 p-4">
                  <div className="text-center">
                    <Lock className="h-7 w-7 sm:h-8 sm:w-8 text-[#8b5cf6] mx-auto mb-2" />
                    <p className="text-xs sm:text-sm font-semibold text-white mb-2">Premium Feature</p>
                    <button 
                      onClick={() => router.push("/dashboard/billing")} 
                      className="rounded-lg bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] px-4 py-1.5 text-xs font-bold text-white hover:scale-105 transition-transform active:scale-95"
                    >
                      Upgrade to Premium
                    </button>
                  </div>
                </div>
              )}
              <div className={!canAccessAPI ? "blur-sm" : ""}>
                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 flex-wrap">
                  <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg sm:rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
                    <Key className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                  <h2 className="text-base sm:text-lg font-bold text-white">API & Integrations</h2>
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#6366f1]/20 text-[#a5b4fc] font-bold">PREMIUM</span>
                </div>
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="block text-[10px] sm:text-xs font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-slate-400 mb-1.5 sm:mb-2">API Key</label>
                    <div className="flex gap-2">
                      <input 
                        type="password" 
                        value="sk-xxxxxxxxxxxxxxxxxxxx" 
                        disabled 
                        className="flex-1 h-10 sm:h-12 rounded-lg sm:rounded-xl border border-white/10 bg-[#080810] px-3 sm:px-4 text-sm text-slate-500 outline-none cursor-not-allowed" 
                      />
                      <button 
                        onClick={() => alert("API key regeneration will be available soon.")} 
                        className="rounded-lg border border-white/10 bg-white/[0.03] px-3 sm:px-4 py-2 text-[10px] sm:text-xs font-semibold text-slate-300 hover:bg-white/[0.06] hover:text-white transition-all active:scale-95 flex-shrink-0"
                      >
                        Regenerate
                      </button>
                    </div>
                    <p className="text-[9px] sm:text-[10px] text-slate-500 mt-1">Use this key to access the MakeItAds API</p>
                  </div>
                  <div>
                    <label className="block text-[10px] sm:text-xs font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-slate-400 mb-1.5 sm:mb-2">Webhook URL</label>
                    <input 
                      type="url" 
                      placeholder="https://your-domain.com/webhook" 
                      className="w-full h-10 sm:h-12 rounded-lg sm:rounded-xl border border-white/10 bg-[#080810] px-3 sm:px-4 text-sm text-white outline-none transition-all focus:border-[#6366f1]" 
                    />
                    <p className="text-[9px] sm:text-[10px] text-slate-500 mt-1">Receive real-time notifications</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* DANGER ZONE */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.5 }} 
              className="rounded-xl sm:rounded-2xl border border-red-500/20 bg-red-500/5 p-4 sm:p-6"
            >
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg sm:rounded-xl bg-red-500/20">
                  <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-red-400" />
                </div>
                <h2 className="text-base sm:text-lg font-bold text-white">Danger Zone</h2>
              </div>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-white">Log out of all devices</p>
                    <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5">This will log you out from all active sessions</p>
                  </div>
                  <button 
                    onClick={handleLogout} 
                    className="rounded-lg border border-white/10 bg-white/[0.03] px-3 sm:px-4 py-2 text-[10px] sm:text-xs font-semibold text-slate-300 hover:bg-white/[0.06] hover:text-white transition-all flex items-center gap-1.5 sm:gap-2 active:scale-95 self-start sm:self-auto"
                  >
                    <LogOut className="h-3 w-3" />
                    <span>Log Out</span>
                  </button>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 pt-3 sm:pt-4 border-t border-white/5">
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-white">Delete Account</p>
                    <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5">Permanently delete your account and all data</p>
                  </div>
                  <button 
                    onClick={handleDeleteAccount} 
                    className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 sm:px-4 py-2 text-[10px] sm:text-xs font-semibold text-red-400 hover:bg-red-500/20 transition-all flex items-center gap-1.5 sm:gap-2 active:scale-95 self-start sm:self-auto"
                  >
                    <Trash2 className="h-3 w-3" />
                    <span>Delete Account</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* ═══════════════════════════════════════════════════════
              RIGHT COLUMN - Sidebar (devient bottom sur mobile)
              ═══════════════════════════════════════════════════════ */}
          <div className="space-y-4 sm:space-y-6">
            
            {/* SAVE CHANGES - Non-sticky sur mobile */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.3 }} 
              className="rounded-xl sm:rounded-2xl sm:sticky sm:top-24 border border-white/[0.06] bg-[#0f0f1a] p-4 sm:p-6"
            >
              <h3 className="text-xs sm:text-sm font-bold text-white mb-1 sm:mb-2">Save Changes</h3>
              <p className="text-[10px] sm:text-xs text-slate-400 mb-4 sm:mb-6">
                Make sure to save your preferences.
              </p>
              <button 
                onClick={handleSave} 
                disabled={loading} 
                className="group relative w-full flex items-center justify-center gap-2 rounded-lg sm:rounded-xl bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-white shadow-lg shadow-[#6366f1]/25 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-[#8b5cf6]/40 disabled:opacity-70 active:scale-[0.98]"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : saved ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span>Saved Successfully</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
              {saved && (
                <motion.p 
                  initial={{ opacity: 0, y: 5 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  className="text-center text-[10px] sm:text-xs text-emerald-400 mt-2 sm:mt-3"
                >
                  Your preferences have been updated.
                </motion.p>
              )}
            </motion.div>

            {/* CURRENT PLAN */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.4 }} 
              className="rounded-xl sm:rounded-2xl border border-white/[0.06] bg-gradient-to-br from-[#6366f1]/10 to-[#8b5cf6]/5 p-4 sm:p-6"
            >
              <div className="flex items-center gap-2 mb-2 sm:mb-3">
                {isEnterprise ? (
                  <Crown className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-400" />
                ) : isPremium ? (
                  <Crown className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#a78bfa]" />
                ) : isPro ? (
                  <Zap className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#a78bfa]" />
                ) : null}
                <h3 className="text-xs sm:text-sm font-bold text-white">Current Plan</h3>
              </div>
              <p className="text-xl sm:text-2xl font-bold text-white mb-1 capitalize">{currentPlan}</p>
              <p className="text-[10px] sm:text-xs text-slate-400 mb-3 sm:mb-4">
                {isFree 
                  ? "Limited features. Upgrade anytime." 
                  : isEnterprise 
                  ? "All features unlocked. Full access." 
                  : "All features unlocked."}
              </p>
              <div className="space-y-1.5 sm:space-y-2 mb-3 sm:mb-4">
                <div className="flex items-center justify-between text-[10px] sm:text-xs">
                  <span className="text-slate-400">Strategies</span>
                  <span className="text-white font-bold">
                    {strategiesUsed} / {strategiesLimit === 9999 ? "∞" : strategiesLimit}
                  </span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6]" 
                    style={{ width: `${Math.min(100, (strategiesUsed / strategiesLimit) * 100)}%` }} 
                  />
                </div>
              </div>
              {!isEnterprise && (
                <button 
                  onClick={() => router.push("/dashboard/billing")} 
                  className="w-full rounded-lg bg-white/10 border border-white/10 py-2 text-[10px] sm:text-xs font-semibold text-white hover:bg-white/20 transition-colors active:scale-95"
                >
                  {isFree ? "Upgrade Plan" : "Manage Plan"}
                </button>
              )}
            </motion.div>

            {/* QUICK LINKS */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.5 }} 
              className="rounded-xl sm:rounded-2xl border border-white/[0.06] bg-[#0f0f1a] p-4 sm:p-6"
            >
              <h3 className="text-xs sm:text-sm font-bold text-white mb-3 sm:mb-4">Quick Links</h3>
              <div className="space-y-1 sm:space-y-2">
                <button 
                  onClick={() => router.push("/dashboard/billing")} 
                  className="w-full text-left rounded-lg px-2 sm:px-3 py-2 text-[10px] sm:text-xs text-slate-400 hover:bg-white/[0.03] hover:text-white transition-all active:scale-95"
                >
                  Billing & Plans →
                </button>
                <button 
                  onClick={() => router.push("/dashboard/strategies/new")} 
                  className="w-full text-left rounded-lg px-2 sm:px-3 py-2 text-[10px] sm:text-xs text-slate-400 hover:bg-white/[0.03] hover:text-white transition-all active:scale-95"
                >
                  Business Profile →
                </button>
                <a 
                  href="mailto:contact@makeitads.pro" 
                  className="w-full text-left rounded-lg px-2 sm:px-3 py-2 text-[10px] sm:text-xs text-slate-400 hover:bg-white/[0.03] hover:text-white transition-all block active:scale-95"
                >
                  Contact Support →
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}