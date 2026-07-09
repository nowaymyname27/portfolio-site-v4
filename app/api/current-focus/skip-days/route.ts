import { NextResponse } from "next/server";

import {
  getCurrentFocusGoal,
  getCurrentFocusSkippedDayMapWithDefaults,
  isCurrentFocusDate,
  isCurrentFocusExamDate,
} from "@/app/current-focus/current-focus.data";
import { isCurrentFocusAdmin } from "@/app/lib/current-focus-admin";
import { addSkippedDaySlots, getSkippedDays } from "@/app/lib/current-focus-store";

type SkipDayRequest = {
  date?: string;
  videoSlots?: number;
  labSlots?: number;
};

export async function GET() {
  const skippedDays = await getSkippedDays();

  return NextResponse.json({
    skippedDays,
    mergedSkippedDays: getCurrentFocusSkippedDayMapWithDefaults(skippedDays),
  });
}

export async function PATCH(request: Request) {
  if (!(await isCurrentFocusAdmin())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = (await request.json()) as SkipDayRequest;

  if (
    typeof body.date !== "string" ||
    typeof body.videoSlots !== "number" ||
    typeof body.labSlots !== "number"
  ) {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!isCurrentFocusDate(body.date) || isCurrentFocusExamDate(body.date)) {
    return NextResponse.json({ error: "Invalid current focus date." }, { status: 400 });
  }

  if (body.videoSlots < 0 || body.labSlots < 0) {
    return NextResponse.json({ error: "Skip slots cannot be negative." }, { status: 400 });
  }

  const currentGoal = getCurrentFocusGoal(await getSkippedDays());
  const selectedStudyDay = currentGoal.studyDays.find((studyDay) => studyDay.date === body.date);

  if (!selectedStudyDay) {
    return NextResponse.json({ error: "Unknown study date." }, { status: 400 });
  }

  const availableVideoSlots = selectedStudyDay.tasks.filter((task) => task.type === "video").length;
  const availableLabSlots = selectedStudyDay.tasks.filter((task) => task.type === "lab").length;

  if (body.videoSlots > availableVideoSlots || body.labSlots > availableLabSlots) {
    return NextResponse.json(
      { error: "Skip request exceeds the available video or lab slots for that day." },
      { status: 400 },
    );
  }

  const skippedDays = await addSkippedDaySlots(body.date, body.videoSlots, body.labSlots);

  return NextResponse.json({
    skippedDays,
    mergedSkippedDays: getCurrentFocusSkippedDayMapWithDefaults(skippedDays),
  });
}
