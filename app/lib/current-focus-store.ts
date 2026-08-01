import { kv } from "@vercel/kv";

import {
  createEmptyCurrentFocusBoard,
  getCurrentFocusBoardKey,
  getCurrentFocusWeekStart,
  normalizeCurrentFocusBoard,
  type CurrentFocusBoard,
} from "@/app/current-focus/current-focus.data";

const LEGACY_CURRENT_FOCUS_BOARD_KEY = "current-focus:board";

function isKvConfigured(): boolean {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

export async function getCurrentFocusBoard(weekStart: string): Promise<CurrentFocusBoard> {
  if (!isKvConfigured()) {
    return createEmptyCurrentFocusBoard(weekStart);
  }

  const board = await kv.get<CurrentFocusBoard>(getCurrentFocusBoardKey(weekStart));

  if (!board || typeof board !== "object") {
    if (weekStart !== getCurrentFocusWeekStart()) {
      return createEmptyCurrentFocusBoard(weekStart);
    }

    const legacyBoard = await kv.get<CurrentFocusBoard>(LEGACY_CURRENT_FOCUS_BOARD_KEY);

    if (!legacyBoard || typeof legacyBoard !== "object") {
      return createEmptyCurrentFocusBoard(weekStart);
    }

    const candidateWeekStart = (legacyBoard as Partial<CurrentFocusBoard>).weekStart;

    if (candidateWeekStart !== weekStart) {
      return createEmptyCurrentFocusBoard(weekStart);
    }

    const normalizedLegacyBoard = normalizeCurrentFocusBoard(legacyBoard, weekStart);
    await kv.set(getCurrentFocusBoardKey(weekStart), normalizedLegacyBoard);
    return normalizedLegacyBoard;
  }

  const candidateWeekStart = (board as Partial<CurrentFocusBoard>).weekStart;

  if (candidateWeekStart !== weekStart) {
    return createEmptyCurrentFocusBoard(weekStart);
  }

  return normalizeCurrentFocusBoard(board, weekStart);
}

export async function saveCurrentFocusBoard(board: CurrentFocusBoard): Promise<CurrentFocusBoard> {
  if (!isKvConfigured()) {
    throw new Error("Vercel KV is not configured.");
  }

  const normalizedBoard = normalizeCurrentFocusBoard(board, board.weekStart);
  await kv.set(getCurrentFocusBoardKey(board.weekStart), normalizedBoard);
  return normalizedBoard;
}
