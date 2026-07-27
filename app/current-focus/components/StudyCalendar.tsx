"use client";

import { useState } from "react";

import {
  CURRENT_FOCUS_COLOR_OPTIONS,
  type CurrentFocusBoard,
  type CurrentFocusColor,
  type CurrentFocusTask,
} from "@/app/current-focus/current-focus.data";

type StudyCalendarProps = {
  initialBoard: CurrentFocusBoard;
  editModeRequested: boolean;
  initialIsAdmin: boolean;
};

type BoardMutationResponse = {
  board: CurrentFocusBoard;
};

type BoardAction =
  | {
      type: "add-task";
      title: string;
      color: CurrentFocusColor;
    }
  | {
      type: "update-task";
      taskId: string;
      title?: string;
      color?: CurrentFocusColor;
      completed?: boolean;
    }
  | {
      type: "delete-task";
      taskId: string;
    };

function getColorClasses(color: CurrentFocusColor): string {
  return `border-[var(--tag-${color}-border)] text-[var(--tag-${color}-text)]`;
}

function getProgressLabel(tasks: CurrentFocusTask[]): string {
  const completedCount = tasks.filter((task) => task.completed).length;
  return `${completedCount} / ${tasks.length} done`;
}

export default function StudyCalendar({
  initialBoard,
  editModeRequested,
  initialIsAdmin,
}: StudyCalendarProps) {
  const [board, setBoard] = useState<CurrentFocusBoard>(initialBoard);
  const [isAdmin, setIsAdmin] = useState<boolean>(initialIsAdmin);
  const [adminSecret, setAdminSecret] = useState<string>("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [isUnlocking, setIsUnlocking] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [newTaskTitle, setNewTaskTitle] = useState<string>("");
  const [newTaskColor, setNewTaskColor] = useState<CurrentFocusColor>("cyan");

  async function mutateBoard(action: BoardAction): Promise<void> {
    setIsSaving(true);
    setAuthError(null);

    const response = await fetch("/api/current-focus/board", {
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
        setAuthError("Editing session expired. Unlock again to keep updating this week&apos;s focus.");
      } else {
        setAuthError(payload?.error ?? "Unable to update this week&apos;s focus.");
      }

      setIsSaving(false);
      return;
    }

    const data = (await response.json()) as BoardMutationResponse;
    setBoard(data.board);
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
  }

  async function handleAddTask(): Promise<void> {
    const title = newTaskTitle.trim();

    if (title.length === 0) {
      setAuthError("Enter a task title before adding it.");
      return;
    }

    await mutateBoard({
      type: "add-task",
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
          <h2 className="mt-2 font-mono text-lg text-foreground md:text-xl">This Week&apos;s Focus</h2>
        </div>

        <p className="font-mono text-xs uppercase tracking-wide text-[var(--status-completed-text)]">
          {getProgressLabel(board.tasks)}
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
                Everyone can see the list. Only your unlocked session can add, update, or remove tasks.
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
            <>
              <p className="font-mono text-xs uppercase tracking-wide text-[var(--status-completed-text)]">
                editing unlocked
              </p>

              <div className="space-y-3 border border-dashed border-[var(--border-muted)] bg-background/25 p-3">
                <label className="block space-y-2">
                  <span className="font-mono text-xs uppercase tracking-wide text-foreground/60">New task</span>
                  <input
                    type="text"
                    value={newTaskTitle}
                    onChange={(event) => setNewTaskTitle(event.target.value)}
                    placeholder="add a task for this week"
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
            </>
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

      <article className="space-y-4 border border-dashed border-[var(--border-muted)] bg-[var(--surface-elevated)] p-4">
        {board.tasks.length > 0 ? (
          <div className="space-y-3">
            {board.tasks.map((task) => (
              <article
                key={task.id}
                className={`space-y-3 border bg-background/30 p-3 ${getColorClasses(task.color)} ${
                  task.completed ? "opacity-70" : "opacity-100"
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3
                        className={`font-mono text-sm md:text-base ${task.completed ? "line-through" : ""}`}
                      >
                        {task.title}
                      </h3>
                      <span className={`border px-2 py-1 font-mono text-[10px] uppercase tracking-wide ${getColorClasses(task.color)}`}>
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
            No tasks added for this week yet.
            {editModeRequested ? " Unlock editing to start building the list." : ""}
          </p>
        )}
      </article>
    </section>
  );
}
