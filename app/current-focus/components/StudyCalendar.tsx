"use client";

import { useState } from "react";

import type {
  CurrentFocusGoal,
  StudyDay,
  StudyTask,
  StudyTaskType,
} from "@/app/current-focus/current-focus.data";

type StudyCalendarProps = {
  goal: CurrentFocusGoal;
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

  return "border-[var(--tag-violet-border)] text-[var(--tag-violet-text)]";
}

function getTaskSummary(tasks: StudyTask[]): string {
  return `${tasks.length} ${tasks.length === 1 ? "task" : "tasks"}`;
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

export default function StudyCalendar({ goal }: StudyCalendarProps) {
  const studyWeeks = buildStudyWeeks(goal.studyDays);
  const defaultWeekIndex = getDefaultWeekIndex(studyWeeks);
  const [visibleWeekIndex, setVisibleWeekIndex] = useState<number>(defaultWeekIndex);
  const [selectedDate, setSelectedDate] = useState<string | null>(() =>
    getSelectedDateForWeek(studyWeeks[defaultWeekIndex] ?? []),
  );

  const visibleWeek = studyWeeks[visibleWeekIndex] ?? [];
  const selectedStudyDay =
    visibleWeek.find((weekDay) => weekDay.studyDay?.date === selectedDate)?.studyDay ?? null;

  function handleWeekChange(nextWeekIndex: number): void {
    const nextWeek = studyWeeks[nextWeekIndex] ?? [];

    setVisibleWeekIndex(nextWeekIndex);
    setSelectedDate(getSelectedDateForWeek(nextWeek));
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

      <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-7">
        {visibleWeek.map((weekDay) => {
          const isSelected = weekDay.date === selectedDate;
          const isOutsideRange = !weekDay.studyDay;

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
                  <p className="font-mono text-[10px] uppercase tracking-wide text-foreground/60">
                    {getTaskSummary(weekDay.studyDay.tasks)}
                  </p>
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
                      )}`}
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
        </div>

        {selectedStudyDay ? (
          <div className="space-y-3">
            {selectedStudyDay.tasks.map((task) => (
              <article
                key={task.id}
                className="space-y-2 border border-dashed border-[var(--border-muted)] bg-background/30 p-3"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="font-mono text-sm text-foreground md:text-base">{task.title}</h4>
                  <span
                    className={`border px-2 py-1 font-mono text-[10px] uppercase tracking-wide ${getTaskTypeClass(
                      task.type,
                    )}`}
                  >
                    {task.type}
                  </span>
                </div>
                <p className="text-sm leading-7 text-foreground/85">{task.description}</p>
              </article>
            ))}
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
