"use client";

import { useSyncExternalStore } from "react";

import type { CurrentFocusGoal } from "@/app/current-focus/current-focus.data";

type GoalSummaryProps = {
  goal: CurrentFocusGoal;
};

function getDaysRemaining(targetDate: string): number {
  const [year, month, day] = targetDate.split("-").map(Number);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(year, month - 1, day);

  return Math.max(0, Math.ceil((target.getTime() - today.getTime()) / 86400000));
}

function subscribeToLocalDayChange(onStoreChange: () => void): () => void {
  const intervalId = window.setInterval(onStoreChange, 60000);

  return () => window.clearInterval(intervalId);
}

export default function GoalSummary({ goal }: GoalSummaryProps) {
  const daysRemaining = useSyncExternalStore(
    subscribeToLocalDayChange,
    () => getDaysRemaining(goal.targetDate),
    () => null,
  );

  return (
    <section className="space-y-5 border border-dashed border-[var(--border-muted)] p-4 md:p-6">
      <div className="space-y-2">
        <p className="font-mono text-xs uppercase tracking-wider text-foreground/70">
          [ current focus ]
        </p>
        <div className="space-y-3">
          <h1 className="font-mono text-2xl text-foreground md:text-3xl">
            {goal.title}
          </h1>
          <p className="max-w-3xl text-sm leading-7 text-foreground/85 md:text-base">
            A dedicated week-by-week study plan for the daily tasks pushing this
            certification goal toward exam day.
          </p>
        </div>
      </div>

      <article className="border border-dashed border-[var(--border-muted)] bg-[var(--surface-elevated)] px-6 py-8 text-center md:px-10 md:py-12">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-foreground/60">
          exam countdown
        </p>
        <p className="mt-4 font-mono text-6xl text-foreground md:text-8xl">
          {daysRemaining ?? "--"}
        </p>
        <p className="mt-3 font-mono text-sm uppercase tracking-[0.25em] text-foreground/60 md:text-base">
          days remaining
          until exam day
        </p>
      </article>
    </section>
  );
}
