import { randomUUID } from "node:crypto";

import { NextResponse } from "next/server";

import {
  resolveCurrentFocusWeekStart,
  isCurrentFocusColor,
  isCurrentFocusTaskStatus,
  isCurrentFocusWeekDate,
  type CurrentFocusBoard,
  type CurrentFocusColor,
  type CurrentFocusTaskStatus,
} from "@/app/current-focus/current-focus.data";
import { isCurrentFocusAdmin } from "@/app/lib/current-focus-admin";
import { getCurrentFocusBoard, saveCurrentFocusBoard } from "@/app/lib/current-focus-store";

type AddTaskAction = {
  type: "add-task";
  date?: string;
  title?: string;
  color?: string;
};

type UpdateTaskAction = {
  type: "update-task";
  date?: string;
  taskId?: string;
  title?: string;
  color?: string;
  status?: string;
};

type DeleteTaskAction = {
  type: "delete-task";
  date?: string;
  taskId?: string;
};

type BoardActionRequest = AddTaskAction | UpdateTaskAction | DeleteTaskAction;

function updateBoardDay(
  board: CurrentFocusBoard,
  date: string,
  updater: (tasks: CurrentFocusBoard["days"][number]["tasks"]) => CurrentFocusBoard["days"][number]["tasks"] | null,
): CurrentFocusBoard | null {
  let updated = false;

  const days = board.days.map((day) => {
    if (day.date !== date) {
      return day;
    }

    const nextTasks = updater(day.tasks);

    if (!nextTasks) {
      return day;
    }

    updated = true;

    return {
      ...day,
      tasks: nextTasks,
    };
  });

  if (!updated) {
    return null;
  }

  return {
    ...board,
    days,
  };
}

function validateWeekDate(board: CurrentFocusBoard, date: string | undefined): string | NextResponse {
  if (typeof date !== "string" || !isCurrentFocusWeekDate(board.weekStart, date)) {
    return NextResponse.json({ error: "Invalid week date." }, { status: 400 });
  }

  return date;
}

export async function GET(request: Request) {
  const isAdmin = await isCurrentFocusAdmin();
  const { searchParams } = new URL(request.url);
  const weekStart = resolveCurrentFocusWeekStart(searchParams.get("week") ?? undefined, isAdmin);
  const board = await getCurrentFocusBoard(weekStart);
  return NextResponse.json({ board });
}

export async function PATCH(request: Request) {
  if (!(await isCurrentFocusAdmin())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = (await request.json()) as BoardActionRequest;
  const { searchParams } = new URL(request.url);
  const weekStart = resolveCurrentFocusWeekStart(searchParams.get("week") ?? undefined, true);
  const board = await getCurrentFocusBoard(weekStart);

  if (body.type === "add-task") {
    const date = validateWeekDate(board, body.date);

    if (typeof date !== "string") {
      return date;
    }

    const title = body.title?.trim();

    if (!title || !body.color || !isCurrentFocusColor(body.color)) {
      return NextResponse.json({ error: "Invalid task payload." }, { status: 400 });
    }

    const color = body.color as CurrentFocusColor;

    const nextBoard = updateBoardDay(board, date, (tasks) => [
      ...tasks,
        {
          id: randomUUID(),
          title,
          color,
          status: "pending",
        },
      ]);

    if (!nextBoard) {
      return NextResponse.json({ error: "Day not found." }, { status: 404 });
    }

    const savedBoard = await saveCurrentFocusBoard(nextBoard);
    return NextResponse.json({ board: savedBoard });
  }

  if (body.type === "update-task") {
    const date = validateWeekDate(board, body.date);

    if (typeof date !== "string") {
      return date;
    }

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

    if (body.status !== undefined && !isCurrentFocusTaskStatus(body.status)) {
      return NextResponse.json({ error: "Invalid task status." }, { status: 400 });
    }

    const nextBoard = updateBoardDay(board, date, (tasks) => {
      let updated = false;

      const nextTasks = tasks.map((task) => {
        if (task.id !== body.taskId) {
          return task;
        }

        updated = true;

        return {
          ...task,
          title: nextTitle ?? task.title,
          color: (body.color as CurrentFocusColor | undefined) ?? task.color,
          status: (body.status as CurrentFocusTaskStatus | undefined) ?? task.status,
        };
      });

      return updated ? nextTasks : null;
    });

    if (!nextBoard) {
      return NextResponse.json({ error: "Task not found." }, { status: 404 });
    }

    const savedBoard = await saveCurrentFocusBoard(nextBoard);
    return NextResponse.json({ board: savedBoard });
  }

  if (body.type === "delete-task") {
    const date = validateWeekDate(board, body.date);

    if (typeof date !== "string") {
      return date;
    }

    if (typeof body.taskId !== "string") {
      return NextResponse.json({ error: "Task id is required." }, { status: 400 });
    }

    const nextBoard = updateBoardDay(board, date, (tasks) => {
      if (!tasks.some((task) => task.id === body.taskId)) {
        return null;
      }

      return tasks.filter((task) => task.id !== body.taskId);
    });

    if (!nextBoard) {
      return NextResponse.json({ error: "Task not found." }, { status: 404 });
    }

    const savedBoard = await saveCurrentFocusBoard(nextBoard);
    return NextResponse.json({ board: savedBoard });
  }

  return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
}
