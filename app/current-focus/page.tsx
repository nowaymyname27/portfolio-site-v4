import type { Metadata } from "next";

import GoalSummary from "@/app/current-focus/components/GoalSummary";
import StudyCalendar from "@/app/current-focus/components/StudyCalendar";
import {
  getCurrentFocusWeekStart,
  getNextCurrentFocusWeekStart,
  resolveCurrentFocusWeekStart,
} from "@/app/current-focus/current-focus.data";
import { isCurrentFocusAdmin } from "@/app/lib/current-focus-admin";
import { getCurrentFocusTaskPresets } from "@/app/lib/current-focus-preset-store";
import { getCurrentFocusBoard } from "@/app/lib/current-focus-store";

export const metadata: Metadata = {
  title: "Current Focus | Jose Ramirez",
  description: "A live weekly snapshot of what Jose Ramirez is focused on right now.",
};

export const dynamic = "force-dynamic";

type CurrentFocusPageProps = {
  searchParams: Promise<{
    edit?: string;
    week?: string;
  }>;
};

export default async function CurrentFocusPage({ searchParams }: CurrentFocusPageProps) {
  const [{ edit, week }, isAdmin] = await Promise.all([
    searchParams,
    isCurrentFocusAdmin(),
  ]);
  const currentWeekStart = getCurrentFocusWeekStart();
  const nextWeekStart = getNextCurrentFocusWeekStart();
  const resolvedWeekStart = resolveCurrentFocusWeekStart(week, edit === "1" && isAdmin);
  const [board, presets] = await Promise.all([
    getCurrentFocusBoard(resolvedWeekStart),
    getCurrentFocusTaskPresets(),
  ]);

  return (
    <div className="space-y-6 pb-8 pt-6 md:space-y-8 md:pb-10 md:pt-8">
      <GoalSummary />
      <StudyCalendar
        initialBoard={board}
        editModeRequested={edit === "1"}
        initialIsAdmin={isAdmin}
        currentWeekStart={currentWeekStart}
        nextWeekStart={nextWeekStart}
        initialPresets={presets}
      />
    </div>
  );
}
