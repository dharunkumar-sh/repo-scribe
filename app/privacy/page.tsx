"use client";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Shield, Lock, Eye, FileText, Mail } from "lucide-react";
import { motion } from "framer-motion";

const sections = [
  { id: "intro", title: "1. Introduction" },
  { id: "collection", title: "2. Information We Collect" },
  { id: "usage", title: "3. How We Use Your Data" },
  { id: "sharing", title: "4. Data Sharing & Security" },
  { id: "retention", title: "5. Data Retention" },
  { id: "cookies", title: "6. Cookies & Tracking" },
  { id: "rights", title: "7. Your Rights" },
  { id: "contact", title: "8. Contact Us" },
];

export default function PrivacyPage() {
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
              <Shield className="w-6 h-6" />
              <span className="font-semibold tracking-wider text-sm uppercase">Legal Information</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Privacy Policy</h1>
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
              <section id="intro" className="space-y-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Lock className="w-5 h-5 text-accent" />
                  1. Introduction
                </h2>
                <p>
                  Welcome to RepoScribe AI (“we,” “us,” or “our”). We are committed to protecting your personal information and your right to privacy. This Privacy Policy describes how we collect, use, disclose, and safeguard your data when you visit our website, use our SaaS platform, or authenticate using our GitHub integrations.
                </p>
                <p>
                  By accessing or using RepoScribe AI, you agree to the collection and use of information in accordance with this policy. If you do not agree with any terms in this privacy notice, please discontinue use of our services immediately.
                </p>
              </section>

              <section id="collection" className="space-y-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Eye className="w-5 h-5 text-accent" />
                  2. Information We Collect
                </h2>
                <p>
                  We collect information that you voluntarily provide to us when you register on our platform, link your GitHub account, or contact us.
                </p>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-3">
                  <p className="font-semibold text-white">We collect the following classes of data:</p>
                  <ul className="list-disc pl-5 space-y-2 text-sm">
                    <li><strong className="text-white">Account Details:</strong> Email addresses, display names, profile photos, and unique account IDs provided through OAuth authentication (GitHub or email signups).</li>
                    <li><strong className="text-white">GitHub Integration Data:</strong> Read-only access scopes to repository names, branch details, file structures, and code contents specifically required to parse and generate README files.</li>
                    <li><strong className="text-white">Usage Logs:</strong> Action timestamps, templates selection history, saved README favorites, and system execution telemetry.</li>
                  </ul>
                </div>
              </section>

              <section id="usage" className="space-y-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-accent" />
                  3. How We Use Your Data
                </h2>
                <p>We process your information for purposes based on legitimate business interests, the fulfillment of our contract with you, compliance with our legal obligations, and/or your consent.</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>To facilitate account creation, login processes, and subscription status updates.</li>
                  <li>To connect to your specified GitHub repository, fetch directory file trees, read dependencies, and compile code summaries.</li>
                  <li>To request markdown synthesis from secure LLM APIs to generate your structured README.md files.</li>
                  <li>To provide customer support and respond to queries sent via our support forms.</li>
                  <li>To track statistics and platform usage metrics to improve user interface designs.</li>
                </ul>
              </section>

              <section id="sharing" className="space-y-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Lock className="w-5 h-5 text-accent" />
                  4. Data Sharing & Security
                </h2>
                <p>
                  We do not sell, rent, or trade your personal data. We only share information with third-party service providers (such as Google Firebase for database storage and authentication, and LLM providers for processing documentation requests) who are contractually bound to safeguard your data.
                </p>
                <p>
                  We implement robust technical and organizational security measures to protect the security of any personal information we process. However, please remember that no transmission over the internet can be guaranteed 100% secure.
                </p>
              </section>

              <section id="retention" className="space-y-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-accent" />
                  5. Data Retention
                </h2>
                <p>
                  We will only keep your personal information for as long as it is necessary for the purposes set out in this privacy policy, unless a longer retention period is required or permitted by law. You may request the deletion of your account and related repository histories at any time through the platform settings.
                </p>
              </section>

              <section id="cookies" className="space-y-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Eye className="w-5 h-5 text-accent" />
                  6. Cookies & Tracking
                </h2>
                <p>
                  We use essential cookies and session variables to maintain authentication states and security tokens. We do not use intrusive cross-site advertising cookies. You can manage your browser preferences to disable cookies, but some features of the SaaS dashboard might fail to function as a result.
                </p>
              </section>

              <section id="rights" className="space-y-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Shield className="w-5 h-5 text-accent" />
                  7. Your Rights
                </h2>
                <p>
                  Depending on your jurisdiction (such as under the GDPR or CCPA), you have the right to access, edit, or delete the personal data we store. You can also revoke access to the RepoScribe GitHub application directly from your GitHub profile settings at any time.
                </p>
              </section>

              <section id="contact" className="space-y-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Mail className="w-5 h-5 text-accent" />
                  8. Contact Us
                </h2>
                <p>
                  If you have questions or comments about this policy, or want to submit a request concerning your data rights, you can email us directly at:
                </p>
                <div className="glass p-6 rounded-2xl border border-white/10 inline-block">
                  <p className="font-semibold text-white">RepoScribe AI Legal Team</p>
                  <p className="text-sm">Email: <a href="mailto:support@reposcribe.ai" className="text-accent hover:underline">support@reposcribe.ai</a></p>
                  <p className="text-sm">Address: Remote First, San Francisco, CA</p>
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
