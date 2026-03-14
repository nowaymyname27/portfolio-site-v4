"use client";

import { useMemo, useState } from "react";

import ProjectCard from "@/app/components/ProjectCard";
import { PROJECTS } from "@/app/projects/projects.data";

function bySortOrder(a: { sortOrder: number }, b: { sortOrder: number }) {
  return a.sortOrder - b.sortOrder;
}

export default function ProjectsSection() {
  const [showAllProjects, setShowAllProjects] = useState(false);

  const featuredProjects = useMemo(
    () => PROJECTS.filter((project) => project.featured).sort(bySortOrder),
    [],
  );

  const additionalProjects = useMemo(
    () => PROJECTS.filter((project) => !project.featured).sort(bySortOrder),
    [],
  );

  return (
    <section
      id="projects"
      className="scroll-mt-24 space-y-4 border border-dashed border-[var(--border-muted)] p-4 md:p-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-mono text-xs uppercase tracking-wider text-foreground/70">
          [ selected work ]
        </p>
        <p className="font-mono text-xs text-foreground/60">
          {`${featuredProjects.length} featured projects`}
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {featuredProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      {additionalProjects.length ? (
        <div className="space-y-4 border-t border-dashed border-[var(--border-muted)] pt-4">
          {showAllProjects ? (
            <div className="grid gap-4 lg:grid-cols-3">
              {additionalProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : null}

          <button
            type="button"
            onClick={() => setShowAllProjects((current) => !current)}
            className="border border-[var(--border-muted)] px-3 py-2 font-mono text-sm text-foreground transition-colors hover:border-red-500 hover:text-[var(--link-accent)]"
          >
            {showAllProjects
              ? "show fewer projects"
              : `show all projects (${additionalProjects.length})`}
          </button>
        </div>
      ) : null}
    </section>
  );
}
