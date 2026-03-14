import { EXPERIENCE_ENTRIES } from "@/app/experience/experience.data";

const DEFAULT_HOVER_BORDER_CLASS = "hover:border-red-500";
const DEFAULT_TOOL_CLASS = "border-[var(--border-muted)] text-foreground/80";

export default function ExperienceTimeline() {
  return (
    <section className="space-y-4 border border-dashed border-[var(--border-muted)] p-4 md:p-6">
      <p className="font-mono text-xs uppercase tracking-wider text-foreground/70">
        [ experience ]
      </p>

      <ol className="ml-2 space-y-4 border-l border-[var(--border-muted)] pl-6">
        {EXPERIENCE_ENTRIES.map((entry) => (
          <li key={entry.id} className="relative">
            <span
              aria-hidden="true"
              className={`absolute -left-[31px] top-6 h-3 w-3 rounded-full border ${
                entry.isCurrent
                  ? "border-emerald-300 bg-emerald-400 motion-safe:animate-pulse"
                  : "border-[var(--border-muted)] bg-background"
              }`}
            />

            <article
              className={`space-y-4 border border-dashed border-[var(--border-muted)] p-4 transition-colors md:p-5 ${
                entry.hoverBorderClass ?? DEFAULT_HOVER_BORDER_CLASS
              }`}
            >
              <header className="space-y-2">
                <p className="font-mono text-xs uppercase tracking-wider text-foreground/60">
                  {entry.isCurrent ? "head -> now" : `commit ${entry.id}`}
                </p>

                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-mono text-base text-foreground md:text-lg">
                    {entry.title}
                  </h3>
                  {entry.isCurrent ? (
                    <span className="inline-flex items-center gap-2 border border-emerald-400/70 px-2 py-1 font-mono text-xs uppercase tracking-wide text-emerald-300">
                      <span
                        aria-label="Live status indicator"
                        className="h-2 w-2 rounded-full bg-emerald-400 motion-safe:animate-pulse"
                      />
                      live
                    </span>
                  ) : null}
                </div>

                <p className="font-mono text-sm text-foreground/80">
                  {entry.organization} - {entry.dateRange}
                </p>
              </header>

              <ul className="space-y-2 text-base leading-7 text-foreground/90">
                {entry.details.map((detail) => (
                  <li key={`${entry.id}-${detail}`} className="flex gap-2">
                    <span aria-hidden="true" className="font-mono text-foreground/60">
                      -
                    </span>
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>

              {entry.tools?.length ? (
                <div className="flex flex-wrap gap-2 border-t border-dashed border-[var(--border-muted)] pt-4">
                  {entry.tools.map((tool) => (
                    <span
                      key={`${entry.id}-${tool.label}`}
                      className={`border px-2 py-1 font-mono text-xs uppercase tracking-wide ${
                        tool.colorClass ?? DEFAULT_TOOL_CLASS
                      }`}
                    >
                      {tool.label}
                    </span>
                  ))}
                </div>
              ) : null}
            </article>
          </li>
        ))}
      </ol>
    </section>
  );
}
