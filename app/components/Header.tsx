import ThemeToggle from "@/app/components/ThemeToggle";

const NAV_ITEMS = [
  { label: "Profile", href: "#profile" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Certifications", href: "#certifications" },
  { label: "Contact", href: "#contact" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border-muted)] bg-background/95 backdrop-blur-sm">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-3 px-5 py-4 md:px-8">
        <span className="font-mono text-sm tracking-wide text-foreground">
          Jose.dev
        </span>

        <div className="justify-self-center">
          <ThemeToggle />
        </div>

        <nav
          aria-label="Primary"
          className="justify-self-end flex items-center gap-3 font-mono text-xs sm:gap-5 sm:text-sm"
        >
          {NAV_ITEMS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-foreground/70 transition-colors hover:text-[var(--link-accent)]"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
