import HeaderNav from "@/app/components/HeaderNav";
import ModeToggle from "@/app/components/ModeToggle";
import ThemeToggle from "@/app/components/ThemeToggle";

const NAV_ITEMS = [
  { label: "Profile", href: "#profile" },
  { label: "Projects", href: "#projects" },
  { label: "GitHub", href: "#contributions" },
  { label: "Experience", href: "#experience" },
  { label: "Certifications", href: "#certifications" },
  { label: "Contact", href: "#footer-contact" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border-muted)] bg-background/95 backdrop-blur-sm">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-[1fr_auto] items-center gap-3 px-5 py-4 md:grid-cols-[1fr_auto_1fr] md:px-8">
        <a
          href="#site-top"
          className="font-mono text-sm tracking-wide text-foreground transition-colors hover:text-[var(--link-accent)]"
        >
          jose-ramirez
        </a>

        <div className="hidden justify-self-center md:flex md:items-center md:gap-2">
          <ThemeToggle />
          <ModeToggle />
        </div>

        <div className="justify-self-end">
          <HeaderNav items={NAV_ITEMS} />
        </div>
      </div>
    </header>
  );
}
