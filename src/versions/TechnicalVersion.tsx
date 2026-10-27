import { ContactSection } from "../components/ContactSection";
import { CredibilitySection } from "../components/CredibilitySection";
import { ExperienceSection } from "../components/ExperienceSection";
import { HeroSection } from "../components/HeroSection";
import { ProjectsSection } from "../components/ProjectsSection";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";

export function TechnicalVersion() {
  return (
    <div className="site-shell technical-version">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <SiteHeader />
      <main id="main-content">
        <HeroSection />
        <ProjectsSection />
        <ExperienceSection />
        <CredibilitySection>
          <ContactSection />
        </CredibilitySection>
      </main>
      <SiteFooter />
    </div>
  );
}
