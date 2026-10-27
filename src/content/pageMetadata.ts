const defaultDescription =
  "Claudiu Șpan is an Agentic AI and Automation Engineer building human-controlled automation, AI products, and autonomous systems.";

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
    description: defaultDescription,
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
