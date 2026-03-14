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
  featured: boolean;
  sortOrder: number;
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
    featured: true,
    sortOrder: 1,
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
    featured: true,
    sortOrder: 2,
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
    featured: true,
    sortOrder: 3,
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
  {
    id: "image-stream",
    title: "Image Stream",
    featured: false,
    sortOrder: 4,
    image: "/projects/image-stream.svg",
    imageAlt: "Placeholder image for Image Stream project",
    description:
      "Photography-focused content platform designed for smooth browsing across large image sets and collections.",
    tags: [
      {
        label: "next.js",
        colorClass: "border-cyan-400/60 text-cyan-300",
      },
      {
        label: "sanity",
        colorClass: "border-violet-400/60 text-violet-300",
      },
      {
        label: "vercel",
        colorClass: "border-zinc-300/60 text-zinc-200",
      },
    ],
    repoUrl: "https://github.com/yourhandle/image-stream",
    hoverBorderClass: "hover:border-violet-500",
    links: [{ label: "live", url: "https://example.com/image-stream" }],
  },
  {
    id: "rent-intel",
    title: "Rent Intel",
    featured: false,
    sortOrder: 5,
    image: "/projects/rent-intel.svg",
    imageAlt: "Placeholder image for Rent Intel project",
    description:
      "Real estate operations dashboard combining listing workflows, status tracking, and reporting for faster updates.",
    tags: [
      {
        label: "typescript",
        colorClass: "border-blue-400/60 text-blue-300",
      },
      {
        label: "mongodb",
        colorClass: "border-emerald-400/60 text-emerald-300",
      },
      {
        label: "tailwind",
        colorClass: "border-sky-400/60 text-sky-300",
      },
    ],
    repoUrl: "https://github.com/yourhandle/rent-intel",
    hoverBorderClass: "hover:border-amber-500",
    links: [{ label: "case study", url: "https://example.com/rent-intel" }],
  },
  {
    id: "sys-lab",
    title: "Systems Lab",
    featured: false,
    sortOrder: 6,
    image: "/projects/systems-lab.svg",
    imageAlt: "Placeholder image for Systems Lab project",
    description:
      "Collection of systems programming experiments focused on performance, memory behavior, and low-level tooling.",
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
    repoUrl: "https://github.com/yourhandle/systems-lab",
    hoverBorderClass: "hover:border-rose-500",
    links: [{ label: "notes", url: "https://example.com/systems-lab" }],
  },
];
