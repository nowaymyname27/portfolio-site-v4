import ExperienceTimeline from "@/app/(home)/components/ExperienceTimeline";
import Hero from "@/app/(home)/components/Hero";
import ProjectCard from "@/app/components/ProjectCard";
import { PROJECTS } from "@/app/projects/projects.data";

const FEATURED_PROJECTS = PROJECTS.slice(0, 3);

export default function Home() {
  return (
    <div className="space-y-6 pb-8 pt-6 md:space-y-8 md:pb-10 md:pt-8">
      <section id="profile" className="scroll-mt-24">
        <Hero />
      </section>

      <section
        id="projects"
        className="scroll-mt-24 space-y-4 border border-dashed border-[var(--border-muted)] p-4 md:p-6"
      >
        <p className="font-mono text-xs uppercase tracking-wider text-foreground/70">
          [ selected work ]
        </p>
        <div className="grid gap-4 lg:grid-cols-3">
          {FEATURED_PROJECTS.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>

      <section id="experience" className="scroll-mt-24">
        <ExperienceTimeline />
      </section>
    </div>
  );
}
