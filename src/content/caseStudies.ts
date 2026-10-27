export type CaseStudySlug = "automation" | "code" | "quadyx";

export type CaseStudy = {
  slug: CaseStudySlug;
  index: string;
  title: string;
  summary: string;
  role: string;
  mediaAlt: string;
  problem: string;
  contribution: string;
  approach: string;
  outcome: string;
  evidence: string;
  evidenceLabel: string;
  externalLink: { label: string; href: string };
  sources: Array<{ label: string; href: string }>;
  technologies: string[];
  steps: string[];
};

export const cases: CaseStudy[] = [
  {
    slug: "automation",
    index: "01",
    title: "Enterprise automation",
    summary: "From operational needs to reliable workflows.",
    role: "Automation Engineer",
    mediaAlt:
      "A stylized robot in the CLAUX atelier, illustrating software automation.",
    problem:
      "A repeatable business process still needs clear rules, reliable integrations and a way to handle incomplete information. Automation has to fit the people who operate it.",
    contribution:
      "At Betfair Romania Development, I guide automation from stakeholder discovery and opportunity shaping through solution design, implementation, human review and production feedback.",
    approach:
      "Understand the operational need, define ownership and validation rules, connect the relevant systems, and make exceptions visible. Human review remains part of the workflow when information or a decision needs attention.",
    outcome:
      "Maintainable workflows that support day-to-day operations, with clear exception paths and people responsible for the critical decisions.",
    evidence:
      "My public professional profile provides the role context. The atelier demonstrates a request, validation, execution and human-review sequence using illustrative data. Client and employer implementation details remain private.",
    evidenceLabel: "Professional overview · Illustrative demo",
    externalLink: {
      label: "View professional profile",
      href: "https://ro.linkedin.com/in/claudiuspan",
    },
    sources: [
      {
        label: "Professional profile",
        href: "https://ro.linkedin.com/in/claudiuspan",
      },
    ],
    technologies: ["UiPath", "Python", "SQL", "REST APIs", "Agentic workflows"],
    steps: [
      "Understand the request",
      "Validate the data",
      "Execute the workflow",
      "Review exceptions",
    ],
  },
  {
    slug: "code",
    index: "02",
    title: "Web products & AI workspaces",
    summary: "Interfaces, tools and structured knowledge.",
    role: "Product Engineer",
    mediaAlt:
      "The coding console in the CLAUX atelier, illustrating interface development.",
    problem:
      "Complex software and scattered project knowledge need an interface people can understand. A useful product connects the visible experience with its data, tools and operating context.",
    contribution:
      "I build responsive web experiences and structure AI workspaces around project context, knowledge, tools and human ownership. My practice connects React and TypeScript interfaces with APIs, automation and clear review boundaries.",
    approach:
      "Start with a small, concrete requirement; build the interface and its behavior together; then verify the result in the browser. For AI workspaces, make context, permissions and the next reviewable action explicit.",
    outcome:
      "Usable interfaces and structured working environments that make software and project knowledge easier to understand, operate and improve.",
    evidence:
      "My GitHub profile links public work, including this portfolio's source. This overview brings together web-product and AI-workspace practice. The atelier's short coding interaction illustrates how a requirement becomes a component and a working preview.",
    evidenceLabel: "Public work · Interactive illustration",
    externalLink: {
      label: "Explore GitHub",
      href: "https://github.com/Mr-Span",
    },
    sources: [
      { label: "GitHub profile", href: "https://github.com/Mr-Span" },
      {
        label: "Portfolio source",
        href: "https://github.com/Mr-Span/claudiu-span-portfolio",
      },
    ],
    technologies: ["React", "TypeScript", "Vite", "REST APIs", "Codex", "MCP"],
    steps: [
      "Shape the requirement",
      "Build the component",
      "Connect the behavior",
      "Test the preview",
    ],
  },
  {
    slug: "quadyx",
    index: "03",
    title: "QUADYX",
    summary: "Perception, control and integration.",
    role: "Co-Founder / Robotics Engineer",
    mediaAlt:
      "A stylized mini drone in the CLAUX atelier, illustrating perception and navigation.",
    problem:
      "An autonomous drone has to perceive its surroundings, adapt its route around obstacles and communicate its state. Software, control and hardware need to work together as one system.",
    contribution:
      "As a QUADYX co-founder, I work across software, control and hardware/software integration. My involvement includes computer vision and depth for obstacle avoidance, alongside communication between the drone and its control station.",
    approach:
      "Connect perception and depth information with obstacle detection and navigation decisions. Carry those decisions through control and integration, while communicating relevant state to the control station.",
    outcome:
      "An integrated approach to perception, adaptive navigation and communication across the drone and its control station.",
    evidence:
      "QUADYX's public site presents the company, S1 platform and capabilities. The atelier explains my contribution through an illustrative obstacle-and-route interaction, with a corresponding control-station update.",
    evidenceLabel: "Public company overview · Illustrative demo",
    externalLink: { label: "Visit QUADYX", href: "https://quadyx.com/" },
    sources: [
      { label: "Team", href: "https://quadyx.com/team/" },
      { label: "S1 platform", href: "https://quadyx.com/our-drones/" },
      {
        label: "Public capabilities",
        href: "https://quadyx.com/core-capabilities/",
      },
    ],
    technologies: [
      "Computer vision",
      "Depth",
      "Python & C++",
      "Control",
      "Hardware integration",
    ],
    steps: [
      "Perceive the obstacle",
      "Update the route",
      "Adapt the movement",
      "Communicate the state",
    ],
  },
];
