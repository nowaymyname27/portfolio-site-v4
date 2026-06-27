import type { Metadata } from "next";

import GoalSummary from "@/app/current-focus/components/GoalSummary";
import MilestoneList from "@/app/current-focus/components/MilestoneList";
import StudyCalendar from "@/app/current-focus/components/StudyCalendar";
import { CURRENT_FOCUS_GOAL } from "@/app/current-focus/current-focus.data";

export const metadata: Metadata = {
  title: "Current Focus | Jose Ramirez",
  description: "Weekly CCNA study plan and checkpoints for Jose Ramirez.",
};

export default function CurrentFocusPage() {
  return (
    <div className="space-y-6 pb-8 pt-6 md:space-y-8 md:pb-10 md:pt-8">
      <GoalSummary goal={CURRENT_FOCUS_GOAL} />
      <StudyCalendar goal={CURRENT_FOCUS_GOAL} />
      <MilestoneList milestones={CURRENT_FOCUS_GOAL.milestones} />
    </div>
  );
}
