"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

// Témoignages avec photos réalistes, diversifiées et noms cohérents
const testimonialsData = [
  {
    firstName: "Sophie",
    lastName: "L.",
    role: "Pro member",
    memberSince: "8 months",
    quote: "MakeItAds completely changed how we approach our campaigns. The ROI is insane, and the targeting is spot on.",
    rating: 5,
    image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=800", // Femme
  },
  {
    firstName: "Marcus",
    lastName: "J.",
    role: "Premium member",
    memberSince: "1 year",
    quote: "Finally, a tool that actually understands audience targeting. My CPC dropped by 40% in just one week.",
    rating: 4,
    image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=800", // Homme noir
  },
  {
    firstName: "Amina",
    lastName: "K.",
    role: "Premium member",
    memberSince: "10 months",
    quote: "The insights are incredibly deep. It helped me pivot my entire ad strategy and double my conversions.",
    rating: 5,
    image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=800", // Femme noire
  },
  {
    firstName: "David",
    lastName: "M.",
    role: "Premium member",
    memberSince: "2 years",
    quote: "As a solo entrepreneur, this is a game-changer. I get agency-level strategies without the agency price tag.",
    rating: 5,
    image: "https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=800", // Homme noir
  },
  {
    firstName: "Yuki",
    lastName: "T.",
    role: "Pro member",
    memberSince: "6 months",
    quote: "The AI-generated copy feels very natural. It saved us hours of brainstorming and actually converts better.",
    rating: 5,
    image: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=800", // Asiatique
  },
  {
    firstName: "Fatima",
    lastName: "B.",
    role: "Pro member",
    memberSince: "5 months",
    quote: "Best investment for my e-commerce business. The ad copies convert 3x better than what I was writing.",
    rating: 5,
    image: "https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=800", // Femme
  },
  {
    firstName: "James",
    lastName: "W.",
    role: "Premium member",
    memberSince: "1 year",
    quote: "The multi-platform optimization is brilliant. Finally, all my campaigns are aligned and performing.",
    rating: 4,
    image: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=800", // Homme
  },
  {
    firstName: "Chioma",
    lastName: "N.",
    role: "Pro member",
    memberSince: "7 months",
    quote: "I launched my product in 3 days instead of 3 weeks. The targeting recommendations were perfect for my audience.",
    rating: 5,
    image: "https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=800", // Femme noire
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          viewBox="0 0 20 20"
          className={`h-5 w-5 ${
            star <= rating ? "fill-amber-400 text-amber-400" : "fill-slate-700 text-slate-700"
          }`}
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.962a1 1 0 0 0 .95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 0 0-.364 1.118l1.286 3.962c.3.921-.755 1.688-1.54 1.118l-3.385-2.46a1 1 0 0 0-1.176 0l-3.385 2.46c-.784.57-1.838-.197-1.539-1.118l1.286-3.962a1 1 0 0 0-.364-1.118L2.049 9.39c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 0 0 .95-.69l1.286-3.962z" />
        </svg>
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
  const [isPaused, setIsPaused] = useState(false);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const offsetRef = useRef(0);
  const contentWidthRef = useRef(0);

  const loopTestimonials = useMemo(() => [...testimonialsData, ...testimonialsData, ...testimonialsData], []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const updateWidth = () => {
      contentWidthRef.current = track.scrollWidth / 3;
    };

    updateWidth();
    const resizeObserver = new ResizeObserver(updateWidth);
    resizeObserver.observe(track);

    const speed = 35;

    const step = (time: number) => {
      if (!lastTimeRef.current) {
        lastTimeRef.current = time;
      }

      const delta = time - lastTimeRef.current;
      lastTimeRef.current = time;

      if (!isPaused && contentWidthRef.current > 0) {
        offsetRef.current += (delta / 1000) * speed;
        if (offsetRef.current >= contentWidthRef.current) {
          offsetRef.current -= contentWidthRef.current;
        }
        track.style.transform = `translateX(-${offsetRef.current}px)`;
      }

      animationRef.current = window.requestAnimationFrame(step);
    };

    animationRef.current = window.requestAnimationFrame(step);

    return () => {
      if (animationRef.current) {
        window.cancelAnimationFrame(animationRef.current);
      }
      resizeObserver.disconnect();
    };
  }, [isPaused]);

  return (
    <section id="testimonials" className="relative border-t border-white/5 bg-[#080810] py-24 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(99,102,241,0.06),_transparent_50%)]" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mb-16 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-sm font-bold uppercase tracking-[0.32em] text-[#6366f1]">Real entrepreneurs</p>
            <h2 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Real entrepreneurs. Real results.
            </h2>
            <p className="mt-6 text-lg text-slate-400 max-w-2xl">
              Join thousands of founders who transformed their ad strategy with MakeItAds.
            </p>
          </motion.div>
        </div>

        <motion.div
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0f0f1a]/50 backdrop-blur-xl shadow-[0_40px_100px_rgba(0,0,0,0.3)] py-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#080810] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#080810] to-transparent z-10 pointer-events-none" />

          <div
            className="flex gap-6 px-6"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div className="overflow-hidden w-full">
              <div ref={trackRef} className="flex gap-6 will-change-transform">
                {loopTestimonials.map((testimonial, index) => (
                  <article
                    key={`${testimonial.firstName}-${index}`}
                    className="group relative w-[380px] h-[520px] shrink-0 rounded-3xl overflow-hidden border border-white/10 shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:border-[#6366f1]/40 hover:shadow-[0_40px_100px_rgba(99,102,241,0.2)]"
                  >
                    <img
                      src={testimonial.image}
                      alt={testimonial.firstName}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-[#080810] via-[#080810]/80 to-[#080810]/20" />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#080810]/90" />

                    <div className="absolute inset-0 flex flex-col justify-end p-8">
                      <div className="mb-6">
                        <StarRating rating={testimonial.rating} />
                      </div>

                      <p className="text-lg font-medium leading-relaxed text-white mb-8 line-clamp-4">
                        "{testimonial.quote}"
                      </p>

                      <div className="flex items-center justify-between pt-6 border-t border-white/10">
                        <div>
                          <p className="text-base font-bold text-white">{testimonial.firstName} {testimonial.lastName}</p>
                          <p className="text-sm text-slate-300">{testimonial.role}</p>
                          <p className="text-xs text-slate-400 mt-1">Member for {testimonial.memberSince}</p>
                        </div>
                        
                        <div className="flex items-center gap-1.5 bg-blue-500/15 border border-blue-500/30 backdrop-blur-sm px-3 py-1.5 rounded-full">
                          <svg className="h-4 w-4 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                            <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.491 4.491 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                          </svg>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-200">Verified</span>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}