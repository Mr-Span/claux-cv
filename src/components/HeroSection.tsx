import { ArrowDownRight } from "lucide-react";
import { profile } from "../content/portfolio";

function TechnicalFocusPanel() {
  return (
    <aside className="technical-focus" aria-label="Engineering focus system map">
      <ul className="focus-list" aria-label="Focus areas">
        <li>Focus</li>
        <li>Automation</li>
        <li>AI systems</li>
        <li>Robotics</li>
        <li>Engineering</li>
      </ul>
      <svg className="focus-map" viewBox="0 0 620 470" aria-hidden="true">
        <g className="map-grid">
          <path d="M60 55V415M155 55V415M250 55V415M345 55V415M440 55V415M535 55V415" />
          <path d="M45 90H575M45 165H575M45 240H575M45 315H575M45 390H575" />
        </g>
        <g className="map-lines">
          <path d="M58 236H562M312 44V426" />
          <path d="M115 340V170H247V115" />
          <path d="M492 358V132H377" />
          <path d="M178 240C214 122 410 112 452 238C414 368 214 356 178 240Z" />
          <circle cx="314" cy="237" r="122" />
          <circle cx="314" cy="237" r="78" />
          <circle cx="314" cy="237" r="34" />
          <path d="M140 370L208 300L267 332L370 198L492 248" />
          <rect x="88" y="270" width="58" height="58" />
          <path d="M88 328L146 270M98 328L146 280M88 318L136 270" />
        </g>
        <g className="map-points">
          <circle cx="140" cy="370" r="5" />
          <circle cx="208" cy="300" r="5" />
          <circle cx="267" cy="332" r="5" />
          <circle cx="370" cy="198" r="5" />
          <circle cx="492" cy="248" r="5" />
          <circle cx="314" cy="115" r="5" />
        </g>
      </svg>
      <p className="focus-flow">// Design → Build → Operate → Evolve</p>
    </aside>
  );
}

export function HeroSection() {
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="container hero-grid">
        <div className="hero-copy">
          <p className="hero-code"><span>const</span> CLAUX = <span>engineer</span>();</p>
          <span className="hero-brace hero-brace-open" aria-hidden="true">{"{"}</span>
          <h1 id="hero-title">{profile.heroTitle}</h1>
          <span className="hero-brace hero-brace-close" aria-hidden="true">{"}"}</span>
          <div className="hero-actions">
            <a className="button button-primary" href="#systems">
              View capabilities
              <ArrowDownRight size={17} aria-hidden="true" />
            </a>
            <a className="button button-secondary" href="#contact">
              Start a conversation
              <ArrowDownRight size={17} aria-hidden="true" />
            </a>
          </div>
          <p className="hero-mode">$ systems_mode = <span>impact</span>;</p>
        </div>
        <TechnicalFocusPanel />
      </div>
    </section>
  );
}
