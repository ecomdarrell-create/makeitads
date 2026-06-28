"use client";

import { useEffect, useState } from "react";
import PartnerLogos from "./partner-logos";
import Navbar from "./Navbar";
import HeroSection from "./HeroSection";
import ProblemSection from "./ProblemSection";
import HowItWorks from "./HowItWorks";
import FeaturesSection from "./FeaturesSection";
import BlogSection from "./BlogSection";
import StatisticsSection from "./StatisticsSection";
import TestimonialsSection from "./TestimonialsSection";
import { PricingSection } from "./PricingSection";
import { ComparisonSection } from "./ComparisonSection";
import FounderSection from "./FounderSection";
import FAQSection from "./FAQSection";
import FinalCta from "./FinalCta";
import Footer from "./Footer";

export default function LandingPage() {
  const [isNavbarCondensed, setIsNavbarCondensed] = useState(false);
  const [selectedBilling, setSelectedBilling] = useState<"monthly" | "annual">("monthly");
  const [accordionIndex, setAccordionIndex] = useState<number | null>(0);

  useEffect(() => {
    const handleScroll = () => {
      setIsNavbarCondensed(window.scrollY > 20);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#080810] text-slate-100">
      <Navbar condensed={isNavbarCondensed} />
      <HeroSection />
      <PartnerLogos />
      <ProblemSection />
      <HowItWorks />
      <FeaturesSection />
      <BlogSection />
      <StatisticsSection />
      <TestimonialsSection />
      <PricingSection selectedBilling={selectedBilling} onBillingChange={setSelectedBilling} />
      <ComparisonSection />
      <FounderSection />
      <FAQSection accordionIndex={accordionIndex} setAccordionIndex={setAccordionIndex} />
      <FinalCta />
      <Footer />
    </div>
  );
}