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
  outcomeHeading?: string;
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
    summary: "Production AI summaries with human review.",
    role: "Automation Engineer",
    mediaAlt:
      "A stylized robot in the CLAUX atelier, illustrating software automation.",
    problem:
      "Customer-profile review involved collecting and checking information across three platforms and running eight Redshift scripts, alongside the existing process. The earlier workflow refreshed data twice a day. Reviewers needed current information and a summary in one place.",
    contribution:
      "I built the UiPath Studio Web review application with populated data, charts, reports and tables; two key RPA processes; Maestro orchestration; and LLM agent prompts, validations and tests. This production case is part of my wider delivery of 40+ distinct automation workflows, from stakeholder discovery and AS-IS/TO-BE design through implementation and hypercare.",
    approach:
      "RPA collects current information and LLM agents prepare summaries. Maestro coordinates the workflow, while Studio Web presents the data and summaries for an operator to check and approve. Customer PII is processed within the enterprise environment.",
    outcomeHeading: "Production outcome",
    outcome:
      "Approximately 70% less operator time spent collecting and verifying data, compared with the previous process across the three platforms, Redshift scripts and existing workflow. This is a reported operational result about manual effort. Reviewers receive current data instead of relying on two scheduled daily refreshes.",
    evidence:
      "The anonymized case study documents my contribution, the workflow and the scope of the reported result. Customer data, employer implementation details and production screenshots remain private. The atelier scene illustrates the review concept using demonstration data.",
    evidenceLabel: "Production case · Anonymized account · Illustrative scene",
    externalLink: {
      label: "Read the case study",
      href: "https://github.com/Mr-Span/Mr-Span/blob/main/case-studies/customer-profile-summarization.md",
    },
    sources: [
      {
        label: "Anonymized case study",
        href: "https://github.com/Mr-Span/Mr-Span/blob/main/case-studies/customer-profile-summarization.md",
      },
      {
        label: "Professional profile",
        href: "https://ro.linkedin.com/in/claudiuspan",
      },
    ],
    technologies: [
      "UiPath RPA",
      "Studio Web",
      "Maestro",
      "LLM agents",
      "Amazon Redshift",
      "Human-in-the-loop",
    ],
    steps: [
      "Collect current data",
      "Prepare AI summaries",
      "Review data and reports",
      "Approve the information",
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
        href: "https://github.com/Mr-Span/claux-cv",
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
