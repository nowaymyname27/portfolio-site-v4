import type { Metadata } from "next";

import GoalSummary from "@/app/current-focus/components/GoalSummary";
import StudyCalendar from "@/app/current-focus/components/StudyCalendar";
import { isCurrentFocusAdmin } from "@/app/lib/current-focus-admin";
import { getCurrentFocusBoard } from "@/app/lib/current-focus-store";

export const metadata: Metadata = {
  title: "Current Focus | Jose Ramirez",
  description: "A live weekly snapshot of what Jose Ramirez is focused on right now.",
};

export const dynamic = "force-dynamic";

type CurrentFocusPageProps = {
  searchParams: Promise<{
    edit?: string;
  }>;
};

export default async function CurrentFocusPage({ searchParams }: CurrentFocusPageProps) {
  const [{ edit }, board, isAdmin] = await Promise.all([
    searchParams,
    getCurrentFocusBoard(),
    isCurrentFocusAdmin(),
  ]);

  return (
    <div className="space-y-6 pb-8 pt-6 md:space-y-8 md:pb-10 md:pt-8">
      <GoalSummary />
      <StudyCalendar initialBoard={board} editModeRequested={edit === "1"} initialIsAdmin={isAdmin} />
    </div>
  );
}
