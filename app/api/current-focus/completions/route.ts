import { NextResponse } from "next/server";

import { isCurrentFocusTaskId } from "@/app/current-focus/current-focus.data";
import { isCurrentFocusAdmin } from "@/app/lib/current-focus-admin";
import { getCompletedTasks, setManyTaskCompletions } from "@/app/lib/current-focus-store";

type BulkCompletionRequest = {
  taskIds?: string[];
  completed?: boolean;
};

export async function GET() {
  const completions = await getCompletedTasks();

  return NextResponse.json({ completions });
}

export async function PATCH(request: Request) {
  if (!(await isCurrentFocusAdmin())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = (await request.json()) as BulkCompletionRequest;

  if (!Array.isArray(body.taskIds) || typeof body.completed !== "boolean") {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (body.taskIds.some((taskId) => !isCurrentFocusTaskId(taskId))) {
    return NextResponse.json({ error: "Unknown task id." }, { status: 400 });
  }

  const completions = await setManyTaskCompletions(body.taskIds, body.completed);

  return NextResponse.json({ completions });
}
