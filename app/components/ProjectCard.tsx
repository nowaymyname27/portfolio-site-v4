import Image from "next/image";

import type { ProjectItem } from "@/app/projects/projects.data";

type ProjectCardProps = {
  project: ProjectItem;
};

const DEFAULT_TAG_CLASS = "border-[var(--border-muted)] text-foreground/80";
const DEFAULT_HOVER_BORDER_CLASS = "hover:border-red-500";

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article
      className={`space-y-5 border border-dashed border-[var(--border-muted)] p-4 transition-colors md:p-5 ${
        project.hoverBorderClass ?? DEFAULT_HOVER_BORDER_CLASS
      }`}
    >
      <header className="space-y-2">
        <p className="font-mono text-xs uppercase tracking-wider text-foreground/70">
          [ project ]
        </p>
        <h3 className="font-mono text-lg text-foreground md:text-xl">
          {project.title}
        </h3>
      </header>

      <div className="overflow-hidden border border-[var(--border-muted)]">
        <Image
          src={project.image}
          alt={project.imageAlt}
          width={1200}
          height={700}
          className="h-44 w-full object-cover"
        />
      </div>

      <p className="text-base leading-7 text-foreground/90">{project.description}</p>

      <div className="flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <span
            key={`${project.id}-${tag.label}`}
            className={`border px-2 py-1 font-mono text-xs uppercase tracking-wide ${
              tag.colorClass ?? DEFAULT_TAG_CLASS
            }`}
          >
            {tag.label}
          </span>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3 border-t border-dashed border-[var(--border-muted)] pt-4">
        <a
          href={project.repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="border border-dashed border-[var(--border-muted)] px-3 py-2 font-mono text-sm text-foreground transition-colors hover:bg-foreground hover:text-background"
        >
          repo
        </a>
        {project.links?.map((link) => (
          <a
            key={`${project.id}-${link.label}`}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-dashed border-[var(--border-muted)] px-3 py-2 font-mono text-sm text-foreground transition-colors hover:bg-foreground hover:text-background"
          >
            {link.label}
          </a>
        ))}
      </div>
    </article>
  );
}
