const PROFILE_LINES = [
  {
    label: "name",
    value: "Jose Ramirez",
    labelClass: "text-cyan-700 dark:text-cyan-300",
  },
  {
    label: "education",
    value: "Bachelor of Arts in Computer Science from Boston University",
    labelClass: "text-lime-700 dark:text-lime-300",
  },
  {
    label: "based",
    value: "Allentown, PA",
    labelClass: "text-amber-700 dark:text-amber-300",
  },
  {
    label: "relocating",
    value: "Willing to relocate (NYC preferred, open elsewhere)",
    labelClass: "text-violet-700 dark:text-violet-300",
  },
  {
    label: "currently",
    value: "Working toward CCNA certification",
    labelClass: "text-rose-700 dark:text-rose-300",
  },
  {
    label: "status",
    value: "Open to software engineering opportunities",
    labelClass: "text-emerald-700 dark:text-emerald-300",
  },
];

export default function Hero() {
  return (
    <section className="border border-dashed border-[var(--border-muted)] bg-background p-5 md:p-7">
      <div className="space-y-5">
        <header className="space-y-4 border border-dashed border-[var(--border-muted)] p-4 transition-colors hover:border-red-500 md:p-5">
          <p className="font-mono text-xs uppercase tracking-wider text-foreground/70">
            [ profile ]
          </p>
          <div className="space-y-2">
            {PROFILE_LINES.map((line) => (
              <p key={line.label} className="font-mono text-base text-foreground md:text-lg">
                <span className={line.labelClass}>{line.label}:</span> {line.value}
              </p>
            ))}
          </div>
        </header>

        <div className="space-y-4 border border-dashed border-[var(--border-muted)] p-4 transition-colors hover:border-red-500 md:p-5">
          <p className="font-mono text-xs uppercase tracking-wider text-foreground/70">
            [ summary ]
          </p>
          <div className="space-y-4 text-base leading-8 text-foreground/90">
            <p>
              Much of my professional experience has focused on front-end web
              design, but my strongest technical interest is low-level systems
              programming. I enjoy building efficient, high-performance software
              and solving problems with languages like C and Zig. I am actively
              contributing to open source while expanding my skills across
              systems and networking.
            </p>
          </div>
        </div>

        <div className="space-y-4 border border-dashed border-[var(--border-muted)] p-4 text-center transition-colors hover:border-red-500 md:p-5">
          <p className="font-mono text-xs uppercase tracking-wider text-foreground/70">
            [ contact ]
          </p>
          <div className="space-y-3">
            <a
              href="mailto:jose.ramirez.app.28@gmail.com"
              className="inline-block border border-dashed border-[var(--border-muted)] px-3 py-2 font-mono text-base text-foreground transition-colors hover:bg-foreground hover:text-background"
            >
              jose.ramirez.app.28@gmail.com
            </a>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href="https://github.com/nowaymyname27"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-dashed border-[var(--border-muted)] px-3 py-2 font-mono text-base text-foreground transition-colors hover:bg-foreground hover:text-background"
              >
                github
              </a>
              <a
                href="https://www.linkedin.com/in/nowaymyname27/"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-dashed border-[var(--border-muted)] px-3 py-2 font-mono text-base text-foreground transition-colors hover:bg-foreground hover:text-background"
              >
                linkedin
              </a>
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-dashed border-[var(--border-muted)] px-3 py-2 font-mono text-base text-foreground transition-colors hover:bg-foreground hover:text-background"
              >
                resume
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
