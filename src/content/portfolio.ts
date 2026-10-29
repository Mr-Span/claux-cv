export const profile = {
  brand: "CLAUX",
  name: "Claudiu Șpan",
  role: "Applied AI & Automation Engineer",
  location: "Romania",
  linkedin: "https://ro.linkedin.com/in/claudiuspan",
  github: "https://github.com/Mr-Span",
  quadyx: "https://quadyx.com/team/",
  heroTitle: "I build systems that understand, automate, and endure.",
  heroDescription:
    "Automation Engineer at Betfair Romania Development and Co-Founder at QUADYX, building dependable systems across enterprise automation, AI workspaces, web products, and autonomous robotics.",
  profileDescription:
    "I work from stakeholder need to production reality: understand the constraint, guide the right automation decision, build the system, verify it, and improve it with the people who operate it.",
};

export const navItems = [
  { label: "Capabilities", href: "#systems" },
  { label: "Experience", href: "#experience" },
  { label: "Education", href: "#education" },
  { label: "Contact", href: "#contact" },
];

export const proofItems = [
  {
    label: "Automation impact",
    value: "40+ distinct workflows delivered end to end",
  },
  { label: "Current role", value: "Automation Engineer at Betfair" },
  { label: "Venture", value: "Co-Founder at QUADYX" },
  {
    label: "Engineering base",
    value: "Romanian-built software and autonomous systems",
  },
];

export const experienceItems = [
  {
    period: "Nov 2025 - Present",
    title: "Automation Engineer",
    org: "Betfair Romania Development",
    body: "Guide enterprise automation from stakeholder discovery and opportunity shaping through implementation, human review, and production feedback.",
    contribution:
      "Translate operational needs into governed automation and agentic workflows with clear ownership, exception paths, and review gates.",
    impact:
      "Help teams select valuable opportunities, reduce repetitive work, and operate automation with greater confidence.",
    skills: [
      "Stakeholder discovery",
      "Solution design",
      "Agentic automation",
      "Production delivery",
    ],
  },
  {
    period: "Feb 2024 - Oct 2025",
    title: "Associate Automation Engineer",
    org: "Betfair Romania Development",
    body: "Designed and improved automation workflows across business operations, system integrations, and exception handling.",
    contribution:
      "Converted process requirements into maintainable workflows, integration logic, validation rules, and supportable operating procedures.",
    impact:
      "Improved reliability and reduced manual effort while keeping business owners involved in critical decisions.",
    skills: ["Requirements", "Workflow engineering", "REST APIs", "Validation"],
  },
  {
    period: "Mar 2022 - Jan 2024",
    title: "RPA Maintenance and Optimisation Executive",
    org: "Betfair Romania Development",
    body: "Maintained and optimized production automations with a focus on stability, supportability, and measurable improvement.",
    contribution:
      "Investigated failures, improved exception paths, documented operational knowledge, and supported continuous improvement.",
    impact:
      "Protected production continuity and helped existing automations remain useful after launch.",
    skills: [
      "Production support",
      "Root-cause analysis",
      "Optimisation",
      "Documentation",
    ],
  },
  {
    period: "Aug 2025 - Present",
    title: "Co-Founder — Robotics Engineer",
    org: "QUADYX",
    body: "Developing Romanian autonomous robotics capabilities spanning perception, navigation, anti-spoofing, anti-jamming, and resilient operation.",
    contribution:
      "Connect robotics software, visual AI, navigation logic, sensors, and hardware into testable autonomous-system prototypes.",
    impact:
      "Advance public Romanian engineering work on autonomy that can operate in complex and disrupted environments.",
    skills: ["ROS 2", "Python and C++", "Visual AI", "Hardware integration"],
  },
];

export const educationItems = [
  {
    period: "2024 - Present",
    title: "MSc Research, Cyber-Physical Systems",
    org: "Technical University of Cluj-Napoca",
  },
  {
    period: "2020 - 2024",
    title: "BSc Robotics, Mechatronics and Automation",
    org: "Technical University of Cluj-Napoca",
  },
];

export type SystemIcon = "brain" | "bot" | "network" | "scan";

export const systems: Array<{
  index: string;
  title: string;
  type: string;
  icon: SystemIcon;
  body: string;
  role: string;
  outcome: string;
  tags: string[];
  link?: string;
  linkLabel?: string;
  availability: string;
}> = [
  {
    index: "01",
    title: "Enterprise Automation & Process Engineering",
    type: "Discover → advise → build",
    icon: "bot",
    body: "Understand stakeholder needs, identify the right opportunities, design the solution, build it, and support it in production.",
    role: "Automation Engineer / Solution Partner",
    outcome:
      "40+ distinct workflows delivered from stakeholder discovery and AS-IS/TO-BE design through implementation and hypercare.",
    tags: ["UiPath", "Python", "SQL", "REST APIs", "LLM agents", "n8n"],
    availability: "Private implementation — public overview",
  },
  {
    index: "02",
    title: "AI Workspaces & Knowledge Systems",
    type: "Structure knowledge and execution",
    icon: "brain",
    body: "Design structured AI environments that connect project context, tools, knowledge, bounded agents, privacy rules, and human ownership.",
    role: "AI Workspace & Knowledge Architect",
    outcome:
      "Reusable knowledge and traceable execution through Codex, MCP, Obsidian, SecondBrain, and review gates.",
    tags: ["Codex", "GPT", "MCP", "Obsidian", "SecondBrain", "CLI validation"],
    link: "https://github.com/Mr-Span",
    linkLabel: "View GitHub profile",
    availability: "Public work",
  },
  {
    index: "03",
    title: "Websites, Web Apps & Web Products",
    type: "Design and ship usable software",
    icon: "network",
    body: "Build responsive digital products that make complex systems easier to use, understand, operate, and improve.",
    role: "Product Engineer",
    outcome:
      "Web experiences that connect interface, APIs, data, automation, accessibility, and browser-verified delivery.",
    tags: ["React", "TypeScript", "Vite", "Next.js", "Responsive CSS", "Browser QA"],
    availability: "Public and in-development work",
  },
  {
    index: "04",
    title: "Autonomous Robotics & Resilient Navigation",
    type: "Perceive → navigate → resist disruption",
    icon: "scan",
    body: "Engineer navigation, perception, anti-spoofing, anti-jamming, and hardware/software integration for resilient autonomous missions.",
    role: "Co-Founder — Robotics Engineer",
    outcome:
      "Romanian-built navigation and perception capabilities for complex, GPS-denied, and disrupted environments.",
    tags: ["ROS 2", "Python", "C++", "Machine Learning", "Visual AI", "Hardware"],
    link: "https://quadyx.com/",
    linkLabel: "Visit QUADYX",
    availability: "Public company overview",
  },
];

export const principles = [
  {
    title: "Requirements before implementation",
    body: "Define the operational problem, stakeholders, constraints, acceptance criteria, and ownership before selecting a tool or writing code.",
  },
  {
    title: "Systems thinking across boundaries",
    body: "Design for interactions between people, software, data, hardware, failure modes, and the environment—not isolated components.",
  },
  {
    title: "Verification before trust",
    body: "Test early, validate failure paths, and verify the system in conditions that reflect how it will actually be operated.",
  },
  {
    title: "Observable operations",
    body: "Build in logs, feedback, metrics, exception paths, and operational context so systems remain understandable after launch.",
  },
  {
    title: "Secure human control",
    body: "Keep critical decisions reviewable, permissions bounded, ownership explicit, and safe override paths available.",
  },
  {
    title: "Documentation and handover",
    body: "A system is complete only when other people can operate, support, improve, and safely evolve it.",
  },
];

export const credentials = [
  "Artificial Intelligence Engineer program",
  "Deep Learning with TensorFlow",
  "Machine Learning using Python",
  "Python 101 for Data Science",
];
