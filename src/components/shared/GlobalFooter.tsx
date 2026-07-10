import Link from "next/link";
import { Mail } from "lucide-react";

export default function GlobalFooter() {
  return (
    <footer className="relative z-10 border-t border-white/10 bg-[#0a0a14] pt-20 pb-10 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-1.5 mb-6">
              <span className="text-xl font-bold tracking-tight text-white">Make<span className="text-[#6366f1]">ItAds</span></span>
            </Link>
            <p className="text-sm text-slate-400 mb-6 leading-relaxed">AI-powered market intelligence for modern businesses. Stop guessing, start growing.</p>
            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Subscribe to newsletter</p>
              <div className="flex gap-2">
                <input type="email" placeholder="Enter your email" className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-[#6366f1] transition-colors placeholder:text-slate-500" />
                <button className="rounded-lg bg-[#6366f1] px-3 py-2 text-white hover:bg-[#5558e6] transition-colors"><Mail className="h-4 w-4" /></button>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white mb-6">Product</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><Link href="/#features" className="hover:text-white transition-colors">Features</Link></li>
              <li><Link href="/#pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
              <li><Link href="/community" className="hover:text-white transition-colors">Community</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white mb-6">Resources</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><Link href="/#faq" className="hover:text-white transition-colors">Documentation</Link></li>
              <li><a href="https://t.me/makeitads" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Community</a></li>
              <li><Link href="/help" className="hover:text-white transition-colors">Help Center</Link></li>
              <li><Link href="/#success-stories" className="hover:text-white transition-colors">Success Stories</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white mb-6">Company</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
              <li><Link href="/community" className="hover:text-white transition-colors">The Boardroom</Link></li>
              <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-xs text-slate-500">© 2026 MakeItAds Inc. All rights reserved.</p>
          <div className="flex items-center gap-6 text-xs text-slate-500">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/cookies" className="hover:text-white transition-colors">Cookie Settings</Link>
          </div>
          <div className="flex items-center gap-4">
            {/* LinkedIn */}
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
            {/* Twitter/X */}
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            {/* Email */}
            <a href="mailto:support@makeitads.com" className="text-slate-400 hover:text-white transition-colors">
              <Mail className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}