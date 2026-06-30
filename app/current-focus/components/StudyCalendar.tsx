"use client";

import { useMemo, useState } from "react";

import type {
  CurrentFocusGoal,
  StudyDay,
  StudyTask,
  StudyTaskType,
} from "@/app/current-focus/current-focus.data";
import type { TaskCompletionMap } from "@/app/lib/current-focus-store";

type StudyCalendarProps = {
  goal: CurrentFocusGoal;
  initialCompletedTasks: TaskCompletionMap;
  editModeRequested: boolean;
  initialIsAdmin: boolean;
};

type WeekDay = {
  date: string;
  studyDay: StudyDay | null;
};

const DAYS_PER_WEEK = 7;

function createUtcDate(date: string): Date {
  return new Date(`${date}T00:00:00Z`);
}

function formatWeekLabel(weekDays: WeekDay[]): string {
  const firstDay = createUtcDate(weekDays[0].date);
  const lastDay = createUtcDate(weekDays[weekDays.length - 1].date);

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).formatRange(firstDay, lastDay);
}

function formatDateLabel(date: string): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(createUtcDate(date));
}

function formatDayLabel(date: string): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(createUtcDate(date));
}

function getTaskTypeClass(taskType: StudyTaskType): string {
  if (taskType === "flashcards") {
    return "border-[var(--tag-cyan-border)] text-[var(--tag-cyan-text)]";
  }

  if (taskType === "video") {
    return "border-[var(--tag-amber-border)] text-[var(--tag-amber-text)]";
  }

  if (taskType === "exam-prep") {
    return "border-[var(--status-progress-border)] text-[var(--status-progress-text)]";
  }

  return "border-[var(--tag-violet-border)] text-[var(--tag-violet-text)]";
}

function formatDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function getWeekStart(date: Date): Date {
  const weekStart = new Date(date);
  const dayOfWeek = weekStart.getUTCDay();
  const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

  weekStart.setUTCDate(weekStart.getUTCDate() - daysFromMonday);
  return weekStart;
}

function buildStudyWeeks(studyDays: StudyDay[]): WeekDay[][] {
  if (studyDays.length === 0) {
    return [];
  }

  const weeks: WeekDay[][] = [];
  const studyDaysByDate = new Map(studyDays.map((studyDay) => [studyDay.date, studyDay]));
  const start = getWeekStart(createUtcDate(studyDays[0].date));
  const end = createUtcDate(studyDays[studyDays.length - 1].date);

  while (start <= end) {
    const weekDays: WeekDay[] = [];

    for (let dayOffset = 0; dayOffset < DAYS_PER_WEEK; dayOffset += 1) {
      const currentDate = new Date(start);
      currentDate.setUTCDate(start.getUTCDate() + dayOffset);
      const date = formatDateKey(currentDate);

      weekDays.push({
        date,
        studyDay: studyDaysByDate.get(date) ?? null,
      });
    }

    weeks.push(weekDays);
    start.setUTCDate(start.getUTCDate() + DAYS_PER_WEEK);
  }

  return weeks;
}

function getDefaultWeekIndex(studyWeeks: WeekDay[][]): number {
  const today = new Date().toISOString().slice(0, 10);
  const currentWeekIndex = studyWeeks.findIndex((week) =>
    week.some((weekDay) => weekDay.date === today),
  );

  return currentWeekIndex >= 0 ? currentWeekIndex : 0;
}

function getSelectedDateForWeek(studyWeek: WeekDay[]): string | null {
  const today = new Date().toISOString().slice(0, 10);
  const todayStudyDay = studyWeek.find((weekDay) => weekDay.studyDay?.date === today);

  if (todayStudyDay) {
    return todayStudyDay.date;
  }

  return studyWeek.find((weekDay) => weekDay.studyDay)?.date ?? null;
}

function isTaskCompleted(completedTasks: TaskCompletionMap, taskId: string): boolean {
  return completedTasks[taskId] === true;
}

function getCompletedTaskCount(tasks: StudyTask[], completedTasks: TaskCompletionMap): number {
  return tasks.filter((task) => isTaskCompleted(completedTasks, task.id)).length;
}

export default function StudyCalendar({
  goal,
  initialCompletedTasks,
  editModeRequested,
  initialIsAdmin,
}: StudyCalendarProps) {
  const studyWeeks = useMemo(() => buildStudyWeeks(goal.studyDays), [goal.studyDays]);
  const defaultWeekIndex = getDefaultWeekIndex(studyWeeks);
  const [visibleWeekIndex, setVisibleWeekIndex] = useState<number>(defaultWeekIndex);
  const [selectedDate, setSelectedDate] = useState<string | null>(() =>
    getSelectedDateForWeek(studyWeeks[defaultWeekIndex] ?? []),
  );
  const [completedTasks, setCompletedTasks] = useState<TaskCompletionMap>(initialCompletedTasks);
  const [isAdmin, setIsAdmin] = useState<boolean>(initialIsAdmin);
  const [adminSecret, setAdminSecret] = useState<string>("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [isUnlocking, setIsUnlocking] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const visibleWeek = studyWeeks[visibleWeekIndex] ?? [];
  const selectedStudyDay =
    visibleWeek.find((weekDay) => weekDay.studyDay?.date === selectedDate)?.studyDay ?? null;

  async function updateTaskCompletion(taskId: string, completed: boolean): Promise<void> {
    const previousCompletions = completedTasks;

    setIsSaving(true);
    setAuthError(null);
    setCompletedTasks((currentCompletions) => {
      const nextCompletions = { ...currentCompletions };

      if (completed) {
        nextCompletions[taskId] = true;
      } else {
        delete nextCompletions[taskId];
      }

      return nextCompletions;
    });

    const response = await fetch(`/api/current-focus/completions/${encodeURIComponent(taskId)}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ completed }),
    });

    if (!response.ok) {
      const completions = await response.json().catch(() => null);

      if (response.status === 401) {
        setIsAdmin(false);
        setAuthError("Editing session expired. Unlock again to keep updating progress.");
      } else {
        setAuthError(completions?.error ?? "Unable to update task completion.");
      }

      setCompletedTasks(previousCompletions);
      setIsSaving(false);
      return;
    }

    const data = (await response.json()) as { completions: TaskCompletionMap };
    setCompletedTasks(data.completions);
    setIsSaving(false);
  }

  async function updateDayCompletion(taskIds: string[], completed: boolean): Promise<void> {
    if (taskIds.length === 0) {
      return;
    }

    const previousCompletions = completedTasks;

    setIsSaving(true);
    setAuthError(null);
    setCompletedTasks((currentCompletions) => {
      const nextCompletions = { ...currentCompletions };

      for (const taskId of taskIds) {
        if (completed) {
          nextCompletions[taskId] = true;
          continue;
        }

        delete nextCompletions[taskId];
      }

      return nextCompletions;
    });

    const response = await fetch("/api/current-focus/completions", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ taskIds, completed }),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => null);

      if (response.status === 401) {
        setIsAdmin(false);
        setAuthError("Editing session expired. Unlock again to keep updating progress.");
      } else {
        setAuthError(payload?.error ?? "Unable to update day completion.");
      }

      setCompletedTasks(previousCompletions);
      setIsSaving(false);
      return;
    }

    const data = (await response.json()) as { completions: TaskCompletionMap };
    setCompletedTasks(data.completions);
    setIsSaving(false);
  }

  function handleWeekChange(nextWeekIndex: number): void {
    const nextWeek = studyWeeks[nextWeekIndex] ?? [];

    setVisibleWeekIndex(nextWeekIndex);
    setSelectedDate(getSelectedDateForWeek(nextWeek));
  }

  async function handleUnlockEditing(): Promise<void> {
    setIsUnlocking(true);
    setAuthError(null);

    const response = await fetch("/api/current-focus/admin-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ secret: adminSecret }),
    });

    setIsUnlocking(false);

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as { error?: string } | null;
      setAuthError(payload?.error ?? "Unable to unlock editing.");
      return;
    }

    setAdminSecret("");
    setIsAdmin(true);
  }

  async function handleEndEditing(): Promise<void> {
    await fetch("/api/current-focus/admin-session", {
      method: "DELETE",
    });

    setIsAdmin(false);
    setAdminSecret("");
    setAuthError(null);
  }

  return (
    <section className="space-y-4 border border-dashed border-[var(--border-muted)] p-4 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-foreground/70">
            [ weekly study plan ]
          </p>
          <h2 className="mt-2 font-mono text-lg text-foreground md:text-xl">
            {visibleWeek.length > 0 ? formatWeekLabel(visibleWeek) : "No study week available"}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleWeekChange(Math.max(0, visibleWeekIndex - 1))}
            disabled={visibleWeekIndex <= 0}
            className="border border-[var(--border-muted)] px-3 py-2 font-mono text-xs uppercase tracking-wide text-foreground/80 transition-colors hover:border-[var(--hover-border)] hover:text-[var(--link-accent)] disabled:cursor-not-allowed disabled:opacity-40"
          >
            previous
          </button>
          <button
            type="button"
            onClick={() => handleWeekChange(Math.min(studyWeeks.length - 1, visibleWeekIndex + 1))}
            disabled={visibleWeekIndex >= studyWeeks.length - 1}
            className="border border-[var(--border-muted)] px-3 py-2 font-mono text-xs uppercase tracking-wide text-foreground/80 transition-colors hover:border-[var(--hover-border)] hover:text-[var(--link-accent)] disabled:cursor-not-allowed disabled:opacity-40"
          >
            next
          </button>
        </div>
      </div>

      {editModeRequested ? (
        <article className="space-y-3 border border-dashed border-[var(--border-muted)] bg-[var(--surface-elevated)] p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-mono text-xs uppercase tracking-wider text-foreground/60">
                [ progress editing ]
              </p>
              <p className="mt-1 text-sm leading-7 text-foreground/75">
                Everyone can see task progress. Only your unlocked session can update it.
              </p>
            </div>

            {isAdmin ? (
              <button
                type="button"
                onClick={() => {
                  void handleEndEditing();
                }}
                className="border border-[var(--border-muted)] px-3 py-2 font-mono text-xs uppercase tracking-wide text-foreground transition-colors hover:bg-foreground hover:text-background"
              >
                end editing
              </button>
            ) : null}
          </div>

          {isAdmin ? (
            <p className="font-mono text-xs uppercase tracking-wide text-[var(--status-completed-text)]">
              editing unlocked
            </p>
          ) : (
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <input
                type="password"
                value={adminSecret}
                onChange={(event) => setAdminSecret(event.target.value)}
                placeholder="enter admin secret"
                className="min-w-0 flex-1 border border-[var(--border-muted)] bg-background px-3 py-2 font-mono text-sm text-foreground outline-none transition-colors placeholder:text-foreground/35 focus:border-[var(--hover-border)]"
              />
              <button
                type="button"
                onClick={() => {
                  void handleUnlockEditing();
                }}
                disabled={isUnlocking || adminSecret.length === 0}
                className="border border-[var(--border-muted)] px-3 py-2 font-mono text-xs uppercase tracking-wide text-foreground transition-colors hover:bg-foreground hover:text-background disabled:cursor-not-allowed disabled:opacity-40"
              >
                {isUnlocking ? "unlocking" : "unlock editing"}
              </button>
            </div>
          )}

          {authError ? <p className="text-sm text-[var(--tag-amber-text)]">{authError}</p> : null}
        </article>
      ) : null}

      <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-7">
        {visibleWeek.map((weekDay) => {
          const isSelected = weekDay.date === selectedDate;
          const isOutsideRange = !weekDay.studyDay;
          const completedCount = weekDay.studyDay
            ? getCompletedTaskCount(weekDay.studyDay.tasks, completedTasks)
            : 0;
          const totalCount = weekDay.studyDay?.tasks.length ?? 0;

          return (
            <button
              key={weekDay.date}
              type="button"
              disabled={isOutsideRange}
              onClick={() => setSelectedDate(weekDay.date)}
              className={`min-h-36 space-y-3 border p-3 text-left transition-colors ${
                isSelected
                  ? "border-[var(--hover-border)] bg-[var(--surface-elevated)]"
                  : "border-[var(--border-muted)] bg-background/20 hover:border-[var(--hover-border)]"
              } ${isOutsideRange ? "cursor-not-allowed opacity-45" : "cursor-pointer"}`}
            >
              <div className="space-y-1">
                <p className="font-mono text-sm text-foreground">{formatDayLabel(weekDay.date)}</p>
                {weekDay.studyDay ? (
                  <>
                    <p className="font-mono text-[10px] uppercase tracking-wide text-foreground/60">
                      {totalCount} {totalCount === 1 ? "task" : "tasks"}
                    </p>
                    <p className="font-mono text-[10px] uppercase tracking-wide text-[var(--status-completed-text)]">
                      {completedCount} / {totalCount} done
                    </p>
                  </>
                ) : (
                  <p className="font-mono text-[10px] uppercase tracking-wide text-foreground/40">
                    outside range
                  </p>
                )}
              </div>

              {weekDay.studyDay ? (
                <div className="flex flex-wrap gap-1">
                  {weekDay.studyDay.tasks.map((task) => (
                    <span
                      key={task.id}
                      className={`border px-1.5 py-1 font-mono text-[10px] uppercase tracking-wide ${getTaskTypeClass(
                        task.type,
                      )} ${
                        isTaskCompleted(completedTasks, task.id)
                          ? "bg-[var(--status-completed-text)]/10 line-through opacity-75"
                          : ""
                      }`}
                    >
                      {task.title}
                    </span>
                  ))}
                </div>
              ) : null}
            </button>
          );
        })}
      </div>

      <article className="space-y-4 border border-dashed border-[var(--border-muted)] bg-[var(--surface-elevated)] p-4">
        <div className="space-y-1">
          <p className="font-mono text-xs uppercase tracking-wider text-foreground/60">
            [ selected day ]
          </p>
          <h3 className="font-mono text-base text-foreground md:text-lg">
            {selectedStudyDay ? formatDateLabel(selectedStudyDay.date) : "No study day selected"}
          </h3>
          {selectedStudyDay ? (
            <p className="font-mono text-xs uppercase tracking-wide text-[var(--status-completed-text)]">
              {getCompletedTaskCount(selectedStudyDay.tasks, completedTasks)} / {selectedStudyDay.tasks.length} done
            </p>
          ) : null}
        </div>

        {selectedStudyDay && isAdmin ? (
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={isSaving}
              onClick={() => {
                void updateDayCompletion(
                  selectedStudyDay.tasks.map((task) => task.id),
                  true,
                );
              }}
              className="border border-[var(--border-muted)] px-3 py-2 font-mono text-xs uppercase tracking-wide text-foreground transition-colors hover:bg-foreground hover:text-background disabled:cursor-not-allowed disabled:opacity-40"
            >
              mark day done
            </button>
            <button
              type="button"
              disabled={isSaving}
              onClick={() => {
                void updateDayCompletion(
                  selectedStudyDay.tasks.map((task) => task.id),
                  false,
                );
              }}
              className="border border-[var(--border-muted)] px-3 py-2 font-mono text-xs uppercase tracking-wide text-foreground transition-colors hover:bg-foreground hover:text-background disabled:cursor-not-allowed disabled:opacity-40"
            >
              clear day
            </button>
          </div>
        ) : null}

        {selectedStudyDay ? (
          <div className="space-y-3">
            {selectedStudyDay.tasks.map((task) => {
              const completed = isTaskCompleted(completedTasks, task.id);

              return (
                <article
                  key={task.id}
                  className={`space-y-3 border border-dashed border-[var(--border-muted)] bg-background/30 p-3 ${
                    completed ? "opacity-75" : "opacity-100"
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4
                          className={`font-mono text-sm text-foreground md:text-base ${
                            completed ? "line-through" : ""
                          }`}
                        >
                          {task.title}
                        </h4>
                        <span
                          className={`border px-2 py-1 font-mono text-[10px] uppercase tracking-wide ${getTaskTypeClass(
                            task.type,
                          )}`}
                        >
                          {task.type}
                        </span>
                        {completed ? (
                          <span className="border border-[var(--status-completed-border)] px-2 py-1 font-mono text-[10px] uppercase tracking-wide text-[var(--status-completed-text)]">
                            done
                          </span>
                        ) : null}
                      </div>
                      <p className="text-sm leading-7 text-foreground/85">{task.description}</p>
                    </div>

                    {isAdmin ? (
                      <button
                        type="button"
                        disabled={isSaving}
                        onClick={() => {
                          void updateTaskCompletion(task.id, !completed);
                        }}
                        className={`border px-3 py-2 font-mono text-xs uppercase tracking-wide transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                          completed
                            ? "border-[var(--status-completed-border)] text-[var(--status-completed-text)] hover:bg-[var(--status-completed-text)]/10"
                            : "border-[var(--border-muted)] text-foreground hover:bg-foreground hover:text-background"
                        }`}
                      >
                        {completed ? "mark incomplete" : "mark complete"}
                      </button>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <p className="text-sm leading-7 text-foreground/75">
            Select a day inside the active week to review the planned tasks.
          </p>
        )}
      </article>
    </section>
  );
}
