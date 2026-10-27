import {
  Activity,
  Blocks,
  ClipboardCheck,
  FileText,
  LockKeyhole,
  SearchCheck,
} from "lucide-react";
import { experienceItems, principles } from "../content/portfolio";
import { SectionHeading } from "./SectionHeading";

const practiceIcons = [ClipboardCheck, Blocks, SearchCheck, Activity, LockKeyhole, FileText];

export function ExperienceSection() {
  return (
    <section className="section experience-section" id="experience" aria-labelledby="experience-title">
      <div className="container">
        <SectionHeading id="experience-title" index="03" title="Experience & Engineering Practice" />
        <div className="experience-practice-grid">
          <div className="experience-column">
            <p className="column-label">Experience</p>
            <div className="experience-timeline" aria-label="Professional experience">
              {experienceItems.map((item) => (
                <article className="experience-item" key={`${item.title}-${item.period}`}>
                  <div className="experience-date">{item.period}</div>
                  <div className="experience-dot" aria-hidden="true" />
                  <div className="experience-content">
                    <h3>{item.org}</h3>
                    <p className="experience-role">{item.title}</p>
                    <p>{item.body}</p>
                    <div className="experience-impact">
                      <span>Impact</span>
                      <p>{item.impact}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <p className="experience-commit">› experience.commit();</p>
          </div>

          <div className="practice-column" id="principles">
            <p className="column-label">Applied engineering</p>
            <h3 className="practice-heading">Real-world engineering practice</h3>
            <ol className="practice-list">
              {principles.map((principle, index) => {
                const Icon = practiceIcons[index];
                return (
                  <li key={principle.title}>
                    <span className="practice-number">0{index + 1}</span>
                    <Icon size={28} aria-hidden="true" />
                    <div>
                      <h4>{principle.title}</h4>
                      <p>{principle.body}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
            <p className="experience-commit">› practice.repeat();</p>
          </div>
        </div>
      </div>
    </section>
  );
}
