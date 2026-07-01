import Navbar from '@/components/layout/Navbar';
import Hero from '@/components/sections/Hero';
import Stats from '@/components/sections/Stats';
import Portfolio from '@/components/sections/Portfolio';
import Services from '@/components/sections/Services';
import Process from '@/components/sections/Process';
import Differentials from '@/components/sections/Differentials';
import Testimonials from '@/components/sections/Testimonials';
import FAQ from '@/components/sections/FAQ';
import CTA from '@/components/sections/CTA';
import Footer from '@/components/sections/Footer';

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Stats />
      <Portfolio />
      <Services />
      <Process />
      <Differentials />
      <Testimonials />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  );
}
