"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Zap, 
  Crown, 
  Check, 
  Lock,
  Plus,
  ExternalLink,
  RefreshCw,
  Trash2,
  AlertCircle
} from "lucide-react";
import { usePlan } from "@/hooks/usePlan";

const integrations = [
  {
    id: "google-analytics",
    name: "Google Analytics",
    description: "Track website traffic and user behavior",
    icon: "📊",
    connected: false,
    premium: false,
  },
  {
    id: "meta-ads",
    name: "Meta Ads",
    description: "Manage Facebook and Instagram campaigns",
    icon: "📘",
    connected: false,
    premium: false,
  },
  {
    id: "google-ads",
    name: "Google Ads",
    description: "Run search and display campaigns",
    icon: "",
    connected: false,
    premium: false,
  },
  {
    id: "tiktok-ads",
    name: "TikTok Ads",
    description: "Reach Gen Z with viral content",
    icon: "🎵",
    connected: false,
    premium: true,
  },
  {
    id: "linkedin-ads",
    name: "LinkedIn Ads",
    description: "B2B targeting and lead generation",
    icon: "💼",
    connected: false,
    premium: true,
  },
  {
    id: "shopify",
    name: "Shopify",
    description: "Sync products and sales data",
    icon: "🛍️",
    connected: false,
    premium: true,
  },
];

export default function IntegrationsPage() {
  const { isPremium } = usePlan();
  const [connectedApps, setConnectedApps] = useState<string[]>([]);

  const toggleConnection = (id: string, premium: boolean) => {
    if (premium && !isPremium) return;
    setConnectedApps(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Integrations</h1>
        <p className="text-slate-400 mt-1">Connect your marketing tools and platforms</p>
      </div>

      {/* Premium Banner */}
      {!isPremium && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-[#6366f1]/30 bg-gradient-to-br from-[#6366f1]/10 to-[#8b5cf6]/5 p-6"
        >
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center flex-shrink-0">
              <Crown className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white mb-1">Unlock Premium Integrations</h3>
              <p className="text-sm text-slate-400">
                Connect TikTok Ads, LinkedIn Ads, Shopify and more with Premium
              </p>
            </div>
            <button className="rounded-xl bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] px-6 py-2.5 text-sm font-bold text-white hover:shadow-lg hover:shadow-[#8b5cf6]/30 transition-all">
              Upgrade
            </button>
          </div>
        </motion.div>
      )}

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {integrations.map((integration, index) => {
          const isConnected = connectedApps.includes(integration.id);
          const isLocked = integration.premium && !isPremium;

          return (
            <motion.div
              key={integration.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`relative rounded-2xl border ${
                isConnected 
                  ? "border-emerald-500/30 bg-emerald-500/5" 
                  : "border-white/10 bg-[#0f0f1a]"
              } p-6 transition-all hover:border-white/20`}
            >
              {integration.premium && (
                <div className="absolute top-4 right-4">
                  <span className="rounded-full bg-gradient-to-r from-[#6366f1]/20 to-[#8b5cf6]/20 border border-[#6366f1]/30 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#a78bfa]">
                    Premium
                  </span>
                </div>
              )}

              <div className="flex items-start gap-4 mb-4">
                <div className="text-4xl">{integration.icon}</div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white">{integration.name}</h3>
                  <p className="text-sm text-slate-400 mt-1">{integration.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {isConnected ? (
                  <>
                    <button
                      onClick={() => toggleConnection(integration.id, integration.premium)}
                      className="flex-1 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-500/20 transition-all flex items-center justify-center gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      Disconnect
                    </button>
                    <button className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-slate-400 hover:text-white transition-all">
                      <RefreshCw className="h-4 w-4" />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => toggleConnection(integration.id, integration.premium)}
                    disabled={isLocked}
                    className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                      isLocked
                        ? "bg-white/5 text-slate-500 cursor-not-allowed"
                        : "bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white hover:shadow-lg hover:shadow-[#8b5cf6]/30"
                    }`}
                  >
                    {isLocked ? (
                      <>
                        <Lock className="h-4 w-4" />
                        Locked
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4" />
                        Connect
                      </>
                    )}
                  </button>
                )}
              </div>

              {isConnected && (
                <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-2 text-xs text-emerald-400">
                  <Check className="h-4 w-4" />
                  <span>Connected and syncing</span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}