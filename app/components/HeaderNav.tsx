"use client";

import { useState } from "react";

import ThemeToggle from "@/app/components/ThemeToggle";

type NavItem = {
  label: string;
  href: string;
};

type HeaderNavProps = {
  items: NavItem[];
};

export default function HeaderNav({ items }: HeaderNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative flex items-center justify-end">
      <nav
        aria-label="Primary"
        className="hidden items-center gap-3 font-mono text-xs sm:gap-5 sm:text-sm md:flex"
      >
        {items.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="text-foreground/70 transition-colors hover:text-[var(--link-accent)]"
          >
            {item.label}
          </a>
        ))}
      </nav>

      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="border border-[var(--border-muted)] px-2 py-1 font-mono text-xs text-foreground/85 transition-colors hover:border-red-500 hover:text-[var(--link-accent)] md:hidden"
        aria-expanded={isOpen}
        aria-controls="mobile-nav-panel"
      >
        {isOpen ? "nav:close" : "nav:open"}
      </button>

      {isOpen ? (
        <div
          id="mobile-nav-panel"
          className="absolute right-0 top-full mt-3 w-64 space-y-4 border border-dashed border-[var(--border-muted)] bg-background p-4 shadow-lg md:hidden"
        >
          <nav aria-label="Mobile primary" className="space-y-2">
            {items.map((item) => (
              <a
                key={`mobile-${item.label}`}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="block border border-dashed border-[var(--border-muted)] px-3 py-2 font-mono text-sm text-foreground/80 transition-colors hover:border-red-500 hover:text-[var(--link-accent)]"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="border-t border-dashed border-[var(--border-muted)] pt-4">
            <ThemeToggle />
          </div>
        </div>
      ) : null}
    </div>
  );
}
