import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import dynamic from "next/dynamic";

const Trusted = dynamic(() => import("./components/Trusted"), { ssr: true });
const HowItWorks = dynamic(() => import("./components/HowItWorks"), { ssr: true });
const Features = dynamic(() => import("./components/Features"), { ssr: true });
const Templates = dynamic(() => import("./components/Templates"), { ssr: true });
const LivePreview = dynamic(() => import("./components/LivePreview"), { ssr: true });
const Comparison = dynamic(() => import("./components/Comparison"), { ssr: true });
const CTASection = dynamic(() => import("./components/CTASection"), { ssr: true });
const Footer = dynamic(() => import("./components/Footer"), { ssr: true });

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <Hero />
      <Trusted />
      <HowItWorks />
      <Features />
      <Templates />
      <LivePreview />
      <Comparison />
      <CTASection />
      <Footer />
    </main>
  );
}
