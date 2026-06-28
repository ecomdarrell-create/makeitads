"use client";

import { motion } from "framer-motion";

export default function PartnerLogos() {
  // Images de dashboards UNIQUES montrant des stats publicitaires
  const dashboardImages = [
    {
      src: "https://images.pexels.com/photos/3184466/pexels-photo-3184466.jpeg?auto=compress&cs=tinysrgb&w=800",
      alt: "Revenue analytics dashboard",
      title: "Revenue Analytics",
      stat: "+127% ROI",
    },
    {
      src: "https://images.pexels.com/photos/3184469/pexels-photo-3184469.jpeg?auto=compress&cs=tinysrgb&w=800",
      alt: "CTR and CPC performance metrics",
      title: "Performance Metrics",
      stat: "5.8% CTR",
    },
    {
      src: "https://images.pexels.com/photos/3184420/pexels-photo-3184420.jpeg?auto=compress&cs=tinysrgb&w=800",
      alt: "Ad campaign statistics",
      title: "Campaign Stats",
      stat: "$2.4M Revenue",
    },
    {
      src: "https://images.pexels.com/photos/3184468/pexels-photo-3184468.jpeg?auto=compress&cs=tinysrgb&w=800",
      alt: "ROI and conversion tracking",
      title: "ROI Tracking",
      stat: "340% Growth",
    },
    {
      src: "https://images.pexels.com/photos/3184422/pexels-photo-3184422.jpeg?auto=compress&cs=tinysrgb&w=800",
      alt: "Multi-platform ad management",
      title: "Ad Management",
      stat: "12 Active Campaigns",
    },
    {
      src: "https://images.pexels.com/photos/3184464/pexels-photo-3184464.jpeg?auto=compress&cs=tinysrgb&w=800",
      alt: "Audience targeting insights",
      title: "Audience Insights",
      stat: "2.5M Reach",
    },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.65 }}
      className="relative border-t border-white/5 bg-[#080810] py-20 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(99,102,241,0.05),_transparent_50%)]" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <div className="text-center mb-12">
          <p className="text-sm font-bold uppercase tracking-[0.32em] text-[#8b5cf6]">
            Powerful analytics at your fingertips
          </p>
          <h3 className="mt-4 text-3xl font-bold text-white">
            See your success in real-time.
          </h3>
          <p className="mt-4 text-slate-400 max-w-2xl mx-auto">
            Track CTR, CPC, conversions, and ROI across all your campaigns. Make data-driven decisions that grow your business.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {dashboardImages.map((image, index) => (
            <motion.div
              key={image.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0f0f1a]/80 shadow-[0_20px_60px_rgba(0,0,0,0.3)]"
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#080810] via-[#080810]/60 to-transparent" />
                
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-sm font-bold text-white">{image.title}</p>
                  <p className="text-xs text-emerald-400 mt-1 font-bold">{image.stat}</p>
                </div>
              </div>

              <div className="absolute top-4 right-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#6366f1]/20 backdrop-blur-sm border border-[#6366f1]/30">
                  <svg className="h-4 w-4 text-[#8b5cf6]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-12 grid gap-6 sm:grid-cols-3"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#0f0f1a] to-[#080810] p-6 text-center">
            <div className="text-3xl font-bold text-white mb-2">+53%</div>
            <div className="text-sm text-slate-400">Average CTR improvement</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#0f0f1a] to-[#080810] p-6 text-center">
            <div className="text-3xl font-bold text-white mb-2">$12.50</div>
            <div className="text-sm text-slate-400">Average CPC reduction</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#0f0f1a] to-[#080810] p-6 text-center">
            <div className="text-3xl font-bold text-white mb-2">3.8x</div>
            <div className="text-sm text-slate-400">Average ROI increase</div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}