"use client";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useState } from "react";
import { motion } from "framer-motion";
import { Check, HelpCircle, Sparkles } from "lucide-react";
import toast from "react-hot-toast";

const plans = [
  {
    name: "Hobby",
    priceMonthly: 0,
    priceYearly: 0,
    description: "Perfect for exploring templates and side projects.",
    features: [
      "5 README generations / month",
      "Access to standard templates",
      "Manual copy & export",
      "Public repositories only",
      "Community support",
    ],
    cta: "Get Started Free",
    highlight: false,
    color: "border-white/10",
  },
  {
    name: "Pro",
    priceMonthly: 15,
    priceYearly: 12,
    description: "Ideal for active developers and open-source creators.",
    features: [
      "Unlimited README generations",
      "Access to all templates (10+ patterns)",
      "Continuous GitHub App Sync (auto-commits)",
      "Private repository parsing support",
      "Custom shields & badges integration",
      "Priority AI queue support",
      "Email support (under 12h)",
    ],
    cta: "Upgrade to Pro",
    highlight: true,
    color: "border-primary/50 relative shadow-[0_0_30px_rgba(124,58,237,0.15)]",
  },
  {
    name: "Team",
    priceMonthly: 49,
    priceYearly: 39,
    description: "Designed for small engineering teams and organizations.",
    features: [
      "Everything in Pro",
      "Up to 10 team seats",
      "Shared organizational dashboard",
      "Custom internal README templates",
      "Dedicated Slack workspace channel support",
      "99.9% API generation SLA uptime",
    ],
    cta: "Contact Sales",
    highlight: false,
    color: "border-white/10",
  },
];

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");

  const handleCheckout = (planName: string) => {
    if (planName === "Hobby") {
      toast.success("Welcome! You are on the free Hobby plan.");
    } else if (planName === "Pro") {
      toast.success("Connecting to secure checkout gateway...");
    } else {
      toast.success("Redirecting to support callback...");
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col justify-between overflow-x-hidden">
      <Navbar />

      <div className="flex-grow pt-32 pb-24 relative">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-primary/10 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute top-2/3 right-10 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="container mx-auto px-6 max-w-6xl">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-6">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-muted">Transparent Pricing</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-white leading-tight">
              Simple plans for <span className="text-gradient">every developer.</span>
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              No credit card required to start. Cancel or upgrade your plan at any time with one click.
            </p>

            {/* Toggle */}
            <div className="flex items-center justify-center gap-4 mt-10">
              <span className={`text-sm ${billingPeriod === "monthly" ? "text-white font-medium" : "text-muted-foreground"}`}>Monthly</span>
              <button
                onClick={() => setBillingPeriod(billingPeriod === "monthly" ? "yearly" : "monthly")}
                className="w-14 h-8 bg-white/10 hover:bg-white/15 rounded-full p-1 transition-colors relative cursor-pointer"
              >
                <motion.div
                  layout
                  className="w-6 h-6 bg-white rounded-full"
                  animate={{ x: billingPeriod === "monthly" ? 0 : 24 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </button>
              <span className={`text-sm flex items-center gap-2 ${billingPeriod === "yearly" ? "text-white font-medium" : "text-muted-foreground"}`}>
                Yearly
                <span className="text-[10px] font-bold px-2 py-0.5 bg-accent/20 text-accent rounded-full border border-accent/20">Save 20%</span>
              </span>
            </div>
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch mb-20">
            {plans.map((p, idx) => {
              const price = billingPeriod === "monthly" ? p.priceMonthly : p.priceYearly;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className={`glass rounded-[32px] p-8 border flex flex-col justify-between hover:border-white/20 transition-all duration-300 ${p.color} ${
                    p.highlight ? "scale-105 z-10" : ""
                  }`}
                >
                  <div>
                    {p.highlight && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-bold tracking-wider uppercase bg-gradient-to-r from-primary to-secondary text-white px-3 py-1 rounded-full border border-white/20 flex items-center gap-1 shadow-md">
                        <Sparkles className="w-3 h-3" /> Most Popular
                      </span>
                    )}

                    <div className="mb-6">
                      <h3 className="text-2xl font-bold text-white mb-2">{p.name}</h3>
                      <p className="text-xs text-muted-foreground min-h-[32px]">{p.description}</p>
                    </div>

                    <div className="flex items-baseline gap-1 mb-8">
                      <span className="text-4xl md:text-5xl font-extrabold text-white">${price}</span>
                      <span className="text-sm text-muted-foreground">/ month</span>
                    </div>

                    <div className="h-px bg-white/5 mb-8" />

                    <ul className="space-y-4 mb-8">
                      {p.features.map((f, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-3 text-xs text-muted-foreground">
                          <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => handleCheckout(p.name)}
                    className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer ${
                      p.highlight
                        ? "bg-white text-black hover:bg-gray-150 shadow-lg shadow-white/5"
                        : "bg-white/5 hover:bg-white/10 text-white border border-white/10"
                    }`}
                  >
                    {p.cta}
                  </button>
                </motion.div>
              );
            })}
          </div>

          {/* Guarantee / FAQ note */}
          <div className="glass max-w-4xl mx-auto rounded-3xl border border-white/10 p-8 flex flex-col sm:flex-row items-center gap-6 justify-between">
            <div className="flex gap-4 items-center">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0">
                <HelpCircle className="w-6 h-6" />
              </div>
              <div className="text-center sm:text-left">
                <h4 className="font-semibold text-white mb-1">Have questions or need custom limits?</h4>
                <p className="text-muted-foreground text-xs leading-relaxed max-w-lg">
                  If you run a high-volume development shop, contact us for special multi-seat organizations pricing rates. We're happy to tailor custom integrations.
                </p>
              </div>
            </div>
            <a
              href="/contact"
              className="px-6 py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white text-xs font-semibold rounded-xl transition-all shrink-0 cursor-pointer"
            >
              Get in Touch
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
