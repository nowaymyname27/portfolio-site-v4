import { kv } from "@vercel/kv";

import {
  CURRENT_FOCUS_BOARD_KEY,
  createEmptyCurrentFocusBoard,
  getCurrentFocusWeekStart,
  normalizeCurrentFocusBoard,
  type CurrentFocusBoard,
} from "@/app/current-focus/current-focus.data";

function isKvConfigured(): boolean {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

export async function getCurrentFocusBoard(): Promise<CurrentFocusBoard> {
  const currentWeekStart = getCurrentFocusWeekStart();

  if (!isKvConfigured()) {
    return createEmptyCurrentFocusBoard(currentWeekStart);
  }

  const board = await kv.get<CurrentFocusBoard>(CURRENT_FOCUS_BOARD_KEY);

  if (!board || typeof board !== "object") {
    return createEmptyCurrentFocusBoard(currentWeekStart);
  }

  const candidateWeekStart = (board as Partial<CurrentFocusBoard>).weekStart;

  if (candidateWeekStart !== currentWeekStart) {
    return createEmptyCurrentFocusBoard(currentWeekStart);
  }

  return normalizeCurrentFocusBoard(board, currentWeekStart);
}

export async function saveCurrentFocusBoard(board: CurrentFocusBoard): Promise<CurrentFocusBoard> {
  if (!isKvConfigured()) {
    throw new Error("Vercel KV is not configured.");
  }

  const normalizedBoard = normalizeCurrentFocusBoard(board, board.weekStart);
  await kv.set(CURRENT_FOCUS_BOARD_KEY, normalizedBoard);
  return normalizedBoard;
}
