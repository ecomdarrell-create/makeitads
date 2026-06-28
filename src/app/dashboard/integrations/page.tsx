"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Plug, 
  Lock, 
  Crown, 
  CheckCircle2, 
  Circle, 
  Key, 
  Copy, 
  Check, 
  ExternalLink, 
  Shield,
  RefreshCw,
  Code2,
  BookOpen
} from "lucide-react";
import { usePlan } from "@/hooks/usePlan";

// --- Mock Data ---
const integrations = [
  {
    id: "meta",
    name: "Meta Ads",
    desc: "Connect your Facebook & Instagram ad accounts for direct campaign management.",
    color: "from-blue-600 to-blue-500",
    iconColor: "text-blue-400",
    status: "connected" as const,
    lastSync: "2 hours ago",
  },
  {
    id: "tiktok",
    name: "TikTok Ads",
    desc: "Sync your TikTok for Business account to track performance and optimize.",
    color: "from-pink-600 to-pink-500",
    iconColor: "text-pink-400",
    status: "not_connected" as const,
    lastSync: null,
  },
  {
    id: "google",
    name: "Google Ads",
    desc: "Link your Google Ads account for search & display campaign insights.",
    color: "from-emerald-600 to-emerald-500",
    iconColor: "text-emerald-400",
    status: "connected" as const,
    lastSync: "5 hours ago",
  },
  {
    id: "shopify",
    name: "Shopify",
    desc: "Import your product catalog and sync conversion events automatically.",
    color: "from-green-600 to-green-500",
    iconColor: "text-green-400",
    status: "not_connected" as const,
    lastSync: null,
  },
  {
    id: "zapier",
    name: "Zapier",
    desc: "Automate workflows between MakeItAds and 5,000+ other apps.",
    color: "from-orange-600 to-orange-500",
    iconColor: "text-orange-400",
    status: "not_connected" as const,
    lastSync: null,
  },
];

export default function IntegrationsPage() {
  const plan = usePlan();
  const isPremium = plan?.type === "premium";
  
  const [copied, setCopied] = useState(false);
  const [apiKeys, setApiKeys] = useState([
    { id: "1", name: "Production Key", key: "mk_live_51Hx...k8Qp", created: "Jun 10, 2026", lastUsed: "2 hours ago" },
  ]);

  const handleCopy = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generateNewKey = () => {
    const newKey = `mk_live_${Math.random().toString(36).substring(2, 15)}...${Math.random().toString(36).substring(2, 6)}`;
    setApiKeys([
      ...apiKeys,
      {
        id: Date.now().toString(),
        name: `New Key ${apiKeys.length + 1}`,
        key: newKey,
        created: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        lastUsed: "Never",
      }
    ]);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Integrations</h1>
          <p className="text-slate-400 mt-1">Connect your ad accounts and automate your workflow</p>
        </div>
        {!isPremium && (
          <button className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] px-4 py-2 text-sm font-bold text-white shadow-lg shadow-[#6366f1]/30 hover:scale-105 transition-transform">
            <Crown className="h-4 w-4" />
            Upgrade to Premium
          </button>
        )}
      </div>

      {/* Main Content Area */}
      <div className="relative rounded-2xl border border-white/[0.06] bg-[#0f0f1a] p-8 overflow-hidden">
        
        {/* Gating Overlay for Free/Pro Users */}
        {!isPremium && (
          <div className="absolute inset-0 z-20 flex items-center justify-center rounded-2xl bg-[#0f0f1a]/70 backdrop-blur-md">
            <div className="text-center px-4 max-w-md">
              <Plug className="h-10 w-10 text-slate-400 mx-auto mb-3" />
              <p className="text-lg font-bold text-white mb-2">Custom API access is a Premium feature</p>
              <p className="text-sm text-slate-400 mb-4">
                Connect your ad accounts directly, generate API keys, and automate your entire workflow.
              </p>
              <button className="rounded-xl bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#6366f1]/30 hover:scale-105 transition-transform">
                Unlock Integrations
              </button>
            </div>
          </div>
        )}

        <div className={`${!isPremium ? "blur-sm select-none pointer-events-none" : ""} space-y-8`}>
          
          {/* Section 1: Integrations Grid */}
          <div>
            <h2 className="text-xl font-bold text-white mb-6">Connected Platforms</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {integrations.map((integration, index) => (
                <motion.div
                  key={integration.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 hover:border-white/[0.12] transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${integration.color} shadow-lg`}>
                      <Plug className="h-6 w-6 text-white" />
                    </div>
                    <div className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                      integration.status === "connected"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-slate-500/10 text-slate-400 border border-slate-500/20"
                    }`}>
                      {integration.status === "connected" ? (
                        <>
                          <CheckCircle2 className="h-3 w-3" />
                          Connected
                        </>
                      ) : (
                        <>
                          <Circle className="h-3 w-3" />
                          Not Connected
                        </>
                      )}
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-white mb-1">{integration.name}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">{integration.desc}</p>

                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    {integration.lastSync ? (
                      <span className="text-[10px] text-slate-500">
                        Last sync: {integration.lastSync}
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-500">Not synced yet</span>
                    )}
                    <button className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                      integration.status === "connected"
                        ? "bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
                        : "bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white hover:scale-105 shadow-lg shadow-[#6366f1]/20"
                    }`}>
                      {integration.status === "connected" ? "Manage" : "Connect"}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Section 2: API Keys */}
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#6366f1] to-[#8b5cf6]">
                  <Key className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">API Keys</h3>
                  <p className="text-xs text-slate-400">Generate keys for external integrations</p>
                </div>
              </div>
              <button
                onClick={generateNewKey}
                className="flex items-center gap-2 rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-white/10 hover:text-white transition-all"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Generate New Key
              </button>
            </div>

            <div className="space-y-3">
              {apiKeys.map((apiKey) => (
                <div key={apiKey.id} className="rounded-xl border border-white/5 bg-[#0f0f1a] p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-emerald-400" />
                      <span className="text-sm font-semibold text-white">{apiKey.name}</span>
                    </div>
                    <button
                      onClick={() => handleCopy(apiKey.key)}
                      className="flex items-center gap-1.5 rounded-md bg-white/5 px-2 py-1 text-[10px] font-medium text-slate-400 hover:bg-white/10 hover:text-white transition-all"
                    >
                      {copied ? (
                        <>
                          <Check className="h-3 w-3 text-emerald-400" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                  <code className="block rounded-md bg-black/30 px-3 py-2 text-xs font-mono text-slate-300 mb-3">
                    {apiKey.key}
                  </code>
                  <div className="flex items-center gap-4 text-[10px] text-slate-500">
                    <span>Created: {apiKey.created}</span>
                    <span>Last used: {apiKey.lastUsed}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Documentation */}
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#8b5cf6] to-[#a78bfa]">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">API Documentation</h3>
                <p className="text-xs text-slate-400">Quick start guide for developers</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-xl border border-white/5 bg-[#0f0f1a] p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Code2 className="h-4 w-4 text-[#8b5cf6]" />
                  <span className="text-sm font-semibold text-white">Authentication</span>
                </div>
                <code className="block rounded-md bg-black/30 px-3 py-2 text-xs font-mono text-slate-300">
                  Authorization: Bearer mk_live_...
                </code>
              </div>

              <div className="rounded-xl border border-white/5 bg-[#0f0f1a] p-4">
                <div className="flex items-center gap-2 mb-2">
                  <ExternalLink className="h-4 w-4 text-[#8b5cf6]" />
                  <span className="text-sm font-semibold text-white">Base URL</span>
                </div>
                <code className="block rounded-md bg-black/30 px-3 py-2 text-xs font-mono text-slate-300">
                  https://api.makeitads.com/v1
                </code>
              </div>

              <div className="rounded-xl border border-dashed border-[#6366f1]/30 bg-[#6366f1]/5 p-4">
                <p className="text-xs text-slate-300">
                  <span className="font-bold text-white">Need help?</span>{" "}
                  Check our full documentation at{" "}
                  <a href="#" className="text-[#8b5cf6] hover:text-[#a78bfa] underline">
                    docs.makeitads.com
                  </a>{" "}
                  or contact our developer support team.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}