export type ProjectTag = {
  label: string;
  colorClass?: string;
};

export type ProjectLink = {
  label: string;
  url: string;
};

export type ProjectItem = {
  id: string;
  title: string;
  image: string;
  imageAlt: string;
  description: string;
  tags: ProjectTag[];
  repoUrl: string;
  hoverBorderClass?: string;
  links?: ProjectLink[];
};

export const PROJECTS: ProjectItem[] = [
  {
    id: "runtime-monitor",
    title: "Runtime Monitor",
    image: "/projects/runtime-monitor.svg",
    imageAlt: "Placeholder image for Runtime Monitor project",
    description:
      "Terminal-inspired dashboard for tracking service health, latency, and deploy status in one practical interface.",
    tags: [
      {
        label: "next.js",
        colorClass: "border-cyan-400/60 text-cyan-300",
      },
      {
        label: "typescript",
        colorClass: "border-blue-400/60 text-blue-300",
      },
      {
        label: "tailwind",
        colorClass: "border-sky-400/60 text-sky-300",
      },
    ],
    repoUrl: "https://github.com/yourhandle/runtime-monitor",
    hoverBorderClass: "hover:border-cyan-500",
    links: [{ label: "demo", url: "https://example.com/runtime-monitor" }],
  },
  {
    id: "packet-lab",
    title: "Packet Lab",
    image: "/projects/packet-lab.svg",
    imageAlt: "Placeholder image for Packet Lab project",
    description:
      "Networking sandbox for testing packet flows, route behavior, and troubleshooting workflows while studying core protocols.",
    tags: [
      {
        label: "c",
        colorClass: "border-amber-400/60 text-amber-300",
      },
      {
        label: "zig",
        colorClass: "border-orange-400/60 text-orange-300",
      },
      {
        label: "linux",
        colorClass: "border-lime-400/60 text-lime-300",
      },
    ],
    repoUrl: "https://github.com/yourhandle/packet-lab",
    hoverBorderClass: "hover:border-amber-500",
    links: [
      { label: "write-up", url: "https://example.com/packet-lab" },
      { label: "notes", url: "https://example.com/packet-lab/notes" },
    ],
  },
  {
    id: "open-source-cli",
    title: "Open Source CLI",
    image: "/projects/open-source-cli.svg",
    imageAlt: "Placeholder image for Open Source CLI project",
    description:
      "Command-line toolkit focused on developer workflows with fast commands, clear logs, and pragmatic defaults for teams.",
    tags: [
      {
        label: "node",
        colorClass: "border-emerald-400/60 text-emerald-300",
      },
      {
        label: "automation",
        colorClass: "border-violet-400/60 text-violet-300",
      },
      {
        label: "open source",
        colorClass: "border-rose-400/60 text-rose-300",
      },
    ],
    repoUrl: "https://github.com/yourhandle/open-source-cli",
    hoverBorderClass: "hover:border-emerald-500",
    links: [{ label: "package", url: "https://example.com/open-source-cli" }],
  },
];
