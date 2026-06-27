import type { GoalMilestone } from "@/app/current-focus/current-focus.data";

type MilestoneListProps = {
  milestones: GoalMilestone[];
};

function formatDate(date: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}

export default function MilestoneList({ milestones }: MilestoneListProps) {
  return (
    <section className="space-y-4 border border-dashed border-[var(--border-muted)] p-4 md:p-6">
      <p className="font-mono text-xs uppercase tracking-wider text-foreground/70">
        [ checkpoints ]
      </p>

      <div className="grid gap-3 lg:grid-cols-2">
        {milestones.map((milestone) => (
          <article
            key={milestone.title}
            className="space-y-3 border border-dashed border-[var(--border-muted)] bg-[var(--surface-elevated)] p-4 transition-colors hover:border-[var(--hover-border)]"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-mono text-base text-foreground">{milestone.title}</h2>
              <span className="border border-[var(--status-progress-border)] px-2 py-1 font-mono text-xs uppercase tracking-wide text-[var(--status-progress-text)]">
                {formatDate(milestone.targetDate)}
              </span>
            </div>
            <p className="text-sm leading-7 text-foreground/85 md:text-base">
              {milestone.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
