export const CURRENT_FOCUS_TITLE = "This Week's Focus";

export const CURRENT_FOCUS_DESCRIPTION =
  "A flexible weekly list of what I am actively working through right now.";

export const CURRENT_FOCUS_BOARD_KEY_PREFIX = "current-focus:board";
export const CURRENT_FOCUS_TASK_PRESETS_KEY = "current-focus:task-presets";

export const CURRENT_FOCUS_COLOR_OPTIONS = [
  "cyan",
  "blue",
  "sky",
  "indigo",
  "violet",
  "amber",
  "rose",
  "emerald",
  "lime",
  "orange",
  "yellow",
  "zinc",
] as const;

export type CurrentFocusColor = (typeof CURRENT_FOCUS_COLOR_OPTIONS)[number];

export type CurrentFocusTask = {
  id: string;
  title: string;
  color: CurrentFocusColor;
  completed: boolean;
};

export type CurrentFocusTaskPreset = {
  id: string;
  title: string;
  color: CurrentFocusColor;
};

export type CurrentFocusDay = {
  date: string;
  tasks: CurrentFocusTask[];
};

export type CurrentFocusBoard = {
  weekStart: string;
  title: string;
  description: string;
  days: CurrentFocusDay[];
};

function createUtcDate(date: string): Date {
  return new Date(`${date}T00:00:00Z`);
}

function formatDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function getCurrentFocusWeekStart(referenceDate = new Date()): string {
  const weekStart = new Date(
    Date.UTC(referenceDate.getUTCFullYear(), referenceDate.getUTCMonth(), referenceDate.getUTCDate()),
  );
  const dayOfWeek = weekStart.getUTCDay();
  const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

  weekStart.setUTCDate(weekStart.getUTCDate() - daysFromMonday);
  return formatDateKey(weekStart);
}

export function getNextCurrentFocusWeekStart(referenceDate = new Date()): string {
  const currentWeekStart = createUtcDate(getCurrentFocusWeekStart(referenceDate));
  currentWeekStart.setUTCDate(currentWeekStart.getUTCDate() + 7);
  return formatDateKey(currentWeekStart);
}

export function resolveCurrentFocusWeekStart(requestedWeek: string | undefined, isAdmin: boolean): string {
  const currentWeekStart = getCurrentFocusWeekStart();

  if (requestedWeek === currentWeekStart) {
    return currentWeekStart;
  }

  const nextWeekStart = getNextCurrentFocusWeekStart();

  if (isAdmin && requestedWeek === nextWeekStart) {
    return nextWeekStart;
  }

  return currentWeekStart;
}

export function getCurrentFocusBoardKey(weekStart: string): string {
  return `${CURRENT_FOCUS_BOARD_KEY_PREFIX}:${weekStart}`;
}

export function getCurrentFocusWeekDates(weekStart: string): string[] {
  const start = createUtcDate(weekStart);

  return Array.from({ length: 7 }, (_, index) => {
    const day = new Date(start);
    day.setUTCDate(start.getUTCDate() + index);
    return formatDateKey(day);
  });
}

export function createEmptyCurrentFocusBoard(weekStart = getCurrentFocusWeekStart()): CurrentFocusBoard {
  return {
    weekStart,
    title: CURRENT_FOCUS_TITLE,
    description: CURRENT_FOCUS_DESCRIPTION,
    days: getCurrentFocusWeekDates(weekStart).map((date) => ({
      date,
      tasks: [],
    })),
  };
}

export function isCurrentFocusColor(value: string): value is CurrentFocusColor {
  return CURRENT_FOCUS_COLOR_OPTIONS.includes(value as CurrentFocusColor);
}

export function isCurrentFocusWeekDate(weekStart: string, date: string): boolean {
  return getCurrentFocusWeekDates(weekStart).includes(date);
}

export function normalizeCurrentFocusBoard(board: unknown, weekStart = getCurrentFocusWeekStart()): CurrentFocusBoard {
  const fallbackBoard = createEmptyCurrentFocusBoard(weekStart);

  if (!board || typeof board !== "object") {
    return fallbackBoard;
  }

  const candidate = board as Partial<CurrentFocusBoard>;
  const daysByDate = new Map<string, CurrentFocusDay>();

  if (Array.isArray(candidate.days)) {
    for (const day of candidate.days) {
      if (!day || typeof day !== "object") {
        continue;
      }

      const candidateDay = day as Partial<CurrentFocusDay>;

      if (typeof candidateDay.date !== "string" || !isCurrentFocusWeekDate(weekStart, candidateDay.date)) {
        continue;
      }

      const tasks = Array.isArray(candidateDay.tasks)
        ? candidateDay.tasks.flatMap((task) => {
            if (!task || typeof task !== "object") {
              return [];
            }

            const candidateTask = task as Partial<CurrentFocusTask>;

            if (
              typeof candidateTask.id !== "string" ||
              typeof candidateTask.title !== "string" ||
              !isCurrentFocusColor(candidateTask.color ?? "") ||
              typeof candidateTask.completed !== "boolean"
            ) {
              return [];
            }

            const title = candidateTask.title.trim();

            if (title.length === 0) {
              return [];
            }

            return [
              {
                id: candidateTask.id,
                title,
                color: candidateTask.color as CurrentFocusColor,
                completed: candidateTask.completed,
              },
            ];
          })
        : [];

      daysByDate.set(candidateDay.date, {
        date: candidateDay.date,
        tasks,
      });
    }
  }

  return {
    weekStart,
    title: CURRENT_FOCUS_TITLE,
    description: CURRENT_FOCUS_DESCRIPTION,
    days: getCurrentFocusWeekDates(weekStart).map((date) => daysByDate.get(date) ?? { date, tasks: [] }),
  };
}

export function normalizeCurrentFocusTaskPresets(presets: unknown): CurrentFocusTaskPreset[] {
  if (!Array.isArray(presets)) {
    return [];
  }

  return presets.flatMap((preset) => {
    if (!preset || typeof preset !== "object") {
      return [];
    }

    const candidatePreset = preset as Partial<CurrentFocusTaskPreset>;

    if (
      typeof candidatePreset.id !== "string" ||
      typeof candidatePreset.title !== "string" ||
      !isCurrentFocusColor(candidatePreset.color ?? "")
    ) {
      return [];
    }

    const title = candidatePreset.title.trim();

    if (title.length === 0) {
      return [];
    }

    return [
      {
        id: candidatePreset.id,
        title,
        color: candidatePreset.color as CurrentFocusColor,
      },
    ];
  });
}
