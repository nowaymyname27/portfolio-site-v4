import { NextResponse } from "next/server";

import {
  clearCurrentFocusAdminSession,
  enableCurrentFocusAdminSession,
  hasCurrentFocusAdminSecret,
  validateCurrentFocusAdminSecret,
} from "@/app/lib/current-focus-admin";

type AdminSessionRequest = {
  secret?: string;
};

export async function POST(request: Request) {
  if (!hasCurrentFocusAdminSecret()) {
    return NextResponse.json(
      { error: "Admin editing is not configured." },
      { status: 503 },
    );
  }

  const body = (await request.json()) as AdminSessionRequest;

  if (!body.secret || !validateCurrentFocusAdminSecret(body.secret)) {
    return NextResponse.json({ error: "Invalid admin secret." }, { status: 401 });
  }

  await enableCurrentFocusAdminSession();

  return NextResponse.json({ success: true });
}

export async function DELETE() {
  await clearCurrentFocusAdminSession();

  return NextResponse.json({ success: true });
}
