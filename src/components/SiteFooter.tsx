import { Github, Linkedin } from "lucide-react";
import { profile } from "../content/portfolio";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <a className="footer-brand" href="#top" aria-label="CLAUX home">
          <span className="claux-nameplate" aria-hidden="true">CLAUX</span>
        </a>
        <p>© {new Date().getFullYear()} CLAUX. All rights reserved.</p>
        <p className="footer-mode">› systems_mode = <span>impact</span>;</p>
        <nav aria-label="Footer social links">
          <a href={profile.linkedin} target="_blank" rel="noreferrer">
            LinkedIn <Linkedin size={15} aria-hidden="true" />
          </a>
          <a href={profile.github} target="_blank" rel="noreferrer">
            GitHub <Github size={15} aria-hidden="true" />
          </a>
        </nav>
      </div>
    </footer>
  );
}
