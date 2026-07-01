import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Vehicles from "@/components/Vehicles";
import Comparator from "@/components/Comparator";
import Differentials from "@/components/Differentials";
import Gallery from "@/components/Gallery";
import Consortium from "@/components/Consortium";
import Testimonials from "@/components/Testimonials";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import FloatingCTA from "@/components/FloatingCTA";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Vehicles />
        <Comparator />
        <Differentials />
        <Gallery />
        <Consortium />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
      <FloatingCTA />
    </>
  );
}
