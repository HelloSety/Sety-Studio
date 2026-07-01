import { Navbar }          from "./components/landing/Navbar";
import { Hero }            from "./components/landing/Hero";
import { HeroDemo }        from "./components/landing/HeroDemo";
import { LogoMarquee }     from "./components/landing/LogoMarquee";
import { Integracoes }     from "./components/landing/Integracoes";
import { ProdutoShowcase } from "./components/landing/ProdutoShowcase";
import { WhatsAppDemo }    from "./components/landing/WhatsAppDemo";
import { HowItWorks }      from "./components/landing/HowItWorks";
import { Comparativo }     from "./components/landing/Comparativo";
import { Testimonials }    from "./components/landing/Testimonials";
import { Pricing }         from "./components/landing/Pricing";
import { FAQ }             from "./components/landing/FAQ";
import { CTA }             from "./components/landing/CTA";
import { Footer }          from "./components/landing/Footer";
export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <HeroDemo />
        <LogoMarquee />
        <Integracoes />
        <ProdutoShowcase />
        <WhatsAppDemo />
        <HowItWorks />
        <Comparativo />
        <Testimonials />
        <Pricing />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
