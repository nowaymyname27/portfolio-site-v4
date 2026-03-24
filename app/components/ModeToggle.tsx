"use client";

import { useEffect, useState } from "react";

type ModeName = "dark" | "light";

function isModeName(value: string | undefined): value is ModeName {
  return value === "dark" || value === "light";
}

function getNextMode(mode: ModeName): ModeName {
  return mode === "dark" ? "light" : "dark";
}

function getInitialMode(): ModeName {
  if (typeof document === "undefined") {
    return "dark";
  }

  const savedMode = localStorage.getItem("site-mode") ?? undefined;
  if (isModeName(savedMode)) {
    return savedMode;
  }

  const datasetMode = document.documentElement.dataset.mode;
  return isModeName(datasetMode) ? datasetMode : "dark";
}

export default function ModeToggle() {
  const [mode, setMode] = useState<ModeName>(getInitialMode);

  useEffect(() => {
    document.documentElement.dataset.mode = mode;
    localStorage.setItem("site-mode", mode);
  }, [mode]);

  const handleClick = () => {
    setMode((currentMode) => getNextMode(currentMode));
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
