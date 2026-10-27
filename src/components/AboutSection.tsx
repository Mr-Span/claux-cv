import {
  credentials,
  educationItems,
  experienceItems,
  profile,
} from "../content/portfolio";
import { ClauxTrademark } from "./ClauxTrademark";
import { ContactSection } from "./ContactSection";
import "../editorial.css";
import { sitePath } from "../sitePaths";

const currentExperience = experienceItems.filter((item) =>
  item.period.endsWith("Present"),
);
const earlierExperience = experienceItems.filter(
  (item) => !item.period.endsWith("Present"),
);

export function AboutSection() {
  return (
    <section
      className="atelier-editorial maker-about"
      id="about"
      aria-labelledby="about-title"
    >
      <div className="maker-about-profile">
        <h2 id="about-title">
          Engineering
          <br />
          across boundaries<span>.</span>
        </h2>
        <p className="maker-about-name">{profile.name}</p>
        <p className="maker-about-description">
          I connect software, automation and robotics to turn complex problems
          into working systems.
        </p>
        <div className="maker-about-background">
          <section aria-labelledby="maker-experience-title">
            <h3 id="maker-experience-title">Experience</h3>
            {currentExperience.map((item) => (
              <article
                className="maker-about-role"
                key={`${item.title}-${item.period}`}
              >
                <h4>{item.title}</h4>
                <p>{item.org}</p>
                <p className="maker-about-period">{item.period}</p>
              </article>
            ))}
          </section>
          <section aria-labelledby="maker-education-title">
            <h3 id="maker-education-title">Education</h3>
            {educationItems.map((item) => (
              <article className="maker-about-role" key={item.title}>
                <h4>{item.title}</h4>
                <p>{item.org}</p>
                <p className="maker-about-period">{item.period}</p>
              </article>
            ))}
          </section>
        </div>
        <figure className="maker-about-artifact">
          <img
            src={sitePath("/images/maker-surface.webp")}
            alt="A matte terracotta maker surface with warm directional light."
            loading="lazy"
            decoding="async"
            width={1536}
            height={512}
          />
          <figcaption>
            <ClauxTrademark decorative />{" "}
            <span>Software. Automation. Autonomous systems.</span>
          </figcaption>
        </figure>
        <details className="maker-about-history">
          <summary>Earlier experience & continuing development</summary>
          <div>
            {earlierExperience.map((item) => (
              <article
                className="maker-about-role"
                key={`${item.title}-${item.period}`}
              >
                <h4>{item.title}</h4>
                <p>
                  {item.org} · {item.period}
                </p>
                <p className="maker-about-history-body">{item.body}</p>
              </article>
            ))}
            <h3>Continuing development</h3>
            <ul>
              {credentials.map((credential) => (
                <li key={credential}>{credential}</li>
              ))}
            </ul>
          </div>
        </details>
      </div>
      <ContactSection />
    </section>
  );
}
