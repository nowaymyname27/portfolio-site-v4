import { randomUUID } from "node:crypto";

import { NextResponse } from "next/server";

import {
  isCurrentFocusColor,
  type CurrentFocusBoard,
  type CurrentFocusColor,
} from "@/app/current-focus/current-focus.data";
import { isCurrentFocusAdmin } from "@/app/lib/current-focus-admin";
import { getCurrentFocusBoard, saveCurrentFocusBoard } from "@/app/lib/current-focus-store";

type AddTaskAction = {
  type: "add-task";
  title?: string;
  color?: string;
};

type UpdateTaskAction = {
  type: "update-task";
  taskId?: string;
  title?: string;
  color?: string;
  completed?: boolean;
};

type DeleteTaskAction = {
  type: "delete-task";
  taskId?: string;
};

type BoardActionRequest = AddTaskAction | UpdateTaskAction | DeleteTaskAction;

function updateBoardTask(
  board: CurrentFocusBoard,
  taskId: string,
  updates: {
    title?: string;
    color?: CurrentFocusColor;
    completed?: boolean;
  },
): CurrentFocusBoard | null {
  let updated = false;

  const tasks = board.tasks.map((task) => {
    if (task.id !== taskId) {
      return task;
    }

    updated = true;

    return {
      ...task,
      title: updates.title ?? task.title,
      color: updates.color ?? task.color,
      completed: updates.completed ?? task.completed,
    };
  });

  if (!updated) {
    return null;
  }

  return {
    ...board,
    tasks,
  };
}

export async function GET() {
  const board = await getCurrentFocusBoard();
  return NextResponse.json({ board });
}

export async function PATCH(request: Request) {
  if (!(await isCurrentFocusAdmin())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = (await request.json()) as BoardActionRequest;
  const board = await getCurrentFocusBoard();

  if (body.type === "add-task") {
    const title = body.title?.trim();

    if (!title || !body.color || !isCurrentFocusColor(body.color)) {
      return NextResponse.json({ error: "Invalid task payload." }, { status: 400 });
    }

    const nextBoard = await saveCurrentFocusBoard({
      ...board,
      tasks: [
        ...board.tasks,
        {
          id: randomUUID(),
          title,
          color: body.color,
          completed: false,
        },
      ],
    });

    return NextResponse.json({ board: nextBoard });
  }

  if (body.type === "update-task") {
    if (typeof body.taskId !== "string") {
      return NextResponse.json({ error: "Task id is required." }, { status: 400 });
    }

    const nextTitle = typeof body.title === "string" ? body.title.trim() : undefined;

    if (body.title !== undefined && !nextTitle) {
      return NextResponse.json({ error: "Task title cannot be empty." }, { status: 400 });
    }

    if (body.color !== undefined && !isCurrentFocusColor(body.color)) {
      return NextResponse.json({ error: "Invalid task color." }, { status: 400 });
    }

    if (body.completed !== undefined && typeof body.completed !== "boolean") {
      return NextResponse.json({ error: "Invalid completion value." }, { status: 400 });
    }

    const nextBoard = updateBoardTask(board, body.taskId, {
      title: nextTitle,
      color: body.color,
      completed: body.completed,
    });

    if (!nextBoard) {
      return NextResponse.json({ error: "Task not found." }, { status: 404 });
    }

    const savedBoard = await saveCurrentFocusBoard(nextBoard);
    return NextResponse.json({ board: savedBoard });
  }

  if (body.type === "delete-task") {
    if (typeof body.taskId !== "string") {
      return NextResponse.json({ error: "Task id is required." }, { status: 400 });
    }

    if (!board.tasks.some((task) => task.id === body.taskId)) {
      return NextResponse.json({ error: "Task not found." }, { status: 404 });
    }

    const nextBoard = await saveCurrentFocusBoard({
      ...board,
      tasks: board.tasks.filter((task) => task.id !== body.taskId),
    });

    return NextResponse.json({ board: nextBoard });
  }

  return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
}
