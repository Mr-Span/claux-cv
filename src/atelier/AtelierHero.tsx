import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
} from "react";
import { Pause, Play, RotateCcw, ArrowUpRight, Check } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { AtelierScene, type AtelierZone } from "./AtelierScene";
import { sitePath } from "../sitePaths";

gsap.registerPlugin(useGSAP);
const zones = ["automation", "code", "quadyx"] as const;
const copy = {
  automation: {
    title: "Automation",
    caption: "Robotic automation, from request to result.",
    heading: "From request\nto result.",
    steps: ["Request", "Validate", "Execute", "Verify", "Complete"],
    descriptions: [
      "A request enters the workflow.",
      "The request is checked before execution.",
      "The robot carries out the approved task.",
      "The result is checked against the request.",
      "A clear result, ready for the next step.",
    ],
    how: "Software coordinates the workflow. A robot makes the physical process visible. An exception pauses execution until you approve it.",
  },
  code: {
    title: "Code",
    caption: "Code that becomes working software.",
    heading: "An idea.\nWorking code.",
    steps: ["Input", "Build", "Render", "Test", "Ready"],
    descriptions: [
      "Start with a small, clear interaction.",
      "Turn the interaction into a component.",
      "See the interface take shape.",
      "Try the same handler in the live preview.",
      "A working interaction, ready to explore.",
    ],
    how: "The code reveals itself automatically. Test preview runs the displayed interaction in this page. No typing or setup is needed.",
  },
  quadyx: {
    title: "QUADYX",
    caption: "Drones that perceive, navigate and communicate.",
    heading: "See. Adapt.\nStay connected.",
    steps: ["Observe", "Depth", "Plan", "Navigate", "Communicate"],
    descriptions: [
      "The drone observes its surroundings.",
      "Depth information exposes an obstacle.",
      "A route is planned around the obstacle.",
      "The drone follows the adjusted route.",
      "The control station receives the updated state.",
    ],
    how: "An illustrative mission connects computer vision and depth, obstacle avoidance, software control and communication. Move the obstacle to update the scene and its route.",
  },
};

export function AtelierHero({
  zone,
  onZoneSelect,
  onNavigate,
}: {
  zone: AtelierZone;
  onZoneSelect: (zone: AtelierZone) => void;
  onNavigate: (path: string) => void;
}) {
  const scope = useRef<HTMLElement>(null);
  const [step, setStep] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [exception, setException] = useState<"none" | "review" | "approved">(
    "none",
  );
  const [codeTested, setCodeTested] = useState(false);
  const [obstacleIndex, setObstacleIndex] = useState(0);
  const [replayKey, setReplayKey] = useState(0);
  const [hovered, setHovered] = useState<AtelierZone | null>(null);
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);
  const [inView, setInView] = useState(true);
  const [visible, setVisible] = useState(true);
  const [sceneReady, setSceneReady] = useState(false);
  const sceneBecameReady = useCallback(() => setSceneReady(true), []);
  const active = copy[zone];
  const held = paused || exception === "review";
  const shownStep = reducedMotion ? 4 : step;
  const codeLines = [
    "function Preview() {",
    "  const [ready, setReady] =",
    "    useState(false);",
    "  return <button",
    "    onClick={() => setReady(true)}>",
    '    {ready ? "Ready" : "Test preview"}',
    "  </button>;",
    "}",
  ];

  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    const visibility = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", visibility);
    const observer = new IntersectionObserver(([entry]) =>
      setInView(entry.isIntersecting),
    );
    if (scope.current) observer.observe(scope.current);
    return () => {
      media.removeEventListener("change", update);
      document.removeEventListener("visibilitychange", visibility);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    setStep(0);
    setException("none");
    setCodeTested(false);
    setHoveredStep(null);
  }, [zone]);
  useEffect(() => {
    if (
      !sceneReady ||
      held ||
      reducedMotion ||
      !inView ||
      !visible ||
      step === 4
    )
      return;
    const timer = window.setTimeout(
      () => setStep((previous) => Math.min(previous + 1, 4)),
      1800,
    );
    return () => clearTimeout(timer);
  }, [zone, step, held, reducedMotion, inView, visible, replayKey, sceneReady]);

  useGSAP(
    () => {
      if (!reducedMotion)
        gsap.fromTo(
          ".demo-heading, .demo-explanation",
          { opacity: 0, y: 8 },
          { opacity: 1, y: 0, duration: 0.35, stagger: 0.04 },
        );
    },
    { scope, dependencies: [zone, reducedMotion], revertOnUpdate: true },
  );

  const replay = () => {
    setStep(0);
    setPaused(false);
    setException("none");
    setCodeTested(false);
    setObstacleIndex(0);
    setReplayKey((key) => key + 1);
  };
  const openWork = (event: MouseEvent<HTMLAnchorElement>) => {
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    )
      return;
    event.preventDefault();
    onNavigate(`/work/${zone}/`);
  };

  return (
    <section
      className="atelier-hero"
      ref={scope}
      aria-labelledby="hero-title"
      data-zone={zone}
      data-step={shownStep}
      data-paused={held}
    >
      <div className="atelier-main">
        <div className="hero-intro">
          <h1 id="hero-title">
            Systems in Motion<span>.</span>
          </h1>
          <p>Software. Automation. Autonomous systems.</p>
        </div>
        <div
          className="atelier-stage"
          aria-label="Interactive 3D workshop with a robot, coding console and drone"
        >
          <AtelierScene
            zone={zone}
            paused={held}
            reducedMotion={reducedMotion}
            exception={exception === "review"}
            obstacleIndex={obstacleIndex}
            codeTested={codeTested}
            replayKey={replayKey}
            onZoneSelect={onZoneSelect}
            onReady={sceneBecameReady}
          />
          <div className="scene-caption">
            <span className="live-dot" aria-hidden="true" />
            {hovered ? copy[hovered].caption : "Explore the atelier"}
          </div>
        </div>
        <div
          className="zone-selectors"
          role="group"
          aria-label="Choose a demonstration"
        >
          {zones.map((item) => (
            <button
              key={item}
              type="button"
              className={`zone-selector zone-selector--${item}`}
              aria-pressed={zone === item}
              onClick={() => onZoneSelect(item)}
              onMouseEnter={() => setHovered(item)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(item)}
              onBlur={() => setHovered(null)}
            >
              <span className="zone-mini" aria-hidden="true">
                {item === "code" ? (
                  <span className="mini-code">
                    {"{ }"}
                    <i />
                  </span>
                ) : (
                  <img
                    src={sitePath("/images/atelier.webp")}
                    alt=""
                    width={1536}
                    height={1024}
                  />
                )}
              </span>
              <span>
                <strong>{copy[item].title}</strong>
                <span className="zone-caption">{copy[item].caption}</span>
              </span>
              <span className="zone-arrow" aria-hidden="true">
                ↗
              </span>
            </button>
          ))}
        </div>
      </div>
      <aside
        className="demo-panel"
        aria-label={`${active.title} demonstration`}
      >
        <p className="demo-label">
          {active.title} <span>Interactive demo</span>
        </p>
        <h2 className="demo-heading">{active.heading}</h2>
        <ol className="demo-steps" aria-label="Demonstration stages">
          {active.steps.map((label, index) => (
            <li
              key={label}
              data-current={shownStep === index}
              data-complete={shownStep > index}
              aria-current={shownStep === index ? "step" : undefined}
            >
              <button
                type="button"
                onMouseEnter={() => setHoveredStep(index)}
                onMouseLeave={() => setHoveredStep(null)}
                onFocus={() => setHoveredStep(index)}
                onBlur={() => setHoveredStep(null)}
                onClick={() => setHoveredStep(index)}
              >
                <span aria-hidden="true">
                  {shownStep > index ? <Check size={12} /> : index + 1}
                </span>
                {label}
              </button>
            </li>
          ))}
        </ol>
        <p className="demo-explanation">
          {exception === "review"
            ? "A request reference is missing. The workflow is waiting for your review and approval."
            : exception === "approved"
              ? "Approved by you. The robot can complete the task."
              : hoveredStep !== null
                ? active.descriptions[hoveredStep]
                : codeTested && zone === "code"
                  ? "The preview reacted to your input."
                  : obstacleIndex > 0 && zone === "quadyx"
                    ? "Obstacle moved. Route updated; status received by the control station."
                    : active.descriptions[shownStep]}
        </p>
        {zone === "code" && (
          <div
            className="code-demonstration"
            data-highlighted={hoveredStep !== null}
          >
            <pre aria-label="Preview interaction code">
              <code>
                {codeLines
                  .slice(
                    0,
                    reducedMotion || hoveredStep !== null
                      ? 8
                      : Math.min(8, 2 + step * 2),
                  )
                  .map((line, index) => (
                    <span
                      key={index}
                      className={
                        hoveredStep !== null &&
                        ((hoveredStep < 2 && index < 3) ||
                          (hoveredStep === 2 && index >= 3) ||
                          (hoveredStep >= 3 && index === 4))
                          ? "code-line is-highlighted"
                          : "code-line"
                      }
                    >
                      {line}
                      {"\n"}
                    </span>
                  ))}
              </code>
            </pre>
            <div className="code-preview" role="status">
              <span
                className={
                  codeTested
                    ? "preview-indicator is-ready"
                    : "preview-indicator"
                }
              />
              {codeTested ? "Ready" : "Preview awaiting input"}
            </div>
          </div>
        )}
        {zone === "quadyx" && (
          <div className="station-readout" role="status">
            <span>Control station</span>
            <strong>
              {obstacleIndex > 0
                ? "Adjusted route received"
                : "Mission state received"}
            </strong>
            <span>Vision → Depth → Route → Station</span>
          </div>
        )}
        <div className="demo-actions">
          {zone === "automation" ? (
            exception === "review" ? (
              <button
                type="button"
                className="primary-action"
                onClick={() => {
                  setException("approved");
                  setStep(4);
                }}
              >
                Approve & continue <Check size={16} />
              </button>
            ) : (
              <button
                type="button"
                className="primary-action"
                onClick={() => {
                  setException("review");
                  setStep(3);
                }}
              >
                Trigger exception <ArrowUpRight size={16} />
              </button>
            )
          ) : zone === "code" ? (
            <button
              type="button"
              className="primary-action"
              onClick={() => {
                setCodeTested(true);
                setStep(4);
              }}
            >
              {codeTested ? "Ready" : "Test preview"}{" "}
              {codeTested ? <Check size={16} /> : <ArrowUpRight size={16} />}
            </button>
          ) : (
            <button
              type="button"
              className="primary-action"
              onClick={() => {
                setObstacleIndex((index) => index + 1);
                setStep(4);
              }}
            >
              Move obstacle <ArrowUpRight size={16} />
            </button>
          )}
          <details className="demo-how">
            <summary>
              How it works <span aria-hidden="true">+</span>
            </summary>
            <p>{active.how}</p>
          </details>
          <a
            className="secondary-action"
            href={sitePath(`/work/${zone}/`)}
            onClick={openWork}
          >
            View work <ArrowUpRight size={16} />
          </a>
        </div>
        <div className="playback-controls">
          <button
            type="button"
            onClick={() => setPaused((value) => !value)}
            aria-label={paused ? "Resume demonstration" : "Pause demonstration"}
            aria-pressed={paused}
          >
            {paused ? <Play size={15} /> : <Pause size={15} />}
            <span>{paused ? "Resume" : "Pause"}</span>
          </button>
          <button
            type="button"
            onClick={replay}
            aria-label="Replay demonstration"
          >
            <RotateCcw size={15} />
            <span>Replay</span>
          </button>
        </div>
        <p className="demo-note">
          {reducedMotion
            ? "Reduced motion: all stages stay readable."
            : "Illustrative processes. Explore the work for context."}
        </p>
      </aside>
    </section>
  );
}
