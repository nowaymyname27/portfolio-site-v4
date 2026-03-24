"use client";

import { useEffect, useState } from "react";

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

function getInitialTheme(): ThemeName {
  if (typeof document === "undefined") {
    return "slate";
  }

  const savedTheme = localStorage.getItem("site-theme") ?? undefined;
  if (isThemeName(savedTheme)) {
    return savedTheme;
  }

  const datasetTheme = document.documentElement.dataset.theme;
  return isThemeName(datasetTheme) ? datasetTheme : "slate";
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeName>(getInitialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("site-theme", theme);
  }, [theme]);

  const handleClick = () => {
    setTheme((currentTheme) => getNextTheme(currentTheme));
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
