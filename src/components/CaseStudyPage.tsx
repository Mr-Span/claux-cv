import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import type { MouseEvent } from "react";
import { cases } from "../content/caseStudies";
import "../editorial.css";
import { sitePath } from "../sitePaths";

type CaseStudyPageProps = { slug: string; onNavigate: (path: string) => void };

function navigate(
  event: MouseEvent<HTMLAnchorElement>,
  path: string,
  onNavigate: CaseStudyPageProps["onNavigate"],
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

export function CaseStudyPage({ slug, onNavigate }: CaseStudyPageProps) {
  const project = cases.find((item) => item.slug === slug);
  if (!project) {
    return (
      <section
        className="atelier-editorial case-page case-page-missing"
        aria-labelledby="case-missing-title"
      >
        <h1 id="case-missing-title">Work not found.</h1>
        <p>Explore software, automation and autonomous systems.</p>
        <a
          className="case-back"
          href={sitePath("/#work")}
          onClick={(event) => navigate(event, "/#work", onNavigate)}
        >
          <ArrowLeft size={18} aria-hidden="true" /> Back to work
        </a>
      </section>
    );
  }

  const next = cases[(cases.indexOf(project) + 1) % cases.length];
  const nextPath = `/work/${next.slug}/`;

  return (
    <article
      className={`case-page case-page--${project.slug}`}
      aria-labelledby="case-title"
    >
      <div className="atelier-editorial case-intro">
        <a
          className="case-back"
          href={sitePath("/#work")}
          onClick={(event) => navigate(event, "/#work", onNavigate)}
        >
          <ArrowLeft size={18} aria-hidden="true" /> Back to work
        </a>
        <h1
          id="case-title"
          tabIndex={-1}
          style={{ viewTransitionName: `work-title-${project.slug}` }}
        >
          {project.title}
        </h1>
        <p className="case-summary">{project.summary}</p>
        <p className="case-role">{project.role}</p>
      </div>
      <figure
        className={`case-media work-row-media--${project.slug}`}
        style={{ viewTransitionName: `work-media-${project.slug}` }}
      >
        <img
          src={sitePath("/images/atelier.webp")}
          alt={project.mediaAlt}
          width={1536}
          height={1024}
          decoding="async"
        />
        <figcaption>Illustrative demo</figcaption>
      </figure>
      <div className="atelier-editorial case-content">
        <div className="case-narrative">
          <section aria-labelledby="case-problem-title">
            <h2 id="case-problem-title">Problem</h2>
            <p>{project.problem}</p>
          </section>
          <section aria-labelledby="case-contribution-title">
            <h2 id="case-contribution-title">My contribution</h2>
            <p>{project.contribution}</p>
          </section>
          <section aria-labelledby="case-approach-title">
            <h2 id="case-approach-title">Approach</h2>
            <p>{project.approach}</p>
            <ol className="case-steps">
              {project.steps.map((step, index) => (
                <li key={step}>
                  <span aria-hidden="true">0{index + 1}</span>
                  {step}
                </li>
              ))}
            </ol>
          </section>
          <section aria-labelledby="case-evidence-title">
            <h2 id="case-evidence-title">Evidence</h2>
            <p>{project.evidence}</p>
            <p className="case-evidence-label">{project.evidenceLabel}</p>
            <ul className="case-sources">
              {project.sources.map((source) => (
                <li key={source.href}>
                  <a href={source.href} target="_blank" rel="noreferrer">
                    {source.label}
                    <ArrowUpRight size={15} aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </div>
        <div className="case-outcome">
          <h2>What this work connects</h2>
          <p>{project.outcome}</p>
          <ul aria-label="Technology and engineering focus">
            {project.technologies.map((technology) => (
              <li key={technology}>{technology}</li>
            ))}
          </ul>
        </div>
        <div className="case-actions">
          <a
            className="case-external-link"
            href={project.externalLink.href}
            target="_blank"
            rel="noreferrer"
          >
            {project.externalLink.label}
            <ArrowUpRight size={18} aria-hidden="true" />
          </a>
          <a
            className="case-next-link"
            href={sitePath(nextPath)}
            onClick={(event) => navigate(event, nextPath, onNavigate)}
          >
            <span>Next work</span>
            {next.title}
            <ArrowRight size={20} aria-hidden="true" />
          </a>
        </div>
      </div>
    </article>
  );
}
