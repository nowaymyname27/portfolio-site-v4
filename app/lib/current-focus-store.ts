import { kv } from "@vercel/kv";

import {
  CURRENT_FOCUS_BOARD_KEY,
  DEFAULT_CURRENT_FOCUS_BOARD,
  normalizeCurrentFocusBoard,
  type CurrentFocusBoard,
} from "@/app/current-focus/current-focus.data";

function isKvConfigured(): boolean {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

export async function getCurrentFocusBoard(): Promise<CurrentFocusBoard> {
  if (!isKvConfigured()) {
    return DEFAULT_CURRENT_FOCUS_BOARD;
  }

  const board = await kv.get<CurrentFocusBoard>(CURRENT_FOCUS_BOARD_KEY);
  return normalizeCurrentFocusBoard(board);
}

export async function saveCurrentFocusBoard(board: CurrentFocusBoard): Promise<CurrentFocusBoard> {
  if (!isKvConfigured()) {
    throw new Error("Vercel KV is not configured.");
  }

  const normalizedBoard = normalizeCurrentFocusBoard(board);
  await kv.set(CURRENT_FOCUS_BOARD_KEY, normalizedBoard);
  return normalizedBoard;
}
