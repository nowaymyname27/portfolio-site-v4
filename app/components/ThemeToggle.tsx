"use client";

import { useState } from "react";

const THEMES = ["slate", "violet", "crimson", "charcoal"] as const;
type ThemeName = (typeof THEMES)[number];

function isThemeName(value: string | undefined): value is ThemeName {
  return (
    value === "slate" ||
    value === "charcoal" ||
    value === "violet" ||
    value === "crimson"
  );
}

function getNextTheme(theme: ThemeName): ThemeName {
  const currentIndex = THEMES.indexOf(theme);
  const nextIndex = (currentIndex + 1) % THEMES.length;

  return THEMES[nextIndex];
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeName>(() => {
    if (typeof document === "undefined") {
      return "slate";
    }

    const datasetTheme = document.documentElement.dataset.theme;

    return isThemeName(datasetTheme) ? datasetTheme : "slate";
  });

  const handleClick = () => {
    const nextTheme = getNextTheme(theme);

    document.documentElement.dataset.theme = nextTheme;
    localStorage.setItem("site-theme", nextTheme);
    setTheme(nextTheme);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="border border-[var(--border-muted)] px-2 py-1 font-mono text-xs text-foreground/85 transition-colors hover:border-[var(--hover-border)] hover:text-[var(--link-accent)]"
      aria-label="Cycle site theme"
    >
      {`color theme: ${theme}`}
    </button>
  );
}
