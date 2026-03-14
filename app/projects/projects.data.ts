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
    image: "/projects/rent-intel.svg",
    imageAlt: "Placeholder image for RentPortfolio Website project",
    description:
      "I built a bilingual real estate site for a client that helps investors evaluate potential build-to-rent returns through interactive tools.",
    tags: [
      {
        label: "next.js",
        colorClass: "border-cyan-400/60 text-cyan-300",
      },
      {
        label: "react",
        colorClass: "border-blue-400/60 text-blue-300",
      },
      {
        label: "tailwind css",
        colorClass: "border-sky-400/60 text-sky-300",
      },
      {
        label: "typescript",
        colorClass: "border-indigo-400/60 text-indigo-300",
      },
      {
        label: "framer motion",
        colorClass: "border-violet-400/60 text-violet-300",
      },
      {
        label: "cloudinary",
        colorClass: "border-amber-400/60 text-amber-300",
      },
      {
        label: "sanity",
        colorClass: "border-rose-400/60 text-rose-300",
      },
    ],
    repoUrl: "https://github.com/nowaymyname27/behome-site",
    hoverBorderClass: "hover:border-cyan-500",
    links: [{ label: "live site", url: "https://www.rentportfolio.com/" }],
  },
  {
    id: "followingnyc-website",
    title: "FollowingNYC Website",
    featured: true,
    sortOrder: 2,
    image: "/projects/image-stream.svg",
    imageAlt: "Placeholder image for FollowingNYC Website project",
    description:
      "My first client website, built to manage thousands of photos while giving the client a workflow that requires no coding.",
    tags: [
      {
        label: "next.js",
        colorClass: "border-cyan-400/60 text-cyan-300",
      },
      {
        label: "react",
        colorClass: "border-blue-400/60 text-blue-300",
      },
      {
        label: "tailwind css",
        colorClass: "border-sky-400/60 text-sky-300",
      },
      {
        label: "javascript",
        colorClass: "border-amber-400/60 text-amber-300",
      },
      {
        label: "sanity",
        colorClass: "border-violet-400/60 text-violet-300",
      },
    ],
    repoUrl: "https://github.com/nowaymyname27/followingnyc-site",
    hoverBorderClass: "hover:border-amber-500",
    links: [{ label: "live site", url: "https://www.followingnyc.com/" }],
  },
  {
    id: "http-server-from-scratch",
    title: "An HTTP Server From Scratch",
    featured: true,
    sortOrder: 3,
    image: "/projects/systems-lab.svg",
    imageAlt: "Placeholder image for HTTP Server project",
    description:
      "Built my own HTTP server from scratch in C.",
    tags: [
      {
        label: "c",
        colorClass: "border-amber-400/60 text-amber-300",
      },
      {
        label: "neovim",
        colorClass: "border-lime-400/60 text-lime-300",
      },
    ],
    repoUrl: "https://github.com/nowaymyname27/codecrafters-http-server-c",
    hoverBorderClass: "hover:border-emerald-500",
  },
  {
    id: "portfolio-website-v4",
    title: "Portfolio Website",
    featured: false,
    sortOrder: 4,
    image: "/projects/open-source-cli.svg",
    imageAlt: "Placeholder image for Portfolio Website project",
    description:
      "This very site. Built with React, Next.js, Tailwind CSS, and server-side rendering.",
    tags: [
      {
        label: "next.js",
        colorClass: "border-cyan-400/60 text-cyan-300",
      },
      {
        label: "react",
        colorClass: "border-blue-400/60 text-blue-300",
      },
      {
        label: "tailwind css",
        colorClass: "border-sky-400/60 text-sky-300",
      },
      {
        label: "typescript",
        colorClass: "border-indigo-400/60 text-indigo-300",
      },
      {
        label: "framer motion",
        colorClass: "border-violet-400/60 text-violet-300",
      },
    ],
    repoUrl: "https://github.com/nowaymyname27/portfolio-site-v4",
    hoverBorderClass: "hover:border-zinc-300",
  },
  {
    id: "c-side-text-editor",
    title: "C-Side Text Editor",
    featured: false,
    sortOrder: 5,
    image: "/projects/packet-lab.svg",
    imageAlt: "Placeholder image for C-Side Text Editor project",
    description:
      "A text editor written in C from scratch using Raylib and Clay.",
    tags: [
      {
        label: "c",
        colorClass: "border-amber-400/60 text-amber-300",
      },
      {
        label: "raylib",
        colorClass: "border-cyan-400/60 text-cyan-300",
      },
      {
        label: "clay",
        colorClass: "border-orange-400/60 text-orange-300",
      },
      {
        label: "neovim",
        colorClass: "border-lime-400/60 text-lime-300",
      },
    ],
    repoUrl: "https://github.com/nowaymyname27/C-Side",
    hoverBorderClass: "hover:border-violet-500",
  },
  {
    id: "sentiment-analysis-stock-prediction",
    title: "Sentiment Analysis Data Science Project",
    featured: false,
    sortOrder: 6,
    image: "/projects/runtime-monitor.svg",
    imageAlt: "Placeholder image for Sentiment Analysis project",
    description:
      "A collaborative university project focused on sentiment analysis and stock prediction.",
    tags: [
      {
        label: "python",
        colorClass: "border-yellow-400/60 text-yellow-300",
      },
      {
        label: "numpy",
        colorClass: "border-blue-400/60 text-blue-300",
      },
      {
        label: "pandas",
        colorClass: "border-indigo-400/60 text-indigo-300",
      },
      {
        label: "scikit-learn",
        colorClass: "border-cyan-400/60 text-cyan-300",
      },
      {
        label: "jupyter notebook",
        colorClass: "border-orange-400/60 text-orange-300",
      },
    ],
    repoUrl:
      "https://github.com/nowaymyname27/Sentiment_Analysis_And_Stock_Prediction",
    hoverBorderClass: "hover:border-amber-500",
    links: [
      {
        label: "video demo",
        url: "https://youtu.be/wpLwfAlvnOg?feature=shared",
      },
    ],
  },
];
