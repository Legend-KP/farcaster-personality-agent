import { GatewayHero } from "@/components/studio/GatewayHero";
import { LandingSections } from "@/components/studio/LandingSections";
import { ScrollFilm } from "@/components/studio/ScrollFilm";
import { SiteFooter } from "@/components/studio/SiteFooter";
import { SiteNav } from "@/components/studio/SiteNav";

export default function Home() {
  return (
    <div className="studio">
      <SiteNav />
      <main>
        <ScrollFilm />
        <GatewayHero />
        <LandingSections />
      </main>
      <SiteFooter />
    </div>
  );
}
