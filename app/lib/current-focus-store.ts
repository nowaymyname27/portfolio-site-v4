import { kv } from "@vercel/kv";

import type { SkippedDayMap } from "@/app/current-focus/current-focus.data";

const CURRENT_FOCUS_COMPLETIONS_KEY = "current-focus:completed-tasks";
const CURRENT_FOCUS_SKIPPED_DAYS_KEY = "current-focus:skipped-days";

export type TaskCompletionMap = Record<string, true>;

function isKvConfigured(): boolean {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

export async function getCompletedTasks(): Promise<TaskCompletionMap> {
  if (!isKvConfigured()) {
    return {};
  }

  const completions = await kv.get<TaskCompletionMap>(CURRENT_FOCUS_COMPLETIONS_KEY);

  if (!completions) {
    return {};
  }

  const normalizedCompletions: TaskCompletionMap = {};

  for (const taskId of Object.keys(completions)) {
    const legacyMatch = taskId.match(/^\d{4}-\d{2}-\d{2}-(video|lab)-(\d+)$/);

    if (legacyMatch) {
      normalizedCompletions[`${legacyMatch[1]}-${legacyMatch[2]}`] = true;
      continue;
    }

    normalizedCompletions[taskId] = true;
  }

  return normalizedCompletions;
}

export async function setTaskCompletion(taskId: string, completed: boolean): Promise<TaskCompletionMap> {
  if (!isKvConfigured()) {
    throw new Error("Vercel KV is not configured.");
  }

  const completions = await getCompletedTasks();

  if (completed) {
    completions[taskId] = true;
  } else {
    delete completions[taskId];
  }

  await kv.set(CURRENT_FOCUS_COMPLETIONS_KEY, completions);

  return completions;
}

export async function setManyTaskCompletions(
  taskIds: string[],
  completed: boolean,
): Promise<TaskCompletionMap> {
  if (!isKvConfigured()) {
    throw new Error("Vercel KV is not configured.");
  }

  const completions = await getCompletedTasks();

  for (const taskId of taskIds) {
    if (completed) {
      completions[taskId] = true;
      continue;
    }

    delete completions[taskId];
  }

  await kv.set(CURRENT_FOCUS_COMPLETIONS_KEY, completions);

  return completions;
}

export async function getSkippedDays(): Promise<SkippedDayMap> {
  if (!isKvConfigured()) {
    return {};
  }

  const skippedDays = await kv.get<SkippedDayMap>(CURRENT_FOCUS_SKIPPED_DAYS_KEY);
  return skippedDays ?? {};
}

export async function addSkippedDaySlots(
  date: string,
  videoSlots: number,
  labSlots: number,
): Promise<SkippedDayMap> {
  if (!isKvConfigured()) {
    throw new Error("Vercel KV is not configured.");
  }

  const skippedDays = await getSkippedDays();
  const currentSlots = skippedDays[date] ?? { videoSlots: 0, labSlots: 0 };

  skippedDays[date] = {
    videoSlots: currentSlots.videoSlots + Math.max(0, videoSlots),
    labSlots: currentSlots.labSlots + Math.max(0, labSlots),
  };

  await kv.set(CURRENT_FOCUS_SKIPPED_DAYS_KEY, skippedDays);

  return skippedDays;
}
