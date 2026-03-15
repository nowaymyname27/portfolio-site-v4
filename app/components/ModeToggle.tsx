"use client";

import { useState } from "react";

type ModeName = "dark" | "light";

function isModeName(value: string | undefined): value is ModeName {
  return value === "dark" || value === "light";
}

function getNextMode(mode: ModeName): ModeName {
  return mode === "dark" ? "light" : "dark";
}

export default function ModeToggle() {
  const [mode, setMode] = useState<ModeName>(() => {
    if (typeof document === "undefined") {
      return "dark";
    }

    if (!document.documentElement.dataset.theme) {
      document.documentElement.dataset.theme = "slate";
    }

    const datasetMode = document.documentElement.dataset.mode;

    return isModeName(datasetMode) ? datasetMode : "dark";
  });

  const handleClick = () => {
    const nextMode = getNextMode(mode);

    document.documentElement.dataset.mode = nextMode;
    localStorage.setItem("site-mode", nextMode);
    setMode(nextMode);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="border border-[var(--border-muted)] px-2 py-1 font-mono text-xs text-foreground/85 transition-colors hover:border-[var(--hover-border)] hover:text-[var(--link-accent)]"
      aria-label="Toggle color mode"
    >
      {`mode: ${mode}`}
    </button>
  );
}
