import Certifications from "@/app/(home)/components/Certifications";
import ExperienceTimeline from "@/app/(home)/components/ExperienceTimeline";
import Hero from "@/app/(home)/components/Hero";
import ProjectsSection from "@/app/(home)/components/ProjectsSection";

export default function Home() {
  return (
    <div className="space-y-6 pb-8 pt-6 md:space-y-8 md:pb-10 md:pt-8">
      <section id="profile" className="scroll-mt-24">
        <Hero />
      </section>

      <ProjectsSection />

      <section id="experience" className="scroll-mt-24">
        <ExperienceTimeline />
      </section>

      <Certifications />
    </div>
  );
}
