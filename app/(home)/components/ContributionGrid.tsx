"use client";

import { useMemo, useState } from "react";

import type { ContributionCalendarDay, ContributionCalendarWeek } from "@/app/lib/github";

type ContributionGridProps = {
  weeks: ContributionCalendarWeek[];
};

function getContributionLevel(contributionCount: number): number {
  if (contributionCount <= 0) {
    return 0;
  }

  if (contributionCount <= 2) {
    return 1;
  }

  if (contributionCount <= 5) {
    return 2;
  }

  if (contributionCount <= 9) {
    return 3;
  }

  return 4;
}

function getContributionLevelClass(level: number): string {
  if (level <= 0) {
    return "bg-[var(--github-grid-0)]";
  }

  if (level === 1) {
    return "bg-[var(--github-grid-1)]";
  }

  if (level === 2) {
    return "bg-[var(--github-grid-2)]";
  }

  if (level === 3) {
    return "bg-[var(--github-grid-3)]";
  }

  return "bg-[var(--github-grid-4)]";
}

function formatDayReadout(day: ContributionCalendarDay): string {
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(day.date));
  const contributionLabel = day.contributionCount === 1 ? "contribution" : "contributions";

  return `${formattedDate} — ${day.contributionCount} ${contributionLabel}`;
}

export default function ContributionGrid({ weeks }: ContributionGridProps) {
  const [activeDay, setActiveDay] = useState<ContributionCalendarDay | null>(null);
  const legendLevels = useMemo(() => [0, 4], []);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-mono text-xs text-foreground/75">
          {activeDay ? formatDayReadout(activeDay) : "Hover or tap a square for details."}
        </p>
        <div className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-wide text-foreground/60">
          <span>less</span>
          <span className={`h-2.5 w-2.5 border border-[var(--border-muted)] ${getContributionLevelClass(legendLevels[0])}`} />
          <span
            className="h-2.5 w-14 rounded-[2px] border border-[var(--border-muted)]"
            style={{ backgroundImage: "var(--github-grid-gradient)" }}
          />
          <span className={`h-2.5 w-2.5 border border-[var(--border-muted)] ${getContributionLevelClass(legendLevels[1])}`} />
          <span>more</span>
        </div>
      </div>

      <div className="overflow-x-auto pb-1">
        <div className="flex min-w-max justify-center">
          <div className="inline-grid grid-flow-col gap-1">
            {weeks.map((week, weekIndex) => (
              <div key={`week-${weekIndex}`} className="grid grid-rows-7 gap-1">
                {week.map((day) => {
                  const level = getContributionLevel(day.contributionCount);
                  return (
                    <button
                      key={day.date}
                      type="button"
                      title={`${day.date}: ${day.contributionCount} ${
                        day.contributionCount === 1 ? "contribution" : "contributions"
                      }`}
                      aria-label={`${day.date}: ${day.contributionCount} contributions`}
                      onMouseEnter={() => setActiveDay(day)}
                      onFocus={() => setActiveDay(day)}
                      onClick={() => setActiveDay(day)}
                      className={`h-3 w-3 border border-[var(--border-muted)] ${getContributionLevelClass(
                        level,
                      )}`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
