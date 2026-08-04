import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Engine from "@/components/Engine";
import Archetypes from "@/components/Archetypes";
import Memory from "@/components/Memory";
import Trust from "@/components/Trust";
import Privacy from "@/components/Privacy";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main id="top">
        <Hero />
        <Engine />
        <Archetypes />
        <Memory />
        <Trust />
        <Privacy />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
