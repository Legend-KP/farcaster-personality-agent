import type { Metadata } from "next";
import { ContactForm } from "@/components/studio/ContactForm";
import { SiteFooter } from "@/components/studio/SiteFooter";
import { SiteNav } from "@/components/studio/SiteNav";
import { STUDIO_EMAIL } from "@/data/studio";

export const metadata: Metadata = {
  title: "Start a project",
  description: "Tell Emris about the game you want built. A studio with 10+ years making games.",
};

export default function ContactPage() {
  return (
    <div className="studio">
      <SiteNav variant="page" />
      <main className="page-shell">
        <section className="contact">
          <div className="terminal">
            <p className="kicker">The desk is open</p>
            <h1>Start a project.</h1>
            <div className="prose">
              <p>
                Tell us what you want people to play, and where the game is
                today. We read every note. If the work fits, we reply with a
                straight answer about scope.
              </p>
              <p>
                Or write directly to{" "}
                <a href={`mailto:${STUDIO_EMAIL}`}>{STUDIO_EMAIL}</a>.
              </p>
            </div>
            <ContactForm />
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
