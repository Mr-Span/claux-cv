import {
  ArrowDown,
  ArrowLeft,
  ArrowUpRight,
  Box,
  CircuitBoard,
  HardDrive,
  Layers,
  Network,
  Server,
  Shield,
  Wrench,
} from "lucide-react";
import { useState, type ComponentType, type MouseEvent } from "react";
import {
  assemblyImages,
  workshopPhoto,
  workshopProjects,
  workshopSkills,
  type WorkshopImage,
  type WorkshopProject,
} from "../content/workshop";
import type { WorkshopModelViewerProps } from "./WorkshopModelViewer";
import "./workshop.css";
import { sitePath } from "../sitePaths";

type NavigationProps = { onNavigate: (path: string) => void };

function follow(
  event: MouseEvent<HTMLAnchorElement>,
  path: string,
  onNavigate: NavigationProps["onNavigate"],
) {
  if (
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.altKey ||
    event.shiftKey
  )
    return;
  event.preventDefault();
  onNavigate(path);
}

function Media({
  image,
  eager = false,
  className = "",
}: {
  image: WorkshopImage;
  eager?: boolean;
  className?: string;
}) {
  return (
    <figure className={`workshop-media ${className}`}>
      <div className="workshop-media-frame" data-framing={image.framing}>
        <img
          src={image.src}
          srcSet={image.srcSet}
          sizes="(max-width: 760px) 100vw, 55vw"
          alt={image.alt}
          width={image.width}
          height={image.height}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={eager ? "high" : undefined}
        />
      </div>
    </figure>
  );
}

export function WorkshopTeaser({ onNavigate }: NavigationProps) {
  return (
    <section
      className="workshop-teaser"
      id="workshop"
      aria-labelledby="workshop-teaser-title"
    >
      <div>
        <p className="workshop-eyebrow">
          Beyond the screen / Personal projects
        </p>
        <h2 id="workshop-teaser-title">
          Ideas take
          <br />
          physical shape.
        </h2>
        <p>
          Mechanical design, 3D printing, electronics and a growing HomeLab. A
          look inside the things I build for myself.
        </p>
        <a
          className="workshop-text-link"
          href={sitePath("/workshop/")}
          onClick={(event) => follow(event, "/workshop/", onNavigate)}
        >
          Inside the workshop <ArrowUpRight size={19} aria-hidden="true" />
        </a>
      </div>
      <figure>
        <img
          src={assemblyImages[1].src}
          alt={assemblyImages[1].alt}
          width={1400}
          height={1050}
          loading="lazy"
          decoding="async"
        />
        <figcaption>On the bench / CNC integration study B</figcaption>
      </figure>
    </section>
  );
}

function Status({ status }: { status: WorkshopProject["status"] }) {
  return (
    <div className="workshop-status" data-tone={status.tone}>
      <span>{status.label}</span>
    </div>
  );
}

function TechnicalDetails({ project }: { project: WorkshopProject }) {
  return (
    <details className="workshop-details">
      <summary>
        Technical details{" "}
        <span className="workshop-details-mark" aria-hidden="true">
          +
        </span>
        <span className="sr-only"> — {project.category}</span>
      </summary>
      <div className="workshop-details-grid">
        {project.details.map((detail) => (
          <section key={detail.title}>
            <h4>{detail.title}</h4>
            <p>{detail.body}</p>
          </section>
        ))}
        <section>
          <h4>Next</h4>
          <p>{project.next}</p>
        </section>
      </div>
      {project.viewer ? <ChainCredit /> : null}
    </details>
  );
}

function ChainCredit() {
  return (
    <p className="workshop-credit">
      Chain:{" "}
      <a
        href="https://www.thingiverse.com/thing:3668667"
        target="_blank"
        rel="noreferrer"
      >
        Sergiu_I / Thingiverse 3668667
      </a>
      ,{" "}
      <a
        href="https://creativecommons.org/licenses/by/4.0/"
        target="_blank"
        rel="noreferrer"
      >
        CC BY 4.0
      </a>
      . Unmodified geometry. My designs: enclosure, mounts and guides.
    </p>
  );
}

function ModelExplorer({
  config,
  images,
}: {
  config: NonNullable<WorkshopProject["viewer"]>;
  images: WorkshopImage[];
}) {
  const [open, setOpen] = useState(false);
  const [Viewer, setViewer] =
    useState<ComponentType<WorkshopModelViewerProps> | null>(null);
  const [moduleError, setModuleError] = useState(false);
  const [loadingModule, setLoadingModule] = useState(false);

  async function activate() {
    setOpen(true);
    setModuleError(false);
    if (Viewer || loadingModule) return;
    setLoadingModule(true);
    try {
      const module = await import("./WorkshopModelViewer");
      setViewer(() => module.WorkshopModelViewer);
    } catch {
      setModuleError(true);
    } finally {
      setLoadingModule(false);
    }
  }

  return (
    <section className="workshop-explorer" aria-label="CNC design views">
      <div className="workshop-explorer-heading">
        <span>CAD studies</span>
        <div className="workshop-explorer-action">
          <button
            className="workshop-button"
            type="button"
            aria-expanded={open}
            aria-controls="workshop-model-panel"
            onClick={() => {
              if (open) setOpen(false);
              else void activate();
            }}
          >
            <Box size={18} aria-hidden="true" />{" "}
            {open ? "Close 3D view" : "Explore in 3D"}
          </button>
        </div>
      </div>
      <noscript>
        <style>{".workshop-explorer-action { display: none; }"}</style>
      </noscript>
      <div className="workshop-gallery" hidden={open}>
        <fieldset className="workshop-gallery-controls">
          <legend className="sr-only">Mechanical design views</legend>
          {images.map((image, index) => (
            <label key={image.src}>
              <input
                type="radio"
                name="workshop-gallery-view"
                value={index}
                defaultChecked={index === 1}
              />
              <span>{image.label}</span>
            </label>
          ))}
        </fieldset>
        {images.map((image, index) => (
          <div
            className="workshop-gallery-panel"
            data-view={index}
            key={image.src}
          >
            <Media image={image} />
          </div>
        ))}
      </div>
      <div id="workshop-model-panel" hidden={!open}>
        {open && Viewer ? (
          <Viewer
            variants={config.variants}
            initialVariant={config.initialVariant}
          />
        ) : null}
        {open && !Viewer ? (
          <div className="workshop-module-message" role="status">
            {moduleError ? (
              <>
                <p>
                  3D could not load. Close this view to return to the images.
                </p>
                <button
                  type="button"
                  className="workshop-button workshop-button--outline"
                  onClick={() => void activate()}
                >
                  Try loading 3D again
                </button>
              </>
            ) : (
              <p>Preparing the 3D viewer…</p>
            )}
          </div>
        ) : null}
      </div>
    </section>
  );
}

function ProjectDiagram({
  kind,
}: {
  kind: NonNullable<WorkshopProject["diagram"]>;
}) {
  if (kind === "printing")
    return (
      <figure className="workshop-diagram workshop-printing-diagram">
        <div className="workshop-diagram-top">
          <Layers size={24} aria-hidden="true" />
          <span>Anycubic Mega S · PLA / PETG</span>
        </div>
        <ol className="workshop-process">
          {["Repair", "Calibrate", "Test the fit", "Refine"].map(
            (step, index) => (
              <li key={step}>
                <span aria-hidden="true">0{index + 1}</span>
                {step}
              </li>
            ),
          )}
        </ol>
      </figure>
    );
  if (kind === "iot")
    return (
      <figure className="workshop-diagram workshop-iot-diagram">
        <div className="workshop-diagram-top">
          <CircuitBoard size={24} aria-hidden="true" />
          <span>Prototype architecture</span>
        </div>
        <div className="workshop-device-pair">
          <div className="workshop-device">
            <CircuitBoard size={28} strokeWidth={1.2} aria-hidden="true" />
            <div>
              <strong>ESP32</strong>
            </div>
          </div>
          <div className="workshop-device">
            <Shield size={28} strokeWidth={1.2} aria-hidden="true" />
            <div>
              <strong>Home Assistant</strong>
            </div>
          </div>
        </div>
        <p className="workshop-diagram-footnote">
          <Box size={20} aria-hidden="true" /> 3D-printed housings &amp; mounts
        </p>
      </figure>
    );
  return (
    <figure className="workshop-diagram workshop-homelab-diagram">
      <div className="workshop-diagram-top">
        <Server size={24} aria-hidden="true" />
        <span>Ubuntu server · ready</span>
      </div>
      <p className="workshop-server-spec">Intel i5 · 16 GB RAM</p>
      <div className="workshop-storage">
        <HardDrive size={16} aria-hidden="true" /> 500 GB SSD + 1 TB HDD
      </div>
      <p className="workshop-services-label">Planned services</p>
      <ul className="workshop-services">
        <li>
          <Network size={19} aria-hidden="true" />
          <strong>n8n</strong>
        </li>
        <li>
          <HardDrive size={19} aria-hidden="true" />
          <strong>Personal cloud</strong>
        </li>
        <li>
          <Shield size={19} aria-hidden="true" />
          <strong>AdGuard</strong>
        </li>
      </ul>
    </figure>
  );
}

function Project({ project }: { project: WorkshopProject }) {
  return (
    <article
      className={`workshop-project workshop-project--${project.id}`}
      id={project.id}
      aria-labelledby={`${project.id}-title`}
    >
      <div className="workshop-project-heading">
        <span className="workshop-number">{project.number}</span>
        <p className="workshop-eyebrow">{project.category}</p>
      </div>
      <div className="workshop-project-grid">
        <div className="workshop-project-story">
          <h2 id={`${project.id}-title`}>{project.title}</h2>
          <p className="workshop-project-summary">{project.summary}</p>
          <Status status={project.status} />
        </div>
        <div className="workshop-project-visual">
          {project.viewer ? (
            <ModelExplorer config={project.viewer} images={project.images} />
          ) : project.diagram ? (
            <ProjectDiagram kind={project.diagram} />
          ) : (
            <Media image={project.images[0]} />
          )}
        </div>
      </div>
      <TechnicalDetails project={project} />
    </article>
  );
}

export function WorkshopPage({ onNavigate }: NavigationProps) {
  return (
    <div className="workshop-page">
      <div className="workshop-shell">
        <a
          className="workshop-back"
          href={sitePath("/#workshop")}
          onClick={(event) => follow(event, "/#workshop", onNavigate)}
        >
          <ArrowLeft size={16} aria-hidden="true" /> Back to portfolio
        </a>
        <section className="workshop-hero" aria-labelledby="workshop-title">
          <div className="workshop-hero-copy">
            <h1 id="workshop-title" data-route-heading tabIndex={-1}>
              Workshop
              <span>Design &amp; making.</span>
            </h1>
            <p className="workshop-hero-description">
              I connect software with things I can design, build and improve —
              from mechanical parts to electronics and home systems.
            </p>
            <a
              className="workshop-text-link"
              href="#mechanical-design"
              onClick={(event) =>
                follow(event, "/workshop/#mechanical-design", onNavigate)
              }
            >
              See what I’m building <ArrowDown size={18} aria-hidden="true" />
            </a>
          </div>
          <Media image={workshopPhoto} eager className="workshop-hero-photo" />
        </section>
        <nav className="workshop-index" aria-label="Workshop chapters">
          {workshopProjects.map((project) => (
            <a
              key={project.id}
              href={`#${project.id}`}
              onClick={(event) =>
                follow(event, `/workshop/#${project.id}`, onNavigate)
              }
            >
              <span>{project.number}</span>
              {project.category}
              <ArrowDown size={15} aria-hidden="true" />
            </a>
          ))}
        </nav>
        {workshopProjects.map((project) => (
          <Project key={project.id} project={project} />
        ))}
        <section
          className="workshop-skills"
          aria-labelledby="workshop-skills-title"
        >
          <h2 id="workshop-skills-title">Skills from the workshop.</h2>
          <div>
            {workshopSkills.map((skill, i) => (
              <article key={skill.title}>
                {i === 0 ? (
                  <Box size={25} aria-hidden="true" />
                ) : i === 1 ? (
                  <Wrench size={25} aria-hidden="true" />
                ) : (
                  <CircuitBoard size={25} aria-hidden="true" />
                )}
                <h3>{skill.title}</h3>
                <p>{skill.body}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
      <section
        className="workshop-contact"
        aria-labelledby="workshop-contact-title"
      >
        <div className="workshop-shell">
          <div>
            <h2 id="workshop-contact-title">
              Something to
              <br />
              build together?
            </h2>
          </div>
          <a
            className="workshop-text-link"
            href={sitePath("/#contact")}
            onClick={(event) => follow(event, "/#contact", onNavigate)}
          >
            Let’s talk <ArrowUpRight size={24} aria-hidden="true" />
          </a>
        </div>
      </section>
    </div>
  );
}
