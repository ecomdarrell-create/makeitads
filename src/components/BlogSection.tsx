"use client";

import { motion } from "framer-motion";

// Données des articles avec images Pexels fonctionnelles
const blogPosts = [
  {
    title: "Scaling paid media without overspending",
    category: "Growth strategy",
    readTime: "5 min read",
    excerpt: "Learn how to scale your ad campaigns while maintaining profitability. The key is data-driven optimization and smart budget allocation.",
    image: "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=800",
    date: "Dec 15, 2025",
  },
  {
    title: "Building launch campaigns for premium product founders",
    category: "Product launches",
    readTime: "7 min read",
    excerpt: "Premium products require premium positioning. Discover the exact framework we use to create high-converting launch campaigns.",
    image: "https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=800",
    date: "Dec 10, 2025",
  },
  {
    title: "When to white-label ad tools for enterprise clients",
    category: "Enterprise",
    readTime: "6 min read",
    excerpt: "White-labeling can be a game-changer for agencies. Here's how to know when it's the right move for your business model.",
    image: "https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=800",
    date: "Dec 5, 2025",
  },
];

export default function BlogSection() {
  return (
    <section id="blog" className="relative border-t border-white/5 bg-[#080810] py-24 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,_rgba(99,102,241,0.06),_transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,_rgba(139,92,246,0.04),_transparent_50%)]" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        {/* Header */}
        <div className="mb-16 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-sm font-bold uppercase tracking-[0.32em] text-[#8b5cf6]">Insights</p>
            <h2 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Marketing insights from the field.
            </h2>
            <p className="mt-6 text-lg text-slate-400 max-w-2xl">
              Real strategies, real results. Learn from entrepreneurs who are crushing it with AI-powered ads.
            </p>
          </motion.div>
        </div>

        {/* Blog grid */}
        <div className="grid gap-8 lg:grid-cols-3">
          {blogPosts.map((post, index) => (
            <motion.article
              key={post.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group overflow-hidden rounded-[2rem] border border-white/10 bg-[#0f0f1a]/90 shadow-[0_30px_80px_rgba(0,0,0,0.2)] transition-all duration-300 hover:border-[#6366f1]/30 hover:shadow-[0_40px_100px_rgba(99,102,241,0.15)]"
            >
              {/* Image container */}
              <div className="relative h-56 w-full overflow-hidden bg-gradient-to-br from-[#1a1a2e] to-[#0f0f1a]">
                <img
                  src={post.image}
                  alt={post.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#080810] via-[#080810]/40 to-transparent" />
                
                {/* Category badge */}
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center rounded-full bg-[#6366f1]/20 backdrop-blur-sm border border-[#6366f1]/30 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#c7d2fe]">
                    {post.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-4 p-6">
                {/* Meta info */}
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-medium">{post.date}</span>
                  <span className="flex items-center gap-1">
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {post.readTime}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-white leading-tight transition-colors group-hover:text-[#a78bfa]">
                  {post.title}
                </h3>

                {/* Excerpt */}
                <p className="text-sm leading-relaxed text-slate-400">
                  {post.excerpt}
                </p>

                {/* Read more link */}
                <a
                  href="#"
                  className="group/link inline-flex items-center gap-2 text-sm font-bold text-[#6366f1] transition-all hover:gap-3"
                >
                  Read more
                  <svg
                    className="h-4 w-4 transition-transform group-hover/link:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>
              </div>
            </motion.article>
          ))}
        </div>

        {/* CTA button */}
        <motion.div
          className="mt-12 flex justify-end"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <a
            href="#pricing"
            className="group inline-flex items-center justify-center gap-2 rounded-[12px] bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] px-8 py-4 text-sm font-bold text-white shadow-[0_20px_60px_rgba(99,102,241,0.2)] transition-all hover:-translate-y-1 hover:shadow-[0_25px_80px_rgba(139,92,246,0.3)]"
          >
            Explore the latest insights
            <svg
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
}