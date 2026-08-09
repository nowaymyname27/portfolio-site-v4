import { kv } from "@vercel/kv";

import {
  CURRENT_FOCUS_TASK_PRESETS_KEY,
  normalizeCurrentFocusTaskPresets,
  type CurrentFocusTaskPreset,
} from "@/app/current-focus/current-focus.data";

function isKvConfigured(): boolean {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

export async function getCurrentFocusTaskPresets(): Promise<CurrentFocusTaskPreset[]> {
  if (!isKvConfigured()) {
    return [];
  }

  const presets = await kv.get<CurrentFocusTaskPreset[]>(CURRENT_FOCUS_TASK_PRESETS_KEY);
  return normalizeCurrentFocusTaskPresets(presets);
}

export async function saveCurrentFocusTaskPresets(
  presets: CurrentFocusTaskPreset[],
): Promise<CurrentFocusTaskPreset[]> {
  if (!isKvConfigured()) {
    throw new Error("Vercel KV is not configured.");
  }

  const normalizedPresets = normalizeCurrentFocusTaskPresets(presets);
  await kv.set(CURRENT_FOCUS_TASK_PRESETS_KEY, normalizedPresets);
  return normalizedPresets;
}
