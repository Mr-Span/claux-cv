import { Github, Linkedin } from "lucide-react";
import { profile } from "../content/portfolio";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <a className="brand" href="#top" aria-label={`${profile.brand} home`}>
          <span className="claux-nameplate" aria-hidden="true">CLAUX</span>
        </a>

        <div className="header-signal">
          <span>// Engineering systems that endure</span>
          <span className="romania-signal" aria-label="Romania">
            <i /><i /><i />
          </span>
        </div>

        <nav className="header-social" aria-label="Social links">
          <a href={profile.linkedin} target="_blank" rel="noreferrer">
            LinkedIn <Linkedin size={15} aria-hidden="true" />
          </a>
          <a href={profile.github} target="_blank" rel="noreferrer">
            GitHub <Github size={15} aria-hidden="true" />
          </a>
        </nav>
      </div>
    </header>
  );
}
