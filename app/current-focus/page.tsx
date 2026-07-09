import type { Metadata } from "next";

import GoalSummary from "@/app/current-focus/components/GoalSummary";
import StudyCalendar from "@/app/current-focus/components/StudyCalendar";
import { getCurrentFocusGoal } from "@/app/current-focus/current-focus.data";
import { isCurrentFocusAdmin } from "@/app/lib/current-focus-admin";
import { getCompletedTasks, getSkippedDays } from "@/app/lib/current-focus-store";

export const metadata: Metadata = {
  title: "Current Focus | Jose Ramirez",
  description: "Weekly CCNA study plan for Jose Ramirez.",
};

export const dynamic = "force-dynamic";

type CurrentFocusPageProps = {
  searchParams: Promise<{
    edit?: string;
  }>;
};

export default async function CurrentFocusPage({ searchParams }: CurrentFocusPageProps) {
  const [{ edit }, completedTasks, skippedDays, isAdmin] = await Promise.all([
    searchParams,
    getCompletedTasks(),
    getSkippedDays(),
    isCurrentFocusAdmin(),
  ]);
  const goal = getCurrentFocusGoal(skippedDays);

  return (
    <div className="space-y-6 pb-8 pt-6 md:space-y-8 md:pb-10 md:pt-8">
      <GoalSummary goal={goal} />
      <StudyCalendar
        initialCompletedTasks={completedTasks}
        initialSkippedDays={skippedDays}
        editModeRequested={edit === "1"}
        initialIsAdmin={isAdmin}
      />
    </div>
  );
}
