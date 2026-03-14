const LAST_UPDATED = "March 2026";

export default function Footer() {
  return (
    <footer
      id="contact"
      className="scroll-mt-24 mt-8 border-t border-[var(--border-muted)] bg-background"
    >
      <div className="mx-auto w-full max-w-7xl space-y-4 px-5 py-5 md:px-8">
        <p className="font-mono text-xs uppercase tracking-wider text-foreground/70">
          [ footer ]
        </p>

        <div className="grid gap-3 font-mono text-sm text-foreground/90 md:grid-cols-2">
          <p>
            <span className="text-foreground/60">contact:</span>{" "}
            <a
              href="mailto:jose.ramirez.app.28@gmail.com"
              className="underline decoration-dotted underline-offset-4 transition-colors hover:text-[var(--link-accent)]"
            >
              jose.ramirez.app.28@gmail.com
            </a>
          </p>
          <p className="md:text-right">
            <span className="text-foreground/60">links:</span>{" "}
            <a
              href="https://github.com/nowaymyname27"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-dotted underline-offset-4 transition-colors hover:text-[var(--link-accent)]"
            >
              github
            </a>{" "}
            |{" "}
            <a
              href="https://www.linkedin.com/in/nowaymyname27/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-dotted underline-offset-4 transition-colors hover:text-[var(--link-accent)]"
            >
              linkedin
            </a>{" "}
            |{" "}
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-dotted underline-offset-4 transition-colors hover:text-[var(--link-accent)]"
            >
              resume
            </a>
          </p>
          <p>
            <span className="text-foreground/60">built by:</span> Jose Ramirez
          </p>
          <p className="md:text-right">
            <span className="text-foreground/60">status:</span> Open to software
            engineering opportunities
          </p>
          <p>
            <span className="text-foreground/60">location:</span> Allentown, PA -
            willing to relocate (NYC preferred, open elsewhere)
          </p>
          <p className="md:text-right">
            <span className="text-foreground/60">last updated:</span> {LAST_UPDATED}
          </p>
        </div>

        <div className="text-center md:text-right">
          <a
            href="#site-top"
            className="inline-block border border-[var(--border-muted)] px-3 py-2 font-mono text-sm text-foreground transition-colors hover:border-red-500 hover:text-[var(--link-accent)]"
          >
            back to top
          </a>
        </div>
      </div>
    </footer>
  );
}
