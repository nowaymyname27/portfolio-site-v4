export type ExperienceTool = {
  label: string;
  colorClass?: string;
};

export type ExperienceItem = {
  id: string;
  organization: string;
  title: string;
  dateRange: string;
  details: string[];
  tools?: ExperienceTool[];
  isCurrent?: boolean;
  hoverBorderClass?: string;
};

export const EXPERIENCE_ENTRIES: ExperienceItem[] = [
  {
    id: "boston-university",
    organization: "Boston University",
    title: "B.A. in Computer Science",
    dateRange: "2022 - 2025",
    details: [
      "Studied systems, algorithms, programming languages, software engineering, and lower-level programming.",
      "Built full-stack projects through coursework and independent work.",
      "Strengthened problem-solving and design skills by working across both technical and creative development work.",
    ],
    hoverBorderClass: "hover:border-[var(--hover-border)]",
  },
  {
    id: "behome-developers",
    organization: "BeHome Developers",
    title: "Web & Data Management Intern",
    dateRange: "Summer Intern 2023 & 2024",
    details: [
      "Maintained and updated the company website using WordPress with accurate and timely property content.",
      "Managed and organized real estate data in MongoDB and Excel to improve team reporting and access.",
      "Collaborated with staff to streamline data workflows and support digital marketing initiatives.",
    ],
    tools: [
      {
        label: "WordPress",
        colorClass: "border-[var(--tag-sky-border)] text-[var(--tag-sky-text)]",
      },
      {
        label: "MongoDB",
        colorClass: "border-[var(--tag-emerald-border)] text-[var(--tag-emerald-text)]",
      },
      {
        label: "Microsoft Excel",
        colorClass: "border-[var(--tag-lime-border)] text-[var(--tag-lime-text)]",
      },
    ],
    hoverBorderClass: "hover:border-[var(--hover-border)]",
  },
  {
    id: "following-nyc",
    organization: "Following NYC",
    title: "Freelance Web Designer",
    dateRange: "August 2025",
    details: [
      "Designed and built a fully responsive photography-focused website with clean visual layouts.",
      "Implemented a content workflow so the client could upload and organize photos without touching code.",
      "Developed custom components for image-heavy pages to keep performance fast and smooth.",
    ],
    tools: [
      {
        label: "Next.js",
        colorClass: "border-[var(--tag-cyan-border)] text-[var(--tag-cyan-text)]",
      },
      {
        label: "React",
        colorClass: "border-[var(--tag-blue-border)] text-[var(--tag-blue-text)]",
      },
      {
        label: "Tailwind CSS",
        colorClass: "border-[var(--tag-sky-border)] text-[var(--tag-sky-text)]",
      },
      {
        label: "Sanity CMS",
        colorClass: "border-[var(--tag-violet-border)] text-[var(--tag-violet-text)]",
      },
      {
        label: "JavaScript",
        colorClass: "border-[var(--tag-amber-border)] text-[var(--tag-amber-text)]",
      },
      {
        label: "Vercel",
        colorClass: "border-[var(--tag-zinc-border)] text-[var(--tag-zinc-text)]",
      },
    ],
    hoverBorderClass: "hover:border-[var(--hover-border)]",
  },
  {
    id: "rentportfolio",
    organization: "RentPortfolio",
    title: "Freelance Web Designer",
    dateRange: "September - December 2025",
    details: [
      "Designed and developed a fully responsive real estate website aligned with branding and business goals.",
      "Worked closely with the client through iterative feedback cycles to refine UX and final delivery.",
      "Implemented efficient workflows for fast updates and clear communication throughout the project.",
    ],
    tools: [
      {
        label: "Next.js",
        colorClass: "border-[var(--tag-cyan-border)] text-[var(--tag-cyan-text)]",
      },
      {
        label: "React",
        colorClass: "border-[var(--tag-blue-border)] text-[var(--tag-blue-text)]",
      },
      {
        label: "Tailwind CSS",
        colorClass: "border-[var(--tag-sky-border)] text-[var(--tag-sky-text)]",
      },
      {
        label: "TypeScript",
        colorClass: "border-[var(--tag-indigo-border)] text-[var(--tag-indigo-text)]",
      },
      {
        label: "Sanity CMS",
        colorClass: "border-[var(--tag-violet-border)] text-[var(--tag-violet-text)]",
      },
      {
        label: "Vercel",
        colorClass: "border-[var(--tag-zinc-border)] text-[var(--tag-zinc-text)]",
      },
    ],
    hoverBorderClass: "hover:border-[var(--hover-border)]",
  },
  {
    id: "ccna-in-progress",
    organization: "Current Focus",
    title: "CCNA Certification - In Progress",
    dateRange: "Now",
    details: [
      "Building stronger networking fundamentals with consistent hands-on practice and structured study.",
    ],
    isCurrent: true,
    hoverBorderClass: "hover:border-[var(--hover-border)]",
  },
];
