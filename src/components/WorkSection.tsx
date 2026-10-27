import { ArrowRight } from "lucide-react";
import type { MouseEvent } from "react";
import { cases } from "../content/caseStudies";
import "../editorial.css";
import { sitePath } from "../sitePaths";

type WorkSectionProps = { onNavigate: (path: string) => void };

function navigate(
  event: MouseEvent<HTMLAnchorElement>,
  path: string,
  onNavigate: WorkSectionProps["onNavigate"],
) {
  if (
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  )
    return;
  event.preventDefault();
  onNavigate(path);
}

export function WorkSection({ onNavigate }: WorkSectionProps) {
  return (
    <section
      className="atelier-editorial work-section"
      id="work"
      aria-labelledby="work-title"
    >
      <div className="work-section-heading">
        <div>
          <h2 id="work-title">Selected work</h2>
          <p>Software, workflows and autonomous systems.</p>
        </div>
      </div>
      <div className="work-rows">
        {cases.map((project) => {
          const path = `/work/${project.slug}/`;
          return (
            <article
              className={`work-row work-row--${project.slug}`}
              key={project.slug}
              id={`work-${project.slug}`}
            >
              <span className="work-row-index" aria-hidden="true">
                {project.index}
              </span>
              <div className="work-row-intro">
                <h3
                  style={{ viewTransitionName: `work-title-${project.slug}` }}
                >
                  {project.title}
                </h3>
                <p className="work-row-summary">{project.summary}</p>
                <dl className="work-row-role">
                  <dt>Role</dt>
                  <dd>{project.role}</dd>
                </dl>
                <a
                  className="work-row-link"
                  href={sitePath(path)}
                  onClick={(event) => navigate(event, path, onNavigate)}
                  aria-label={`Explore project — ${project.title}`}
                >
                  Explore project <ArrowRight size={17} aria-hidden="true" />
                </a>
              </div>
              <a
                className={`work-row-media work-row-media--${project.slug}`}
                href={sitePath(path)}
                onClick={(event) => navigate(event, path, onNavigate)}
                aria-label={`Open ${project.title}`}
                style={{ viewTransitionName: `work-media-${project.slug}` }}
              >
                <img
                  src={sitePath("/images/atelier.webp")}
                  alt={project.mediaAlt}
                  loading="lazy"
                  decoding="async"
                  width={1536}
                  height={1024}
                />
              </a>
            </article>
          );
        })}
      </div>
    </section>
  );
}
