import { createHmac, timingSafeEqual } from "node:crypto";

import { cookies } from "next/headers";

const CURRENT_FOCUS_ADMIN_COOKIE = "current-focus-admin";
const CURRENT_FOCUS_ADMIN_PAYLOAD = "enabled";

function getAdminSecret(): string | null {
  return process.env.CURRENT_FOCUS_ADMIN_SECRET ?? null;
}

function signAdminPayload(secret: string): string {
  return createHmac("sha256", secret).update(CURRENT_FOCUS_ADMIN_PAYLOAD).digest("hex");
}

export function hasCurrentFocusAdminSecret(): boolean {
  return Boolean(getAdminSecret());
}

export function validateCurrentFocusAdminSecret(secret: string): boolean {
  const adminSecret = getAdminSecret();

  if (!adminSecret) {
    return false;
  }

  if (secret.length !== adminSecret.length) {
    return false;
  }

  return timingSafeEqual(Buffer.from(secret), Buffer.from(adminSecret));
}

export async function isCurrentFocusAdmin(): Promise<boolean> {
  const adminSecret = getAdminSecret();

  if (!adminSecret) {
    return false;
  }

  const cookieStore = await cookies();
  const cookieValue = cookieStore.get(CURRENT_FOCUS_ADMIN_COOKIE)?.value;

  if (!cookieValue) {
    return false;
  }

  const expectedSignature = signAdminPayload(adminSecret);

  if (cookieValue.length !== expectedSignature.length) {
    return false;
  }

  return timingSafeEqual(Buffer.from(cookieValue), Buffer.from(expectedSignature));
}

export async function enableCurrentFocusAdminSession(): Promise<void> {
  const adminSecret = getAdminSecret();

  if (!adminSecret) {
    throw new Error("CURRENT_FOCUS_ADMIN_SECRET is not configured.");
  }

  const cookieStore = await cookies();

  cookieStore.set(CURRENT_FOCUS_ADMIN_COOKIE, signAdminPayload(adminSecret), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearCurrentFocusAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(CURRENT_FOCUS_ADMIN_COOKIE);
}
