import { sitePath } from "../sitePaths";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Award,
  Bot,
  BrainCircuit,
  CheckCircle2,
  CircuitBoard,
  Clipboard,
  CodeXml,
  Github,
  GraduationCap,
  Linkedin,
  Mail,
  Radar,
  Send,
} from "lucide-react";
import { useState, type FormEvent } from "react";
import {
  credentials,
  educationItems,
  experienceItems,
  principles,
  profile,
  proofItems,
  systems,
  type SystemIcon,
} from "../content/portfolio";

const previousNavItems = [
  { label: "Profile", href: "#previous-profile" },
  { label: "Capabilities", href: "#previous-systems" },
  { label: "Experience", href: "#previous-experience" },
  { label: "Practice", href: "#previous-principles" },
  { label: "Education", href: "#previous-education" },
  { label: "Contact", href: "#previous-contact" },
];

const previousIconMap: Record<SystemIcon, typeof Bot> = {
  brain: BrainCircuit,
  bot: Bot,
  network: CodeXml,
  scan: Radar,
};

function PreviousHeader() {
  return (
    <header className="previous-header">
      <div className="previous-container previous-header-inner">
        <a className="previous-brand" href="#previous-top" aria-label="CLAUX home">
          <span className="claux-nameplate" aria-hidden="true">CLAUX</span>
        </a>
        <nav aria-label="Previous version navigation">
          {previousNavItems.map((item) => (
            <a key={item.href} href={item.href}>{item.label}</a>
          ))}
        </nav>
        <a className="previous-header-cta" href="#previous-contact">
          Start a conversation <ArrowDownRight size={15} aria-hidden="true" />
        </a>
      </div>
    </header>
  );
}

function PreviousHero() {
  return (
    <section className="previous-hero" id="previous-top" aria-labelledby="previous-hero-title">
      <div className="previous-container previous-hero-grid">
        <div className="previous-hero-copy">
          <span className="previous-romanian-rail" aria-hidden="true"><i /><i /><i /></span>
          <h1 id="previous-hero-title">I build systems that observe, decide, and deliver.</h1>
          <p>{profile.heroDescription}</p>
          <div className="previous-hero-actions">
            <a className="previous-button previous-button-primary" href="#previous-systems">
              View selected work <ArrowDownRight size={16} aria-hidden="true" />
            </a>
            <a className="previous-button" href="#previous-contact">
              Start a conversation <ArrowDownRight size={16} aria-hidden="true" />
            </a>
          </div>
          <div className="previous-hero-meta">
            <span className="previous-romania"><i /><i /><i /> Romania</span>
            <a href={profile.linkedin} target="_blank" rel="noreferrer"><Linkedin size={15} /> LinkedIn <ArrowUpRight size={13} /></a>
            <a href={profile.github} target="_blank" rel="noreferrer"><Github size={15} /> GitHub <ArrowUpRight size={13} /></a>
          </div>
        </div>
        <figure className="previous-portrait">
          <div>
            <img src={sitePath("/assets/claudiu-span-profile.png")} alt={profile.name} width="520" height="520" />
            <span className="previous-portrait-orbit" aria-hidden="true" />
          </div>
          <figcaption><span>{profile.name} / Betfair Romania Development</span><a href={profile.quadyx}>Co-Founder, QUADYX <ArrowUpRight size={12} /></a></figcaption>
        </figure>
      </div>
    </section>
  );
}

function PreviousHeading({ index, title, description, id }: { index: string; title: string; description: string; id: string }) {
  return (
    <div className="previous-heading">
      <span>{index}</span>
      <div><h2 id={id}>{title}</h2><p>{description}</p></div>
    </div>
  );
}

function PreviousProfile() {
  return (
    <section className="previous-section previous-profile" id="previous-profile" aria-labelledby="previous-profile-title">
      <div className="previous-container previous-profile-grid">
        <PreviousHeading index="01" id="previous-profile-title" title="Profile" description="Engineering useful systems across software, operations, and the physical world." />
        <div className="previous-profile-body">
          <p>{profile.profileDescription}</p>
          <dl>{proofItems.map((item) => <div key={item.label}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}</dl>
          <p className="previous-note"><CircuitBoard size={16} /> Qualification builds trust; operational proof sustains it.</p>
        </div>
      </div>
    </section>
  );
}

function PreviousCapabilities() {
  return (
    <section className="previous-section previous-capabilities" id="previous-systems" aria-labelledby="previous-systems-title">
      <div className="previous-container">
        <PreviousHeading index="02" id="previous-systems-title" title="Capabilities" description="Four engineering practices spanning stakeholder-led automation, knowledge systems, web products, and resilient autonomy." />
        <div className="previous-system-list">
          {systems.map((system) => {
            const Icon = previousIconMap[system.icon];
            return (
              <article className="previous-system-row" key={system.title}>
                <span>{system.index}</span><Icon size={24} aria-hidden="true" />
                <div className="previous-system-copy"><p>{system.type}</p><h3>{system.title}</h3><p>{system.body}</p>
                  <dl><div><dt>Role</dt><dd>{system.role}</dd></div><div><dt>Outcome</dt><dd>{system.outcome}</dd></div></dl>
                  <ul>{system.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>
                </div>
                {system.link ? <a href={system.link} target="_blank" rel="noreferrer">{system.linkLabel}<ArrowUpRight size={16} /></a> : <span className="previous-availability">{system.availability}</span>}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function PreviousExperience() {
  return (
    <section className="previous-section previous-experience" id="previous-experience" aria-labelledby="previous-experience-title">
      <div className="previous-container previous-section-grid">
        <PreviousHeading index="03" id="previous-experience-title" title="Experience & Applied Engineering" description="Professional progression shown through responsibility, engineering contribution, and operational value." />
        <div className="previous-timeline">
          {experienceItems.map((item) => (
            <article key={`${item.title}-${item.period}`}>
              <p>{item.period}</p><h3>{item.title}</h3><strong>{item.org}</strong><p>{item.body}</p>
              <div><span>Contribution<p>{item.contribution}</p></span><span>Operational value<p>{item.impact}</p></span></div>
              <ul>{item.skills.map((skill) => <li key={skill}><CheckCircle2 size={13} />{skill}</li>)}</ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function PreviousPractice() {
  return (
    <section className="previous-section previous-practice" id="previous-principles" aria-labelledby="previous-principles-title">
      <div className="previous-container previous-section-grid">
        <PreviousHeading index="04" id="previous-principles-title" title="Real-World Engineering Practice" description="The disciplines that turn an implementation into a credible, supportable, and safe operating system." />
        <ol>{principles.map((item, index) => <li key={item.title}><span>0{index + 1}</span><h3>{item.title}</h3><p>{item.body}</p><ArrowRight size={18} /></li>)}</ol>
      </div>
    </section>
  );
}

function PreviousEducation() {
  return (
    <section className="previous-section previous-education" id="previous-education" aria-labelledby="previous-education-title">
      <div className="previous-container previous-education-grid">
        <PreviousHeading index="05" id="previous-education-title" title="Education & Continuing Development" description="Academic engineering foundations reinforced by focused development in AI, machine learning, and Python." />
        <div className="previous-education-body">
          <div>{educationItems.map((item) => <article key={item.title}><GraduationCap size={20} /><div><p>{item.period}</p><h3>{item.title}</h3><span>{item.org}</span></div></article>)}</div>
          <ul>{credentials.map((item) => <li key={item}><Award size={18} />{item}<CheckCircle2 size={16} /></li>)}</ul>
        </div>
      </div>
    </section>
  );
}

function PreviousContact() {
  const [interest, setInterest] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("Nothing is transmitted or stored by this website.");
  const brief = `Hello Claudiu, I'm ${name.trim() || "reaching out"} about ${interest.toLowerCase() || "a potential project"}.\n\n${message.trim()}`;

  const copyBrief = async (event: FormEvent) => {
    event.preventDefault();
    if (!interest || message.trim().length < 12) return;
    try { await navigator.clipboard.writeText(brief); setStatus("Brief copied. Paste it into your LinkedIn message."); }
    catch { setStatus("Clipboard access was blocked. Select and copy the brief manually."); }
  };

  const copyEmail = async () => {
    try { await navigator.clipboard.writeText(window.atob("Y2xhdXhzcGFuMjAwMkBnbWFpbC5jb20=")); setStatus("Private email copied to your clipboard."); }
    catch { setStatus("Clipboard access was blocked. Use LinkedIn instead."); }
  };

  return (
    <section className="previous-contact" id="previous-contact" aria-labelledby="previous-contact-title">
      <div className="previous-container previous-contact-grid">
        <div><PreviousHeading index="06" id="previous-contact-title" title="Build the brief" description="Shape a useful first message, continue on LinkedIn, or reveal a private email route only when you need it." />
          <p>Start with the system, constraint, or opportunity.</p>
          <div className="previous-contact-links"><a href={profile.linkedin} target="_blank" rel="noreferrer"><Linkedin size={16} /> LinkedIn</a><button type="button" onClick={copyEmail}><Mail size={16} /> Private email</button></div>
        </div>
        <form onSubmit={copyBrief}>
          <fieldset><legend>What should we discuss?</legend><div>{["Enterprise automation", "AI workspaces", "Web product", "Autonomous systems"].map((item) => <label key={item}><input type="radio" name="previous-interest" value={item} checked={interest === item} onChange={() => setInterest(item)} /><span>{item}</span></label>)}</div></fieldset>
          <label>Your name <span>Optional</span><input value={name} onChange={(event) => setName(event.target.value)} placeholder="How should I address you?" autoComplete="name" /></label>
          <label>The brief <span>Minimum 12 characters</span><textarea value={message} onChange={(event) => setMessage(event.target.value)} minLength={12} rows={4} required placeholder="What are you building, improving, or trying to understand?" /></label>
          <button type="submit" disabled={!interest || message.trim().length < 12}><Send size={17} /> Copy brief <Clipboard size={15} /></button>
          <p role="status">{status}</p>
        </form>
      </div>
    </section>
  );
}

function PreviousFooter() {
  return <footer className="previous-footer"><div className="previous-container"><a href="#previous-top" className="previous-brand" aria-label="CLAUX home"><span className="claux-nameplate" aria-hidden="true">CLAUX</span></a><p>{profile.role}</p><div><a href={profile.linkedin}>LinkedIn</a><a href={profile.github}>GitHub</a></div><span className="previous-romania"><i /><i /><i /> Romania</span></div></footer>;
}

export function PreviousVersion() {
  return (
    <div className="previous-version">
      <a className="previous-skip" href="#previous-main">Skip to main content</a>
      <PreviousHeader />
      <main id="previous-main">
        <PreviousHero />
        <PreviousProfile />
        <PreviousCapabilities />
        <PreviousExperience />
        <PreviousPractice />
        <PreviousEducation />
        <PreviousContact />
      </main>
      <PreviousFooter />
    </div>
  );
}
