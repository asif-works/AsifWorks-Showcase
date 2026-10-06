import Hero from "@/components/sections/Hero";
import Manifesto from "@/components/sections/Manifesto";
import Statement from "@/components/sections/Statement";
import Work from "@/components/sections/Work";
import Gallery from "@/components/sections/Gallery";
import Capabilities from "@/components/sections/Capabilities";
import MotionShowcase from "@/components/sections/MotionShowcase";
import Stats from "@/components/sections/Stats";
import Process from "@/components/sections/Process";
import Studio from "@/components/sections/Studio";
import Playground from "@/components/sections/Playground";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <Hero />
      <Manifesto />
      <Statement />
      <Work />
      <Gallery />
      <Capabilities />
      <MotionShowcase />
      <Stats />
      <Process />
      <Studio />
      <Playground />
      <Contact />
      <Footer />
    </>
  );
}
