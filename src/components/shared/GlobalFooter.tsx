import Link from "next/link";
import { SiMeta, SiGoogle, SiTiktok, SiInstagram } from "react-icons/si";

export default function GlobalFooter() {
  return (
    <footer className="bg-[#F7F7F8] border-t border-[#E7E7EB] pt-12 pb-8 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <div className="col-span-1 md:col-span-1">
          <Link href="/" className="text-lg font-medium text-[#18181B] tracking-tight">
            MakeIt<span className="text-[#6366F1]">Ads</span>
          </Link>
          <p className="text-xs text-[#71717A] mt-2 leading-relaxed">
            Stratégies publicitaires premium calibrées pour l'Afrique.
          </p>
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-[#18181B] mb-3">Navigation</h4>
          <ul className="space-y-2 text-xs text-[#71717A]">
            <li><Link href="#how-it-works" className="hover:text-[#6366F1] transition-colors">Comment ça marche</Link></li>
            <li><Link href="#pricing" className="hover:text-[#6366F1] transition-colors">Tarifs</Link></li>
            <li><Link href="/a-propos" className="hover:text-[#6366F1] transition-colors">À propos</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-medium text-[#18181B] mb-3">Légal</h4>
          <ul className="space-y-2 text-xs text-[#71717A]">
            <li><Link href="/privacy" className="hover:text-[#6366F1] transition-colors">Confidentialité</Link></li>
            <li><Link href="/terms" className="hover:text-[#6366F1] transition-colors">Conditions d'utilisation</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-medium text-[#18181B] mb-3">Réseaux</h4>
          <div className="flex gap-3 text-[#71717A]">
            <SiMeta className="w-4 h-4 hover:text-[#6366F1] transition-colors cursor-pointer" />
            <SiInstagram className="w-4 h-4 hover:text-[#6366F1] transition-colors cursor-pointer" />
            <SiTiktok className="w-4 h-4 hover:text-[#6366F1] transition-colors cursor-pointer" />
          </div>
        </div>
      </div>
      
      <div className="border-t border-[#E7E7EB] pt-6 text-center">
        <p className="text-[10px] text-[#94A3B8]">© 2024 MakeItAds. Tous droits réservés.</p>
      </div>
    </footer>
  );
}