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
    id: "rentportfolio-website",
    title: "RentPortfolio Website",
    featured: true,
    sortOrder: 1,
    image: "/projects/RP_whitebg_logo.png",
    imageAlt: "Placeholder image for RentPortfolio Website project",
    description:
      "I built a bilingual real estate site for a client that helps investors evaluate potential build-to-rent returns through interactive tools.",
    tags: [
      {
        label: "next.js",
        colorClass: "border-[var(--tag-cyan-border)] text-[var(--tag-cyan-text)]",
      },
      {
        label: "react",
        colorClass: "border-[var(--tag-blue-border)] text-[var(--tag-blue-text)]",
      },
      {
        label: "tailwind css",
        colorClass: "border-[var(--tag-sky-border)] text-[var(--tag-sky-text)]",
      },
      {
        label: "typescript",
        colorClass: "border-[var(--tag-indigo-border)] text-[var(--tag-indigo-text)]",
      },
      {
        label: "framer motion",
        colorClass: "border-[var(--tag-violet-border)] text-[var(--tag-violet-text)]",
      },
      {
        label: "cloudinary",
        colorClass: "border-[var(--tag-amber-border)] text-[var(--tag-amber-text)]",
      },
      {
        label: "sanity",
        colorClass: "border-[var(--tag-rose-border)] text-[var(--tag-rose-text)]",
      },
    ],
    repoUrl: "https://github.com/nowaymyname27/behome-site",
    hoverBorderClass: "hover:border-[var(--hover-border)]",
    links: [{ label: "live site", url: "https://www.rentportfolio.com/" }],
  },
  {
    id: "followingnyc-website",
    title: "FollowingNYC Website",
    featured: true,
    sortOrder: 2,
    image: "/projects/following_logo.png",
    imageAlt: "Placeholder image for FollowingNYC Website project",
    description:
      "My first client website, built to manage thousands of photos while giving the client a workflow that requires no coding.",
    tags: [
      {
        label: "next.js",
        colorClass: "border-[var(--tag-cyan-border)] text-[var(--tag-cyan-text)]",
      },
      {
        label: "react",
        colorClass: "border-[var(--tag-blue-border)] text-[var(--tag-blue-text)]",
      },
      {
        label: "tailwind css",
        colorClass: "border-[var(--tag-sky-border)] text-[var(--tag-sky-text)]",
      },
      {
        label: "javascript",
        colorClass: "border-[var(--tag-amber-border)] text-[var(--tag-amber-text)]",
      },
      {
        label: "sanity",
        colorClass: "border-[var(--tag-violet-border)] text-[var(--tag-violet-text)]",
      },
    ],
    repoUrl: "https://github.com/nowaymyname27/followingnyc-site",
    hoverBorderClass: "hover:border-[var(--hover-border)]",
    links: [{ label: "live site", url: "https://www.followingnyc.com/" }],
  },
  {
    id: "http-server-from-scratch",
    title: "An HTTP Server From Scratch",
    featured: true,
    sortOrder: 3,
    image: "/projects/server.png",
    imageAlt: "Placeholder image for HTTP Server project",
    description:
      "Built my own HTTP server from scratch in C.",
    tags: [
      {
        label: "c",
        colorClass: "border-[var(--tag-amber-border)] text-[var(--tag-amber-text)]",
      },
      {
        label: "neovim",
        colorClass: "border-[var(--tag-lime-border)] text-[var(--tag-lime-text)]",
      },
    ],
    repoUrl: "https://github.com/nowaymyname27/codecrafters-http-server-c",
    hoverBorderClass: "hover:border-[var(--hover-border)]",
  },
  {
    id: "portfolio-website-v4",
    title: "Portfolio Website",
    featured: false,
    sortOrder: 4,
    image: "/projects/portfolio-site-v4.svg",
    imageAlt: "Placeholder image for Portfolio Website project",
    description:
      "This very site. Built with React, Next.js, Tailwind CSS, and server-side rendering.",
    tags: [
      {
        label: "next.js",
        colorClass: "border-[var(--tag-cyan-border)] text-[var(--tag-cyan-text)]",
      },
      {
        label: "react",
        colorClass: "border-[var(--tag-blue-border)] text-[var(--tag-blue-text)]",
      },
      {
        label: "tailwind css",
        colorClass: "border-[var(--tag-sky-border)] text-[var(--tag-sky-text)]",
      },
      {
        label: "typescript",
        colorClass: "border-[var(--tag-indigo-border)] text-[var(--tag-indigo-text)]",
      },
      {
        label: "framer motion",
        colorClass: "border-[var(--tag-violet-border)] text-[var(--tag-violet-text)]",
      },
    ],
    repoUrl: "https://github.com/nowaymyname27/portfolio-site-v4",
    hoverBorderClass: "hover:border-[var(--hover-border)]",
  },
  {
    id: "c-side-text-editor",
    title: "C-Side Text Editor",
    featured: false,
    sortOrder: 5,
    image: "/projects/c-side.png",
    imageAlt: "Placeholder image for C-Side Text Editor project",
    description:
      "A text editor written in C from scratch using Raylib and Clay.",
    tags: [
      {
        label: "c",
        colorClass: "border-[var(--tag-amber-border)] text-[var(--tag-amber-text)]",
      },
      {
        label: "raylib",
        colorClass: "border-[var(--tag-cyan-border)] text-[var(--tag-cyan-text)]",
      },
      {
        label: "clay",
        colorClass: "border-[var(--tag-orange-border)] text-[var(--tag-orange-text)]",
      },
      {
        label: "neovim",
        colorClass: "border-[var(--tag-lime-border)] text-[var(--tag-lime-text)]",
      },
    ],
    repoUrl: "https://github.com/nowaymyname27/C-Side",
    hoverBorderClass: "hover:border-[var(--hover-border)]",
  },
  {
    id: "sentiment-analysis-stock-prediction",
    title: "Sentiment Analysis Data Science Project",
    featured: false,
    sortOrder: 6,
    image: "/projects/Stock-Market.png",
    imageAlt: "Placeholder image for Sentiment Analysis project",
    description:
      "A collaborative university project focused on sentiment analysis and stock prediction.",
    tags: [
      {
        label: "python",
        colorClass: "border-[var(--tag-yellow-border)] text-[var(--tag-yellow-text)]",
      },
      {
        label: "numpy",
        colorClass: "border-[var(--tag-blue-border)] text-[var(--tag-blue-text)]",
      },
      {
        label: "pandas",
        colorClass: "border-[var(--tag-indigo-border)] text-[var(--tag-indigo-text)]",
      },
      {
        label: "scikit-learn",
        colorClass: "border-[var(--tag-cyan-border)] text-[var(--tag-cyan-text)]",
      },
      {
        label: "jupyter notebook",
        colorClass: "border-[var(--tag-orange-border)] text-[var(--tag-orange-text)]",
      },
    ],
    repoUrl:
      "https://github.com/nowaymyname27/Sentiment_Analysis_And_Stock_Prediction",
    hoverBorderClass: "hover:border-[var(--hover-border)]",
    links: [
      {
        label: "video demo",
        url: "https://youtu.be/wpLwfAlvnOg?feature=shared",
      },
    ],
  },
];
