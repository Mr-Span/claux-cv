const defaultDescription =
  "Claudiu Șpan is an Applied AI and Automation Engineer building production workflows, LLM agents and human-reviewed systems.";

export const pageMetadata: Record<
  string,
  { title: string; description: string }
> = {
  "/": {
    title: "Claudiu Șpan · CLAUX | Systems in Motion",
    description: defaultDescription,
  },
  "/work/automation": {
    title: "Enterprise automation | Claudiu Șpan · CLAUX",
    description:
      "A production UiPath case: Studio Web human review, Maestro orchestration and AI profile summaries, with approximately 70% less reported manual collection and verification time.",
  },
  "/work/code": {
    title: "Software & AI products | Claudiu Șpan · CLAUX",
    description: defaultDescription,
  },
  "/work/quadyx": {
    title: "QUADYX — autonomous systems | Claudiu Șpan · CLAUX",
    description: defaultDescription,
  },
  "/workshop": {
    title: "Workshop — Design & Making | Claudiu Șpan · CLAUX",
    description:
      "Inside Claudiu Șpan's personal workshop: mechanical design, 3D printing, CNC laser engraving, ESP32 electronics and an Ubuntu HomeLab. Explore real projects and CAD prototypes.",
  },
};
