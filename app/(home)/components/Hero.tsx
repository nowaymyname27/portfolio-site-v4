import Link from "next/link";

const PROFILE_LINES = [
  {
    label: "name",
    value: "Jose Ramirez",
    labelClass: "text-[var(--profile-name)]",
  },
  {
    label: "education",
    value: "Bachelor of Arts in Computer Science from Boston University",
    labelClass: "text-[var(--profile-education)]",
  },
  {
    label: "based",
    value: "Allentown, PA",
    labelClass: "text-[var(--profile-based)]",
  },
  {
    label: "relocating",
    value: "Willing to relocate (NYC preferred, open elsewhere)",
    labelClass: "text-[var(--profile-relocating)]",
  },
  {
    label: "status",
    value: "Working towards CCNA certification",
    href: "/current-focus",
    labelClass: "text-[var(--profile-status)]",
  },
];

export default function Hero() {
  return (
    <section className="border border-dashed border-[var(--border-muted)] bg-background p-5 md:p-7">
      <div className="space-y-5">
        <header className="space-y-4 border border-dashed border-[var(--border-muted)] bg-[var(--surface-elevated)] p-4 transition-colors hover:border-[var(--hover-border)] md:p-5">
          <p className="font-mono text-xs uppercase tracking-wider text-foreground/70">
            [ profile ]
          </p>
          <div className="space-y-2">
            {PROFILE_LINES.map((line) => (
              <p key={line.label} className="font-mono text-base text-foreground md:text-lg">
                <span className={line.labelClass}>{line.label}:</span>{" "}
                {line.href ? (
                  <Link
                    href={line.href}
                    className="transition-colors hover:text-[var(--link-accent)]"
                  >
                    {line.value}
                  </Link>
                ) : (
                  line.value
                )}
              </p>
            ))}
          </div>
        </header>

        <div className="space-y-4 border border-dashed border-[var(--border-muted)] bg-[var(--surface-elevated)] p-4 transition-colors hover:border-[var(--hover-border)] md:p-5">
          <p className="font-mono text-xs uppercase tracking-wider text-foreground/70">
            [ summary ]
          </p>
          <div className="space-y-4 text-base leading-8 text-foreground/90">
            <p>
              Computer Science graduate from Boston University with a strong
              interest in software engineering. I enjoy building things for the
              web and have experience creating full-stack websites from
              scratch. I&apos;ve worked on team projects in school, done freelance
              web design, and handled real estate data using MongoDB. I&apos;ve
              recently taken on more responsibilities in the IT department and
              am actively working toward my CCNA certification.
            </p>
          </div>
        </div>

        <div className="space-y-4 border border-dashed border-[var(--border-muted)] bg-[var(--surface-elevated)] p-4 text-center transition-colors hover:border-[var(--hover-border)] md:p-5">
          <p className="font-mono text-xs uppercase tracking-wider text-foreground/70">
            [ contact ]
          </p>
          <div className="space-y-3">
            <a
              href="mailto:jose.ramirez.app.28@gmail.com"
              className="inline-block w-full max-w-full [overflow-wrap:anywhere] border border-dashed border-[var(--border-muted)] px-3 py-2 font-mono text-sm text-foreground transition-colors hover:bg-foreground hover:text-background sm:w-auto sm:text-base"
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
