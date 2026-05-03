import { Header } from "@/components/garix/Header";
import { Hero } from "@/components/garix/Hero";
import { Concept } from "@/components/garix/Concept";
import { Differentiation } from "@/components/garix/Differentiation";
import { Framework } from "@/components/garix/Framework";
import { Diagnostic } from "@/components/garix/Diagnostic";
import { Footer } from "@/components/garix/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-paper text-ink font-sans">
      <Header />
      <main>
        <Hero />
        <Concept />
        <Differentiation />
        <Framework />
        <Diagnostic />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
