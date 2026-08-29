"use client";

import Link from "next/link";
import { ArrowLeft, Settings, User, Bell, Shield } from "lucide-react";

export default function ParametresPage() {
  return (
    <main className="min-h-screen bg-[#F7F7F8] pt-24 pb-12 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-[#71717A] hover:text-[#6366F1] mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Retour à l'accueil
        </Link>

        <div className="bg-white rounded-2xl border border-[#E7E7EB] shadow-sm overflow-hidden">
          <div className="p-6 border-b border-[#E7E7EB] flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#6366F1]/10 flex items-center justify-center">
              <Settings className="h-5 w-5 text-[#6366F1]" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#18181B]">Paramètres</h1>
              <p className="text-sm text-[#71717A]">Gérez vos préférences et votre compte</p>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between py-3 border-b border-[#F7F7F8]">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-[#71717A]" />
                <div>
                  <p className="text-sm font-semibold text-[#18181B]">Profil</p>
                  <p className="text-xs text-[#71717A]">Informations personnelles</p>
                </div>
              </div>
              <span className="text-xs text-[#71717A]">Bientôt disponible</span>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-[#F7F7F8]">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-[#71717A]" />
                <div>
                  <p className="text-sm font-semibold text-[#18181B]">Notifications</p>
                  <p className="text-xs text-[#71717A]">Alertes WhatsApp et Email</p>
                </div>
              </div>
              <span className="text-xs text-[#71717A]">Bientôt disponible</span>
            </div>

            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-[#71717A]" />
                <div>
                  <p className="text-sm font-semibold text-[#18181B]">Confidentialité</p>
                  <p className="text-xs text-[#71717A]">Gestion des données</p>
                </div>
              </div>
              <span className="text-xs text-[#71717A]">Bientôt disponible</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}