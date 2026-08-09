import { randomUUID } from "node:crypto";

import { NextResponse } from "next/server";

import {
  isCurrentFocusColor,
  type CurrentFocusColor,
  type CurrentFocusTaskPreset,
} from "@/app/current-focus/current-focus.data";
import { isCurrentFocusAdmin } from "@/app/lib/current-focus-admin";
import {
  getCurrentFocusTaskPresets,
  saveCurrentFocusTaskPresets,
} from "@/app/lib/current-focus-preset-store";

type CreatePresetRequest = {
  title?: string;
  color?: string;
};

type UpdatePresetRequest = {
  id?: string;
  title?: string;
  color?: string;
};

type DeletePresetRequest = {
  id?: string;
};

function isDuplicatePresetTitle(presets: CurrentFocusTaskPreset[], title: string, id?: string): boolean {
  return presets.some((preset) => preset.id !== id && preset.title.toLowerCase() === title.toLowerCase());
}

export async function GET() {
  const presets = await getCurrentFocusTaskPresets();
  return NextResponse.json({ presets });
}

export async function POST(request: Request) {
  if (!(await isCurrentFocusAdmin())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = (await request.json()) as CreatePresetRequest;
  const title = body.title?.trim();

  if (!title || !body.color || !isCurrentFocusColor(body.color)) {
    return NextResponse.json({ error: "Invalid preset payload." }, { status: 400 });
  }

  const presets = await getCurrentFocusTaskPresets();

  if (isDuplicatePresetTitle(presets, title)) {
    return NextResponse.json({ error: "A saved task with that title already exists." }, { status: 400 });
  }

  const nextPresets = [...presets, { id: randomUUID(), title, color: body.color as CurrentFocusColor }];
  const savedPresets = await saveCurrentFocusTaskPresets(nextPresets);

  return NextResponse.json({ presets: savedPresets });
}

export async function PATCH(request: Request) {
  if (!(await isCurrentFocusAdmin())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = (await request.json()) as UpdatePresetRequest;

  if (typeof body.id !== "string") {
    return NextResponse.json({ error: "Preset id is required." }, { status: 400 });
  }

  const nextTitle = typeof body.title === "string" ? body.title.trim() : undefined;

  if (body.title !== undefined && !nextTitle) {
    return NextResponse.json({ error: "Preset title cannot be empty." }, { status: 400 });
  }

  if (body.color !== undefined && !isCurrentFocusColor(body.color)) {
    return NextResponse.json({ error: "Invalid preset color." }, { status: 400 });
  }

  const presets = await getCurrentFocusTaskPresets();

  if (nextTitle && isDuplicatePresetTitle(presets, nextTitle, body.id)) {
    return NextResponse.json({ error: "A saved task with that title already exists." }, { status: 400 });
  }

  let updated = false;

  const nextPresets = presets.map((preset) => {
    if (preset.id !== body.id) {
      return preset;
    }

    updated = true;

    return {
      ...preset,
      title: nextTitle ?? preset.title,
      color: (body.color as CurrentFocusColor | undefined) ?? preset.color,
    };
  });

  if (!updated) {
    return NextResponse.json({ error: "Preset not found." }, { status: 404 });
  }

  const savedPresets = await saveCurrentFocusTaskPresets(nextPresets);
  return NextResponse.json({ presets: savedPresets });
}

export async function DELETE(request: Request) {
  if (!(await isCurrentFocusAdmin())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = (await request.json()) as DeletePresetRequest;

  if (typeof body.id !== "string") {
    return NextResponse.json({ error: "Preset id is required." }, { status: 400 });
  }

  const presets = await getCurrentFocusTaskPresets();

  if (!presets.some((preset) => preset.id === body.id)) {
    return NextResponse.json({ error: "Preset not found." }, { status: 404 });
  }

  const savedPresets = await saveCurrentFocusTaskPresets(presets.filter((preset) => preset.id !== body.id));
  return NextResponse.json({ presets: savedPresets });
}
