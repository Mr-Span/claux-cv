import { sitePath } from "../sitePaths";

export type WorkshopImage = {
  src: string;
  srcSet?: string;
  alt: string;
  caption: string;
  label?: string;
  framing?: "workbench" | "laser";
  width: number;
  height: number;
};

export type WorkshopModel = {
  id: "A" | "B";
  label: string;
  description: string;
  src: string;
  poster: WorkshopImage;
};

export type WorkshopProject = {
  id: string;
  number: string;
  category: string;
  title: string;
  summary: string;
  contribution: string;
  status: { label: string; description: string; tone: "progress" | "verified" };
  skills: string[];
  next: string;
  images: WorkshopImage[];
  details: Array<{ title: string; body: string }>;
  diagram?: "printing" | "iot" | "homelab";
  viewer?: { initialVariant: "A" | "B"; variants: WorkshopModel[] };
};

export const workshopPhoto: WorkshopImage = {
  src: sitePath("/images/workshop/workbench-1600.webp"),
  srcSet: `${sitePath("/images/workshop/workbench-800.webp")} 800w, ${sitePath("/images/workshop/workbench-1600.webp")} 1600w`,
  alt: "My open-frame CNC laser on the workbench, with its aluminium rails, motors and wiring visible.",
  caption:
    "The starting point. My CNC laser, before the proposed mechanical upgrades.",
  width: 1600,
  height: 1200,
  framing: "workbench",
};

export const assemblyImages: WorkshopImage[] = [
  {
    src: sitePath("/images/workshop/assembly-a.webp"),
    label: "Layout A",
    alt: "CAD study A of the CNC laser, with the controller enclosure in the rear corner and a cross-gantry cable channel.",
    caption:
      "A / Corner-mounted controller. The opposite Y cable crosses the gantry.",
    width: 1400,
    height: 1050,
  },
  {
    src: sitePath("/images/workshop/assembly-b.webp"),
    label: "Layout B",
    alt: "CAD study B of the CNC laser, with a centrally mounted controller enclosure and separate Y cable routes.",
    caption:
      "B / Central controller. Separate Y routes shorten the cross-machine path.",
    width: 1400,
    height: 1050,
  },
];

export const workshopProjects: WorkshopProject[] = [
  {
    id: "mechanical-design",
    number: "01",
    category: "Mechanical design",
    title: "CNC parts, designed to fit.",
    summary:
      "I design enclosures, adjustable mounts and cable guides, comparing two layouts around the CNC’s existing frame and wiring.",
    contribution:
      "I shape the requirements and compare parametric designs for a ventilated PCB enclosure, adjustable rails, spacers, frame clamps, cable guides and a peripheral material support. The work connects dimensions, assembly access and the limitations of the existing machine.",
    status: {
      label: "CAD prototypes · physical fit untested",
      description: "Geometry checked. Physical fit still to be tested.",
      tone: "progress",
    },
    skills: [
      "Parametric design",
      "Mechanical integration",
      "Fit & clearances",
      "STL validation",
    ],
    next: "Measure the interfaces, resolve cable lengths and print small fit tests.",
    images: [
      ...assemblyImages,
      {
        src: sitePath("/images/workshop/enclosure.webp"),
        label: "Enclosure",
        alt: "Close-up of the CAD controller enclosure, its removable cover, adjustable PCB mounting and frame clamps.",
        caption:
          "A place for the electronics. Ventilation, connector access and adjustable mounting.",
        width: 1400,
        height: 1050,
      },
      {
        src: sitePath("/images/workshop/cabling.webp"),
        label: "Cabling",
        alt: "Close-up of the modelled cable chain and its printed support tray on the CNC gantry.",
        caption:
          "A supported route. Printed trays, guides and chain-end interfaces.",
        width: 1400,
        height: 1050,
      },
    ],
    details: [
      {
        title: "v1 → A / B",
        body: "v1: enclosure, PCB rails and spacers. v2: 14 new part types. A / B compare corner and central controller mounting.",
      },
      {
        title: "CAD checks",
        body: "14 closed, single-component STLs; positive volume; max. 200 × 200 × 200 mm. Sampled interference checks only; physical fit untested.",
      },
      {
        title: "Cable lengths · CAD estimates",
        body: "Existing cables ≈600 mm. Laser A / B: 962.5 / 959.3 mm. Opposite Y: 977.4 / 621.3 mm. Wiring fit unresolved.",
      },
      {
        title: "Dimensions to verify",
        body: "XY configuration: 300 × 250 mm. Frame, PCB and fastener dimensions still need physical checks.",
      },
    ],
    viewer: {
      initialVariant: "B",
      variants: [
        {
          id: "A",
          label: "A · Corner",
          description:
            "Corner controller; opposite Y cable crosses the gantry.",
          src: sitePath("/models/workshop/assembly-a.glb"),
          poster: assemblyImages[0],
        },
        {
          id: "B",
          label: "B · Centre",
          description: "Central controller; two separate Y cable routes.",
          src: sitePath("/models/workshop/assembly-b.glb"),
          poster: assemblyImages[1],
        },
      ],
    },
  },
  {
    id: "laser",
    number: "02",
    category: "CNC laser engraving",
    title: "Bringing the laser CNC back to life.",
    summary:
      "I inspect the Dingqi controller, install and verify GRBL, and set up LaserGRBL for the first material tests.",
    contribution:
      "My workshop project brings together Dingqi controller inspection, a GRBL firmware upgrade, verified backups and a local LaserGRBL setup. I am preparing material experiments around focus, motion and repeatability.",
    status: {
      label: "Firmware verified · calibration next",
      description:
        "Installed and digitally verified. Physical calibration is planned.",
      tone: "verified",
    },
    skills: [
      "GRBL",
      "LaserGRBL",
      "Hardware diagnosis",
      "Configuration & recovery",
    ],
    next: "Calibrate travel, check focus and run repeatable material trials.",
    images: [
      {
        src: sitePath("/images/workshop/laser-1600.webp"),
        srcSet: `${sitePath("/images/workshop/laser-800.webp")} 800w, ${sitePath("/images/workshop/laser-1600.webp")} 1600w`,
        alt: "The real CNC laser carriage, X motor, aluminium gantry and exposed wiring on my workbench.",
        caption:
          "The actual machine. Understanding the mechanics before testing the engraving.",
        width: 1600,
        height: 1200,
        framing: "laser",
      },
    ],
    details: [
      {
        title: "Completed work",
        body: "GRBL 1.1h compiled, flashed and verified by readback. Flash and EEPROM backed up; bootloader preserved. LaserGRBL configured with ten starting material profiles.",
      },
      {
        title: "Physical testing pending",
        body: "Material profiles are untested. Optical power, focus, dimensional accuracy and repeatability still need measurement.",
      },
    ],
  },
  {
    id: "printing",
    number: "03",
    category: "3D printing",
    title: "Functional parts, one print at a time.",
    summary:
      "Brackets, enclosures and fit tests in PLA and PETG. I’m preparing the Anycubic Mega S for repair and tuning, with Marlin and OrcaSlicer as the next direction.",
    contribution:
      "The Anycubic Mega S is my platform for PLA and PETG experiments. Its current repair and upgrade plan puts the hotend, Bowden path and mechanical baseline before firmware changes and print-profile tuning.",
    status: {
      label: "Repair & upgrade plan",
      description:
        "Preparation in progress; upgrades are not yet validated on the printer.",
      tone: "progress",
    },
    skills: [
      "Functional parts",
      "PLA / PETG",
      "Print orientation",
      "Repair & calibration",
    ],
    next: "Replace and verify the hotend sensor, then establish a baseline print.",
    images: [],
    diagram: "printing",
    details: [
      {
        title: "Current printer state",
        body: "Original Mega S configuration. The hotend thermistor needs replacement; Bowden couplings and the filament path need inspection. Verify the replacement sensor and firmware setting before heating.",
      },
      {
        title: "Chosen direction",
        body: "Marlin and OrcaSlicer are selected, with no replacement firmware validated yet. Driver changes, Z alignment, cooling and a passive ventilated enclosure are under evaluation.",
      },
      {
        title: "First prints",
        body: "Screw and nut-fit coupons, PCB rails and chain-end adapters to check orientation, clearances and assembly fit.",
      },
    ],
  },
  {
    id: "iot",
    number: "04",
    category: "Embedded electronics",
    title: "ESP32 meets Home Assistant.",
    summary:
      "A home-security prototype combining ESP32, Home Assistant and DIY electronics. I’m designing the housings and mounts alongside the electronics, using 3D-printed parts.",
    contribution:
      "I am exploring the electronics integration alongside the parts that support it: how a device is housed, mounted and assembled using 3D-printed mechanical pieces.",
    status: {
      label: "Prototype in progress",
      description: "Personal home-security project under development.",
      tone: "progress",
    },
    skills: [
      "ESP32",
      "Home Assistant",
      "Embedded integration",
      "DIY enclosures",
    ],
    next: "Test the electronics and mounting design together.",
    images: [],
    diagram: "iot",
    details: [
      {
        title: "Integration",
        body: "ESP32 and Home Assistant for a personal home-security prototype, with custom mechanical housings and mounts.",
      },
      {
        title: "Still to define",
        body: "Sensors, communication protocol and tested security functions. The diagram describes the prototype architecture.",
      },
    ],
  },
  {
    id: "homelab",
    number: "05",
    category: "HomeLab",
    title: "An old laptop. A new purpose.",
    summary:
      "I’ve prepared an Ubuntu server on a reused laptop. Next: n8n automations, personal cloud storage and AdGuard, added one service at a time.",
    contribution:
      "I have an Ubuntu server prepared on an eighth-generation Intel i5 laptop with 16 GB RAM, a 500 GB SSD and an additional 1 TB HDD. The next layer is a small set of personal services for automation, storage and network filtering.",
    status: {
      label: "Ubuntu server ready",
      description: "n8n, personal cloud and AdGuard are planned next steps.",
      tone: "verified",
    },
    skills: [
      "Ubuntu",
      "Self-hosting",
      "Service architecture",
      "Hardware reuse",
    ],
    next: "Add services in stages, with private access, backups and recovery.",
    images: [],
    diagram: "homelab",
    details: [
      {
        title: "Hardware",
        body: "Ubuntu on an eighth-generation Intel i5 laptop, 16 GB DDR4, 500 GB SSD and 1 TB HDD.",
      },
      {
        title: "Planned services",
        body: "n8n for automation, personal cloud storage and AdGuard for DNS filtering. Installation, remote access and monitoring are next steps.",
      },
    ],
  },
];

export const workshopSkills = [
  {
    title: "Design",
    body: "Parametric parts, mechanical interfaces, clearances and assembly decisions.",
  },
  {
    title: "Build",
    body: "3D printing, DIY electronics and hardware/software integration.",
  },
  {
    title: "Understand",
    body: "Firmware, diagnosis, geometry checks and documented experiments.",
  },
];
