"use client";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Scale, ShieldCheck, AlertCircle, FileText } from "lucide-react";

const sections = [
  { id: "acceptance", title: "1. Acceptance of Terms" },
  { id: "description", title: "2. Description of Service" },
  { id: "accounts", title: "3. User Accounts & Security" },
  { id: "billing", title: "4. Fees, Billing, & Refund Policy" },
  { id: "conduct", title: "5. Prohibited Conduct" },
  { id: "liability", title: "6. Limitation of Liability" },
  { id: "termination", title: "7. Termination of Service" },
  { id: "governing", title: "8. Governing Law" },
  { id: "contact", title: "9. Contact Information" },
];

export default function TermsPage() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -100;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col justify-between overflow-x-hidden">
      <Navbar />

      <div className="flex-grow pt-32 pb-24 relative">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="container mx-auto px-6 max-w-6xl">
          {/* Header */}
          <div className="border-b border-white/10 pb-10 mb-12">
            <div className="flex items-center gap-3 mb-4 text-accent">
              <Scale className="w-6 h-6" />
              <span className="font-semibold tracking-wider text-sm uppercase">Legal Agreement</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Terms of Service</h1>
            <p className="text-muted-foreground">Last updated: June 16, 2026</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Sticky Sidebar Navigation */}
            <div className="lg:col-span-4 sticky top-28 hidden lg:block">
              <div className="glass p-6 rounded-3xl border border-white/10 space-y-4">
                <div className="flex items-center gap-2 text-white font-semibold mb-4 border-b border-white/5 pb-2">
                  <FileText className="w-4 h-4 text-accent" />
                  Table of Contents
                </div>
                <nav className="flex flex-col gap-2">
                  {sections.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => scrollToSection(s.id)}
                      className="text-left text-sm text-muted-foreground hover:text-white transition-colors cursor-pointer py-1.5 hover:translate-x-1 duration-200"
                    >
                      {s.title}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Document Content */}
            <div className="lg:col-span-8 space-y-12 text-muted-foreground leading-relaxed">
              <section id="acceptance" className="space-y-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-accent" />
                  1. Acceptance of Terms
                </h2>
                <p>
                  By registering for an account, connecting a GitHub repository, or using any feature of the RepoScribe AI SaaS platform (the “Service”), you agree to be bound by these Terms of Service (“Terms”). If you do not agree to these Terms, do not use the Service.
                </p>
                <p>
                  We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
                </p>
              </section>

              <section id="description" className="space-y-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-accent" />
                  2. Description of Service
                </h2>
                <p>
                  RepoScribe AI provides a web-based utility that connects to GitHub repositories, analyzes the files and code structures using artificial intelligence models, and formats/generates user-customizable Markdown README documentation.
                </p>
                <p>
                  We offer both free tiers and paid subscription plans. We reserve the right to modify, suspend, or discontinue any feature, rate limit, or service tier at any time without prior notice.
                </p>
              </section>

              <section id="accounts" className="space-y-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-accent" />
                  3. User Accounts & Security
                </h2>
                <p>
                  You must link a valid GitHub account or create a registered email account to use the Service. You are solely responsible for maintaining the confidentiality of your account tokens, session states, and credentials.
                </p>
                <p>
                  You agree to immediately notify us of any unauthorized use of your account or security breaches. We cannot and will not be liable for any loss or damage arising from your failure to comply with this security obligation.
                </p>
              </section>

              <section id="billing" className="space-y-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Scale className="w-5 h-5 text-accent" />
                  4. Fees, Billing, & Refund Policy
                </h2>
                <p>
                  For premium plans, fees are billed on a subscription basis (monthly or annually) in advance. Subscriptions auto-renew until cancelled in your Account Settings.
                </p>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-3">
                  <p className="font-semibold text-white">Pricing Terms & Cancellations:</p>
                  <ul className="list-disc pl-5 space-y-2 text-sm">
                    <li><strong className="text-white">Cancellations:</strong> You can cancel your subscription at any time. You will continue to have access to premium features until the end of your billing cycle.</li>
                    <li><strong className="text-white">Refunds:</strong> Since our services consume non-refundable AI computation tokens, we do not offer refunds, except when required by local consumer laws.</li>
                  </ul>
                </div>
              </section>

              <section id="conduct" className="space-y-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-accent" />
                  5. Prohibited Conduct
                </h2>
                <p>
                  You agree not to use the Service to analyze, generate documentation for, or display any repository containing code that is illegal, defamatory, harmful, malicious, or violates the intellectual property rights of others.
                </p>
                <p>
                  You may not abuse our API endpoints, conduct denial-of-service tests, or use automated scripts to bulk-process repositories beyond your plan's standard rate limits.
                </p>
              </section>

              <section id="liability" className="space-y-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-accent" />
                  6. Limitation of Liability
                </h2>
                <p>
                  In no event shall RepoScribe AI, nor its directors, employees, partners, agents, or suppliers, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of the Service.
                </p>
              </section>

              <section id="termination" className="space-y-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-accent" />
                  7. Termination of Service
                </h2>
                <p>
                  We may terminate or suspend your account and access to the Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the Service will immediately cease.
                </p>
              </section>

              <section id="governing" className="space-y-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Scale className="w-5 h-5 text-accent" />
                  8. Governing Law
                </h2>
                <p>
                  These Terms shall be governed and construed in accordance with the laws of the State of California, United States, without regard to its conflict of law provisions.
                </p>
              </section>

              <section id="contact" className="space-y-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-accent" />
                  9. Contact Information
                </h2>
                <p>
                  If you have any questions about these Terms, please contact us by email:
                </p>
                <div className="glass p-6 rounded-2xl border border-white/10 inline-block">
                  <p className="font-semibold text-white">RepoScribe AI Support</p>
                  <p className="text-sm">Email: <a href="mailto:support@reposcribe.ai" className="text-accent hover:underline">support@reposcribe.ai</a></p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
