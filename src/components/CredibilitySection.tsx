import { Award, GraduationCap } from "lucide-react";
import { type ReactNode } from "react";
import { credentials, educationItems } from "../content/portfolio";
import { SectionHeading } from "./SectionHeading";

type CredibilitySectionProps = {
  children: ReactNode;
};

export function CredibilitySection({ children }: CredibilitySectionProps) {
  return (
    <section className="section closing-section" id="education" aria-labelledby="education-title">
      <div className="container">
        <SectionHeading
          id="education-title"
          index="04"
          title="Education, Development & Contact"
        />
        <div className="closing-grid">
          <div className="education-column">
            <p className="column-label">Education & continuing development</p>
            <div className="education-timeline">
              {educationItems.map((item) => (
                <article key={item.title}>
                  <p>{item.period}</p>
                  <span aria-hidden="true"><GraduationCap size={16} /></span>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.org}</p>
                  </div>
                </article>
              ))}
              {credentials.map((item) => (
                <article key={item}>
                  <p>Development</p>
                  <span aria-hidden="true"><Award size={16} /></span>
                  <div><h3>{item}</h3></div>
                </article>
              ))}
            </div>
            <p className="experience-commit">› learn.continuously();</p>
          </div>
          {children}
        </div>
      </div>
    </section>
  );
}
