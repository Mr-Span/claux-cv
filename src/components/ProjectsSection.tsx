import {
  ArrowRight,
  Bot,
  BrainCircuit,
  CodeXml,
  Radar,
} from "lucide-react";
import { systems, type SystemIcon } from "../content/portfolio";
import { SectionHeading } from "./SectionHeading";

const iconMap: Record<SystemIcon, typeof Bot> = {
  brain: BrainCircuit,
  bot: Bot,
  network: CodeXml,
  scan: Radar,
};

export function ProjectsSection() {
  return (
    <section className="section systems-section" id="systems" aria-labelledby="systems-title">
      <div className="container">
        <SectionHeading id="systems-title" index="02" title="Capabilities" />
        <div className="systems-matrix">
          {systems.map((system) => {
            const Icon = iconMap[system.icon];
            const content = (
              <>
                <span className="system-number">{system.index}</span>
                <span className="system-icon-wrap"><Icon size={34} aria-hidden="true" /></span>
                <div className="system-title-cell">
                  <h3>{system.title}</h3>
                  <p>{system.body}</p>
                </div>
                <dl className="system-cell">
                  <dt>Role</dt>
                  <dd>{system.role}</dd>
                </dl>
                <dl className="system-cell">
                  <dt>Outcome</dt>
                  <dd>{system.outcome}</dd>
                </dl>
                <dl className="system-cell system-tech">
                  <dt>Technology evidence</dt>
                  <dd>{system.tags.join(", ")}</dd>
                </dl>
                <span className="system-action" aria-hidden="true"><ArrowRight size={23} /></span>
              </>
            );

            return system.link ? (
              <a
                key={system.title}
                className="system-row"
                href={system.link}
                target="_blank"
                rel="noreferrer"
                aria-label={`${system.title}: ${system.linkLabel}`}
              >
                {content}
              </a>
            ) : (
              <article key={system.title} className="system-row">
                {content}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
