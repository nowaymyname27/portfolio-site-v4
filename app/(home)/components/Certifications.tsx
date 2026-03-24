import { CERTIFICATIONS } from "@/app/certifications/certifications.data";

const DEFAULT_HOVER_BORDER_CLASS = "hover:border-[var(--hover-border)]";

export default function Certifications() {
  return (
    <section
      id="certifications"
      className="scroll-mt-24 space-y-4 border border-dashed border-[var(--border-muted)] p-4 md:p-6"
    >
      <p className="font-mono text-xs uppercase tracking-wider text-foreground/70">
        [ certifications ]
      </p>

      <div className="space-y-4">
        {CERTIFICATIONS.map((certification) => (
          <article
            key={certification.id}
            className={`space-y-4 border border-dashed border-[var(--border-muted)] bg-[var(--surface-elevated)] p-4 transition-colors md:p-5 ${
              certification.hoverBorderClass ?? DEFAULT_HOVER_BORDER_CLASS
            }`}
          >
            <header className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-mono text-base text-foreground md:text-lg">
                  {certification.name}
                </h3>
                <span
                  className={`border px-2 py-1 font-mono text-xs uppercase tracking-wide ${
                    certification.status === "completed"
                      ? "border-[var(--status-completed-border)] text-[var(--status-completed-text)]"
                      : "border-[var(--status-progress-border)] text-[var(--status-progress-text)]"
                  }`}
                >
                  {certification.status}
                </span>
              </div>

              <p className="font-mono text-sm text-foreground/80">
                {certification.issuer} - {certification.dateLabel}
              </p>
            </header>

            {certification.note ? (
              <p className="text-base leading-7 text-foreground/90">{certification.note}</p>
            ) : null}

            {certification.credentialUrl ? (
              <div className="border-t border-dashed border-[var(--border-muted)] pt-4">
                <a
                  href={certification.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block border border-dashed border-[var(--border-muted)] px-3 py-2 font-mono text-sm text-foreground transition-colors hover:bg-foreground hover:text-background"
                >
                  verify credential
                </a>
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}
