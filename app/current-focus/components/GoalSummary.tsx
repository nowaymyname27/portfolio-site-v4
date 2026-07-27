import {
  CURRENT_FOCUS_DESCRIPTION,
  CURRENT_FOCUS_TITLE,
} from "@/app/current-focus/current-focus.data";

export default function GoalSummary() {
  return (
    <section className="space-y-5 border border-dashed border-[var(--border-muted)] p-4 md:p-6">
      <div className="space-y-2">
        <p className="font-mono text-xs uppercase tracking-wider text-foreground/70">
          [ current focus ]
        </p>
        <div className="space-y-3">
          <h1 className="font-mono text-2xl text-foreground md:text-3xl">{CURRENT_FOCUS_TITLE}</h1>
          <p className="max-w-3xl text-sm leading-7 text-foreground/85 md:text-base">
            {CURRENT_FOCUS_DESCRIPTION}
          </p>
        </div>
      </div>
    </section>
  );
}
