"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  CURRENT_FOCUS_COLOR_OPTIONS,
  type CurrentFocusBoard,
  type CurrentFocusColor,
  type CurrentFocusDay,
  type CurrentFocusTask,
} from "@/app/current-focus/current-focus.data";

type StudyCalendarProps = {
  initialBoard: CurrentFocusBoard;
  editModeRequested: boolean;
  initialIsAdmin: boolean;
  currentWeekStart: string;
  nextWeekStart: string;
};

type BoardMutationResponse = {
  board: CurrentFocusBoard;
};

type BoardAction =
  | {
      type: "add-task";
      date: string;
      title: string;
      color: CurrentFocusColor;
    }
  | {
      type: "update-task";
      date: string;
      taskId: string;
      title?: string;
      color?: CurrentFocusColor;
      completed?: boolean;
    }
  | {
      type: "delete-task";
      date: string;
      taskId: string;
    };

function createUtcDate(date: string): Date {
  return new Date(`${date}T00:00:00Z`);
}

function getColorClasses(color: CurrentFocusColor): string {
  return `border-[var(--tag-${color}-border)] text-[var(--tag-${color}-text)]`;
}

function getDayLabel(date: string): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(createUtcDate(date));
}

function getFullDateLabel(date: string): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(createUtcDate(date));
}

function getWeekRangeLabel(weekStart: string): string {
  const start = createUtcDate(weekStart);
  const end = new Date(start);
  end.setUTCDate(start.getUTCDate() + 6);

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).formatRange(start, end);
}

function getTaskProgress(tasks: CurrentFocusTask[]): string {
  const completedCount = tasks.filter((task) => task.completed).length;
  return `${completedCount} / ${tasks.length} done`;
}

function getBoardTitle(weekStart: string, currentWeekStart: string, nextWeekStart: string): string {
  if (weekStart === nextWeekStart) {
    return "Next Week's Focus";
  }

  if (weekStart === currentWeekStart) {
    return "This Week's Focus";
  }

  return "Weekly Focus";
}

function getBoardProgress(days: CurrentFocusDay[]): string {
  const tasks = days.flatMap((day) => day.tasks);
  return getTaskProgress(tasks);
}

function getInitialSelectedDate(days: CurrentFocusDay[]): string {
  const today = new Date().toISOString().slice(0, 10);
  return days.find((day) => day.date === today)?.date ?? days[0]?.date ?? "";
}

export default function StudyCalendar({
  initialBoard,
  editModeRequested,
  initialIsAdmin,
  currentWeekStart,
  nextWeekStart,
}: StudyCalendarProps) {
  const router = useRouter();
  const [board, setBoard] = useState<CurrentFocusBoard>(initialBoard);
  const [selectedDate, setSelectedDate] = useState<string>(() => getInitialSelectedDate(initialBoard.days));
  const [isAdmin, setIsAdmin] = useState<boolean>(initialIsAdmin);
  const [adminSecret, setAdminSecret] = useState<string>("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [isUnlocking, setIsUnlocking] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [newTaskTitle, setNewTaskTitle] = useState<string>("");
  const [newTaskColor, setNewTaskColor] = useState<CurrentFocusColor>("cyan");

  const selectedDay = board.days.find((day) => day.date === selectedDate) ?? board.days[0] ?? null;
  const isPlanningNextWeek = board.weekStart === nextWeekStart;

  function getWeekHref(weekStart: string): string {
    const searchParams = new URLSearchParams();

    if (editModeRequested) {
      searchParams.set("edit", "1");
    }

    if (weekStart !== currentWeekStart) {
      searchParams.set("week", weekStart);
    }

    const query = searchParams.toString();
    return query.length > 0 ? `/current-focus?${query}` : "/current-focus";
  }

  function getBoardApiUrl(): string {
    return `/api/current-focus/board?week=${encodeURIComponent(board.weekStart)}`;
  }

  async function mutateBoard(action: BoardAction): Promise<void> {
    setIsSaving(true);
    setAuthError(null);

    const response = await fetch(getBoardApiUrl(), {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(action),
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as { error?: string } | null;

      if (response.status === 401) {
        setIsAdmin(false);
        if (isPlanningNextWeek) {
          router.push(getWeekHref(currentWeekStart));
        }
        setAuthError("Editing session expired. Unlock again to keep updating your selected week.");
      } else {
        setAuthError(payload?.error ?? "Unable to update your selected week.");
      }

      setIsSaving(false);
      return;
    }

    const data = (await response.json()) as BoardMutationResponse;
    setBoard(data.board);
    setSelectedDate((currentDate) =>
      data.board.days.some((day) => day.date === currentDate) ? currentDate : getInitialSelectedDate(data.board.days),
    );
    setIsSaving(false);
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

    if (isPlanningNextWeek) {
      router.push(getWeekHref(currentWeekStart));
    }
  }

  async function handleAddTask(): Promise<void> {
    const title = newTaskTitle.trim();

    if (!selectedDay) {
      setAuthError("No day selected.");
      return;
    }

    if (title.length === 0) {
      setAuthError("Enter a task title before adding it.");
      return;
    }

    await mutateBoard({
      type: "add-task",
      date: selectedDay.date,
      title,
      color: newTaskColor,
    });

    setNewTaskTitle("");
    setNewTaskColor("cyan");
  }

  return (
    <section className="space-y-4 border border-dashed border-[var(--border-muted)] p-4 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-foreground/70">
            [ weekly task board ]
          </p>
          <h2 className="mt-2 font-mono text-lg text-foreground md:text-xl">
            {getBoardTitle(board.weekStart, currentWeekStart, nextWeekStart)}
          </h2>
          <p className="mt-2 font-mono text-xs uppercase tracking-wide text-foreground/60">
            {getWeekRangeLabel(board.weekStart)}
          </p>
        </div>

        <p className="font-mono text-xs uppercase tracking-wide text-[var(--status-completed-text)]">
          {getBoardProgress(board.days)}
        </p>
      </div>

      {editModeRequested ? (
        <article className="space-y-4 border border-dashed border-[var(--border-muted)] bg-[var(--surface-elevated)] p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-mono text-xs uppercase tracking-wider text-foreground/60">
                [ progress editing ]
              </p>
              <p className="mt-1 text-sm leading-7 text-foreground/75">
                Everyone can see the current week. Only your unlocked session can add, update, or remove day
                tasks and plan ahead for next week.
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

          {isAdmin ? (
            <div className="flex flex-wrap gap-2 border-t border-[var(--border-muted)] pt-4">
              <Link
                href={getWeekHref(currentWeekStart)}
                className={`border px-3 py-2 font-mono text-xs uppercase tracking-wide transition-colors ${
                  !isPlanningNextWeek
                    ? "border-[var(--hover-border)] bg-background text-foreground"
                    : "border-[var(--border-muted)] text-foreground/70 hover:bg-background/50"
                }`}
              >
                this week
              </Link>
              <Link
                href={getWeekHref(nextWeekStart)}
                className={`border px-3 py-2 font-mono text-xs uppercase tracking-wide transition-colors ${
                  isPlanningNextWeek
                    ? "border-[var(--hover-border)] bg-background text-foreground"
                    : "border-[var(--border-muted)] text-foreground/70 hover:bg-background/50"
                }`}
              >
                next week
              </Link>
            </div>
          ) : null}
        </article>
      ) : null}

      <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-7">
        {board.days.map((day) => {
          const isSelected = selectedDay?.date === day.date;

          return (
            <button
              key={day.date}
              type="button"
              onClick={() => setSelectedDate(day.date)}
              className={`min-h-36 space-y-3 border p-3 text-left transition-colors ${
                isSelected
                  ? "border-[var(--hover-border)] bg-[var(--surface-elevated)]"
                  : "border-[var(--border-muted)] bg-background/20 hover:border-[var(--hover-border)]"
              }`}
            >
              <div className="space-y-1">
                <p className="font-mono text-sm text-foreground">{getDayLabel(day.date)}</p>
                <p className="font-mono text-[10px] uppercase tracking-wide text-foreground/60">
                  {day.tasks.length} {day.tasks.length === 1 ? "task" : "tasks"}
                </p>
                <p className="font-mono text-[10px] uppercase tracking-wide text-[var(--status-completed-text)]">
                  {getTaskProgress(day.tasks)}
                </p>
              </div>

              {day.tasks.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {day.tasks.map((task) => (
                    <span
                      key={task.id}
                      className={`border px-1.5 py-1 font-mono text-[10px] uppercase tracking-wide ${getColorClasses(
                        task.color,
                      )} ${task.completed ? "bg-[var(--status-completed-text)]/10 line-through opacity-75" : ""}`}
                    >
                      {task.title}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="font-mono text-[10px] uppercase tracking-wide text-foreground/40">no tasks yet</p>
              )}
            </button>
          );
        })}
      </div>

      <article className="space-y-4 border border-dashed border-[var(--border-muted)] bg-[var(--surface-elevated)] p-4">
        <div className="space-y-1">
          <p className="font-mono text-xs uppercase tracking-wider text-foreground/60">[ selected day ]</p>
          <h3 className="font-mono text-base text-foreground md:text-lg">
            {selectedDay ? getFullDateLabel(selectedDay.date) : "No day selected"}
          </h3>
          {selectedDay ? (
            <p className="font-mono text-xs uppercase tracking-wide text-[var(--status-completed-text)]">
              {getTaskProgress(selectedDay.tasks)}
            </p>
          ) : null}
        </div>

        {selectedDay && isAdmin ? (
          <div className="space-y-3 border border-dashed border-[var(--border-muted)] bg-background/25 p-3">
            <label className="block space-y-2">
              <span className="font-mono text-xs uppercase tracking-wide text-foreground/60">New task</span>
              <input
                type="text"
                value={newTaskTitle}
                onChange={(event) => setNewTaskTitle(event.target.value)}
                placeholder={`add a task for ${getDayLabel(selectedDay.date).toLowerCase()}`}
                className="w-full min-w-0 border border-[var(--border-muted)] bg-background px-3 py-2 font-mono text-sm text-foreground outline-none transition-colors placeholder:text-foreground/35 focus:border-[var(--hover-border)]"
              />
            </label>

            <div className="space-y-2">
              <p className="font-mono text-xs uppercase tracking-wide text-foreground/60">Outline color</p>
              <div className="flex flex-wrap gap-2">
                {CURRENT_FOCUS_COLOR_OPTIONS.map((color) => {
                  const isSelected = color === newTaskColor;

                  return (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setNewTaskColor(color)}
                      className={`border px-2 py-1 font-mono text-[10px] uppercase tracking-wide transition-colors ${getColorClasses(
                        color,
                      )} ${isSelected ? "bg-foreground/8" : "hover:bg-background/50"}`}
                    >
                      {color}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="button"
              disabled={isSaving || newTaskTitle.trim().length === 0}
              onClick={() => {
                void handleAddTask();
              }}
              className="border border-[var(--border-muted)] px-3 py-2 font-mono text-xs uppercase tracking-wide text-foreground transition-colors hover:bg-foreground hover:text-background disabled:cursor-not-allowed disabled:opacity-40"
            >
              add task
            </button>
          </div>
        ) : null}

        {selectedDay ? (
          selectedDay.tasks.length > 0 ? (
            <div className="space-y-3">
              {selectedDay.tasks.map((task) => (
                <article
                  key={task.id}
                  className={`space-y-3 border bg-background/30 p-3 ${getColorClasses(task.color)} ${
                    task.completed ? "opacity-70" : "opacity-100"
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4
                          className={`font-mono text-sm md:text-base ${task.completed ? "line-through" : ""}`}
                        >
                          {task.title}
                        </h4>
                        <span
                          className={`border px-2 py-1 font-mono text-[10px] uppercase tracking-wide ${getColorClasses(task.color)}`}
                        >
                          {task.color}
                        </span>
                        {task.completed ? (
                          <span className="border border-[var(--status-completed-border)] px-2 py-1 font-mono text-[10px] uppercase tracking-wide text-[var(--status-completed-text)]">
                            done
                          </span>
                        ) : null}
                      </div>
                    </div>

                    {isAdmin ? (
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          disabled={isSaving}
                          onClick={() => {
                            void mutateBoard({
                              type: "update-task",
                              date: selectedDay.date,
                              taskId: task.id,
                              completed: !task.completed,
                            });
                          }}
                          className={`border px-3 py-2 font-mono text-xs uppercase tracking-wide transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                            task.completed
                              ? "border-[var(--status-completed-border)] text-[var(--status-completed-text)] hover:bg-[var(--status-completed-text)]/10"
                              : "border-[var(--border-muted)] text-foreground hover:bg-foreground hover:text-background"
                          }`}
                        >
                          {task.completed ? "mark incomplete" : "mark complete"}
                        </button>
                        <button
                          type="button"
                          disabled={isSaving}
                          onClick={() => {
                            void mutateBoard({
                              type: "delete-task",
                              date: selectedDay.date,
                              taskId: task.id,
                            });
                          }}
                          className="border border-[var(--tag-rose-border)] px-3 py-2 font-mono text-xs uppercase tracking-wide text-[var(--tag-rose-text)] transition-colors hover:bg-[var(--tag-rose-text)]/10 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          delete
                        </button>
                      </div>
                    ) : null}
                  </div>

                  {isAdmin ? (
                    <div className="flex flex-wrap gap-2 border-t border-[var(--border-muted)] pt-3">
                      {CURRENT_FOCUS_COLOR_OPTIONS.map((color) => {
                        const isSelected = color === task.color;

                        return (
                          <button
                            key={`${task.id}-${color}`}
                            type="button"
                            disabled={isSaving || isSelected}
                            onClick={() => {
                              void mutateBoard({
                                type: "update-task",
                                date: selectedDay.date,
                                taskId: task.id,
                                color,
                              });
                            }}
                            className={`border px-2 py-1 font-mono text-[10px] uppercase tracking-wide transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${getColorClasses(
                              color,
                            )} ${isSelected ? "bg-foreground/8" : "hover:bg-background/50"}`}
                          >
                            {color}
                          </button>
                        );
                      })}
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
          ) : (
            <p className="text-sm leading-7 text-foreground/75">
              No tasks added for this day yet.
              {isAdmin ? " Use the form above to add the first one." : ""}
            </p>
          )
        ) : (
          <p className="text-sm leading-7 text-foreground/75">Select a day to review or edit its tasks.</p>
        )}
      </article>
    </section>
  );
}
