import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Trusted from "./components/Trusted";
import HowItWorks from "./components/HowItWorks";
import Features from "./components/Features";
import Templates from "./components/Templates";
import LivePreview from "./components/LivePreview";
import Comparison from "./components/Comparison";
import CTASection from "./components/CTASection";
import Footer from "./components/Footer";

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
