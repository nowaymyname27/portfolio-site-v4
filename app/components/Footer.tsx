import { getLatestRepositoryCommit } from "@/app/lib/github";

const PORTFOLIO_REPOSITORY_OWNER = "nowaymyname27";
const PORTFOLIO_REPOSITORY_NAME = "portfolio-site-v4";

function formatLastUpdated(date: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export default async function Footer() {
  const latestCommit = await getLatestRepositoryCommit(
    PORTFOLIO_REPOSITORY_OWNER,
    PORTFOLIO_REPOSITORY_NAME,
  );

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
          <div
            id="footer-contact"
            className="contact-highlight scroll-mt-24 md:col-span-2 md:grid md:grid-cols-2 md:gap-3"
          >
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
          </div>
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
            <span className="text-foreground/60">last updated:</span>{" "}
            {latestCommit ? (
              <a
                href={latestCommit.url}
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-dotted underline-offset-4 transition-colors hover:text-[var(--link-accent)]"
              >
                {formatLastUpdated(latestCommit.occurredAt)} ({latestCommit.shortSha})
              </a>
            ) : (
              <span>Unavailable</span>
            )}
          </p>
        </div>

        <div className="text-center md:text-right">
          <a
            href="#site-top"
            className="inline-block border border-[var(--border-muted)] px-3 py-2 font-mono text-sm text-foreground transition-colors hover:border-[var(--hover-border)] hover:text-[var(--link-accent)]"
          >
            back to top
          </a>
        </div>
      </div>
    </footer>
  );
}
