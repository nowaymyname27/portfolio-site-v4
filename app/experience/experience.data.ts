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
    hoverBorderClass: "hover:border-cyan-500",
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
      { label: "WordPress", colorClass: "border-sky-400/60 text-sky-300" },
      { label: "MongoDB", colorClass: "border-emerald-400/60 text-emerald-300" },
      { label: "Microsoft Excel", colorClass: "border-lime-400/60 text-lime-300" },
    ],
    hoverBorderClass: "hover:border-amber-500",
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
      { label: "Next.js", colorClass: "border-cyan-400/60 text-cyan-300" },
      { label: "React", colorClass: "border-blue-400/60 text-blue-300" },
      { label: "Tailwind CSS", colorClass: "border-sky-400/60 text-sky-300" },
      { label: "Sanity CMS", colorClass: "border-violet-400/60 text-violet-300" },
      { label: "JavaScript", colorClass: "border-amber-400/60 text-amber-300" },
      { label: "Vercel", colorClass: "border-zinc-300/60 text-zinc-200" },
    ],
    hoverBorderClass: "hover:border-violet-500",
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
      { label: "Next.js", colorClass: "border-cyan-400/60 text-cyan-300" },
      { label: "React", colorClass: "border-blue-400/60 text-blue-300" },
      { label: "Tailwind CSS", colorClass: "border-sky-400/60 text-sky-300" },
      { label: "TypeScript", colorClass: "border-indigo-400/60 text-indigo-300" },
      { label: "Sanity CMS", colorClass: "border-violet-400/60 text-violet-300" },
      { label: "Vercel", colorClass: "border-zinc-300/60 text-zinc-200" },
    ],
    hoverBorderClass: "hover:border-rose-500",
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
    hoverBorderClass: "hover:border-emerald-500",
  },
];
