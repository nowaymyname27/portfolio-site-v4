import { NextResponse } from "next/server";

import { CURRENT_FOCUS_TASK_IDS } from "@/app/current-focus/current-focus.data";
import { isCurrentFocusAdmin } from "@/app/lib/current-focus-admin";
import { setTaskCompletion } from "@/app/lib/current-focus-store";

type TaskCompletionRequest = {
  completed?: boolean;
};

type RouteContext = {
  params: Promise<{
    taskId: string;
  }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  if (!(await isCurrentFocusAdmin())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { taskId } = await context.params;

  if (!CURRENT_FOCUS_TASK_IDS.has(taskId)) {
    return NextResponse.json({ error: "Unknown task id." }, { status: 400 });
  }

  const body = (await request.json()) as TaskCompletionRequest;

  if (typeof body.completed !== "boolean") {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const completions = await setTaskCompletion(taskId, body.completed);

  return NextResponse.json({ completions });
}
