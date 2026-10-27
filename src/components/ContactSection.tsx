import {
  ArrowUpRight,
  Check,
  Clipboard,
  Linkedin,
  Mail,
  Send,
} from "lucide-react";
import { useState, type FormEvent } from "react";
import { profile } from "../content/portfolio";

const interests = [
  "Enterprise automation",
  "AI workspaces",
  "Web product",
  "Autonomous systems",
  "Role or collaboration",
];

export function ContactSection() {
  const [interest, setInterest] = useState("");
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [status, setStatus] = useState<"idle" | "ready" | "fallback">("idle");
  const [emailStatus, setEmailStatus] = useState<"idle" | "copied" | "blocked">(
    "idle",
  );

  const brief = `Hello Claudiu, I'm ${name.trim() || "reaching out"}${company.trim() ? ` from ${company.trim()}` : ""} about ${interest.toLowerCase() || "a potential project"}.\n\n${message.trim()}`;

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!interest || message.trim().length < 12) return;
    try {
      await navigator.clipboard.writeText(brief);
      setStatus("ready");
    } catch {
      setStatus("fallback");
    }
  };

  const copyPrivateEmail = async () => {
    try {
      await navigator.clipboard.writeText(
        window.atob("Y2xhdXhzcGFuMjAwMkBnbWFpbC5jb20="),
      );
      setEmailStatus("copied");
    } catch {
      setEmailStatus("blocked");
    }
  };

  return (
    <aside
      className="contact-panel"
      id="contact"
      aria-labelledby="contact-title"
    >
      <div className="panel-corner panel-corner-tl" aria-hidden="true" />
      <div className="panel-corner panel-corner-tr" aria-hidden="true" />
      <h2 id="contact-title">Contact</h2>
      <p>Let’s build systems that matter.</p>

      <form className={status === "ready" ? "is-ready" : ""} onSubmit={submit}>
        <div className="contact-fields-row">
          <label>
            <span>Your name</span>
            <input
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                setStatus("idle");
              }}
              autoComplete="name"
              placeholder="Your name"
            />
          </label>
          <label>
            <span>Company or organisation</span>
            <input
              value={company}
              onChange={(event) => {
                setCompany(event.target.value);
                setStatus("idle");
              }}
              autoComplete="organization"
              placeholder="Company / Organisation"
            />
          </label>
        </div>
        <label>
          <span>Project type or focus</span>
          <select
            value={interest}
            onChange={(event) => {
              setInterest(event.target.value);
              setStatus("idle");
            }}
            required
          >
            <option value="">Project type / Focus</option>
            {interests.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <label>
          <span>Project brief</span>
          <textarea
            value={message}
            onChange={(event) => {
              setMessage(event.target.value);
              setStatus("idle");
            }}
            minLength={12}
            required
            rows={5}
            placeholder="Tell me about your project or challenge"
          />
        </label>
        {status === "fallback" ? (
          <label>
            <span>Generated brief — select to copy manually</span>
            <textarea
              value={brief}
              readOnly
              rows={5}
              onFocus={(event) => event.currentTarget.select()}
            />
          </label>
        ) : null}
        {status === "ready" ? (
          <a
            className="contact-submit"
            href={profile.linkedin}
            target="_blank"
            rel="noreferrer"
          >
            <Check size={17} aria-hidden="true" /> Open LinkedIn and paste brief
            <ArrowUpRight size={15} aria-hidden="true" />
          </a>
        ) : (
          <button
            className="contact-submit"
            type="submit"
            disabled={!interest || message.trim().length < 12}
          >
            <Send size={17} aria-hidden="true" /> Copy brief{" "}
            <Clipboard size={15} aria-hidden="true" />
          </button>
        )}
      </form>

      <div className="contact-privacy">
        <p role="status">
          {status === "ready"
            ? "Brief copied. No message was transmitted."
            : status === "fallback"
              ? "Clipboard access was blocked. Copy the generated brief manually."
              : "Nothing is transmitted or stored by this website."}
        </p>
        <div>
          <a href={profile.linkedin} target="_blank" rel="noreferrer">
            <Linkedin size={15} aria-hidden="true" /> LinkedIn
          </a>
          <button type="button" onClick={copyPrivateEmail}>
            <Mail size={15} aria-hidden="true" />
            {emailStatus === "copied"
              ? "Email copied"
              : emailStatus === "blocked"
                ? "Use LinkedIn"
                : "Private email"}
          </button>
        </div>
      </div>
    </aside>
  );
}
