export const CURRENT_FOCUS_TITLE = "This Week's Focus";

export const CURRENT_FOCUS_DESCRIPTION =
  "A flexible weekly list of what I am actively working through right now.";

export const CURRENT_FOCUS_BOARD_KEY = "current-focus:board";

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

export type CurrentFocusBoard = {
  title: string;
  description: string;
  tasks: CurrentFocusTask[];
};

export const DEFAULT_CURRENT_FOCUS_BOARD: CurrentFocusBoard = {
  title: CURRENT_FOCUS_TITLE,
  description: CURRENT_FOCUS_DESCRIPTION,
  tasks: [],
};

export function isCurrentFocusColor(value: string): value is CurrentFocusColor {
  return CURRENT_FOCUS_COLOR_OPTIONS.includes(value as CurrentFocusColor);
}

export function normalizeCurrentFocusBoard(board: unknown): CurrentFocusBoard {
  if (!board || typeof board !== "object") {
    return DEFAULT_CURRENT_FOCUS_BOARD;
  }

  const candidate = board as Partial<CurrentFocusBoard>;
  const tasks = Array.isArray(candidate.tasks)
    ? candidate.tasks.flatMap((task) => {
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
        const color = candidateTask.color as CurrentFocusColor;

        if (title.length === 0) {
          return [];
        }

        return [
          {
            id: candidateTask.id,
            title,
            color,
            completed: candidateTask.completed,
          },
        ];
      })
    : [];

  return {
    title: CURRENT_FOCUS_TITLE,
    description: CURRENT_FOCUS_DESCRIPTION,
    tasks,
  };
}
