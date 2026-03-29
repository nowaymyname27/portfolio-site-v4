import {
  getRecentContributionColumns,
  type ContributionItem,
} from "@/app/lib/github";

import ContributionGrid from "@/app/(home)/components/ContributionGrid";

const GITHUB_PR_SEARCH_URL =
  "https://github.com/nowaymyname27";

function formatDate(dateIso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(dateIso));
}

function getTypeClass(type: "PR" | "Commit" | "Deploy"): string {
  if (type === "PR") {
    return "border-[var(--tag-cyan-border)] text-[var(--tag-cyan-text)]";
  }

  if (type === "Commit") {
    return "border-[var(--tag-amber-border)] text-[var(--tag-amber-text)]";
  }

  return "border-[var(--tag-violet-border)] text-[var(--tag-violet-text)]";
}

export default async function OpenSourceContributions() {
  let openSourcePullRequests = [] as ContributionItem[];
  let ownRepoCommits = [] as ContributionItem[];
  let deployments = [] as ContributionItem[];
  let contributionCalendar = [] as Awaited<
    ReturnType<typeof getRecentContributionColumns>
  >["contributionCalendar"];
  let partialError = false;
  let loadError = false;

  try {
    const contributionFeed = await getRecentContributionColumns("nowaymyname27", 2);
    openSourcePullRequests = contributionFeed.openSourcePullRequests;
    ownRepoCommits = contributionFeed.ownRepoCommits;
    deployments = contributionFeed.deployments;
    contributionCalendar = contributionFeed.contributionCalendar;
    partialError = contributionFeed.partialError;
  } catch {
    loadError = true;
  }

  return (
    <section
      id="contributions"
      className="scroll-mt-24 space-y-4 border border-dashed border-[var(--border-muted)] p-4 md:p-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-mono text-xs uppercase tracking-wider text-foreground/70">
          [ recent github log ]
        </p>
        <div className="flex items-center gap-3">
          <a
            href={GITHUB_PR_SEARCH_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs text-foreground/70 underline decoration-dotted underline-offset-4 transition-colors hover:text-[var(--link-accent)]"
          >
            view on github
          </a>
          {partialError ? (
            <span className="font-mono text-xs text-[var(--status-progress-text)]">
              partial data
            </span>
          ) : null}
        </div>
      </div>

      {loadError ? (
        <div className="border border-dashed border-[var(--border-muted)] bg-[var(--surface-elevated)] p-4 text-sm text-foreground/85">
          Unable to load contribution data right now. You can still view activity
          on GitHub.
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="space-y-3 border border-dashed border-[var(--border-muted)] bg-[var(--surface-elevated)] p-4">
            <p className="font-mono text-xs uppercase tracking-wider text-foreground/70">
              [ open source contributions ]
            </p>
            {openSourcePullRequests.length ? (
              openSourcePullRequests.map((contribution) => (
                <article
                  key={contribution.id}
                  className="space-y-3 border border-dashed border-[var(--border-muted)] bg-background/30 p-3 transition-colors hover:border-[var(--hover-border)]"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <a
                      href={contribution.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-sm text-foreground underline decoration-dotted underline-offset-4 transition-colors hover:text-[var(--link-accent)]"
                    >
                      {contribution.title}
                    </a>
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`border px-2 py-1 font-mono text-xs uppercase tracking-wide ${getTypeClass(
                          contribution.type,
                        )}`}
                      >
                        {contribution.type}
                      </span>
                      <span className="border border-[var(--status-completed-border)] px-2 py-1 font-mono text-xs uppercase tracking-wide text-[var(--status-completed-text)]">
                        open source
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-foreground/70">
                    <a
                      href={contribution.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline decoration-dotted underline-offset-4 transition-colors hover:text-[var(--link-accent)]"
                    >
                      {contribution.sourceName}
                    </a>
                    <span aria-hidden="true">|</span>
                    <span>{`merged ${formatDate(contribution.occurredAt)}`}</span>
                  </div>
                </article>
              ))
            ) : (
              <p className="font-mono text-xs text-foreground/70">No recent open source PR merges.</p>
            )}
          </div>

          <div className="space-y-3 border border-dashed border-[var(--border-muted)] bg-[var(--surface-elevated)] p-4">
            <p className="font-mono text-xs uppercase tracking-wider text-foreground/70">
              [ my repo commits ]
            </p>
            {ownRepoCommits.length ? (
              ownRepoCommits.map((contribution) => (
                <article
                  key={contribution.id}
                  className="space-y-3 border border-dashed border-[var(--border-muted)] bg-background/30 p-3 transition-colors hover:border-[var(--hover-border)]"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <a
                      href={contribution.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-sm text-foreground underline decoration-dotted underline-offset-4 transition-colors hover:text-[var(--link-accent)]"
                    >
                      {contribution.title}
                    </a>
                    <span
                      className={`border px-2 py-1 font-mono text-xs uppercase tracking-wide ${getTypeClass(
                        contribution.type,
                      )}`}
                    >
                      {contribution.type}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-foreground/70">
                    <a
                      href={contribution.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline decoration-dotted underline-offset-4 transition-colors hover:text-[var(--link-accent)]"
                    >
                      {contribution.sourceName}
                    </a>
                    <span aria-hidden="true">|</span>
                    <span>{`commit ${formatDate(contribution.occurredAt)}`}</span>
                  </div>
                </article>
              ))
            ) : (
              <p className="font-mono text-xs text-foreground/70">No recent commits found.</p>
            )}
          </div>

          <div className="space-y-3 border border-dashed border-[var(--border-muted)] bg-[var(--surface-elevated)] p-4">
            <p className="font-mono text-xs uppercase tracking-wider text-foreground/70">
              [ deployments ]
            </p>
            {deployments.length ? (
              deployments.map((contribution) => (
                <article
                  key={contribution.id}
                  className="space-y-3 border border-dashed border-[var(--border-muted)] bg-background/30 p-3 transition-colors hover:border-[var(--hover-border)]"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <a
                      href={contribution.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-sm text-foreground underline decoration-dotted underline-offset-4 transition-colors hover:text-[var(--link-accent)]"
                    >
                      {contribution.title}
                    </a>
                    <span
                      className={`border px-2 py-1 font-mono text-xs uppercase tracking-wide ${getTypeClass(
                        contribution.type,
                      )}`}
                    >
                      {contribution.type}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-foreground/70">
                    <a
                      href={contribution.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline decoration-dotted underline-offset-4 transition-colors hover:text-[var(--link-accent)]"
                    >
                      {contribution.sourceName}
                    </a>
                    <span aria-hidden="true">|</span>
                    <span>{`deploy ${formatDate(contribution.occurredAt)}`}</span>
                  </div>
                </article>
              ))
            ) : (
              <p className="font-mono text-xs text-foreground/70">No recent deployments found.</p>
            )}
          </div>
        </div>
      )}

      {!loadError ? (
        <div className="mx-auto w-fit max-w-full space-y-3 border border-dashed border-[var(--border-muted)] bg-[var(--surface-elevated)] p-4">
          <p className="font-mono text-xs uppercase tracking-wider text-foreground/70">
            [ contribution grid ]
          </p>

          {contributionCalendar.length ? (
            <ContributionGrid weeks={contributionCalendar} />
          ) : (
            <p className="font-mono text-xs text-foreground/70">
              Contribution grid unavailable right now.
            </p>
          )}
        </div>
      ) : null}
    </section>
  );
}
