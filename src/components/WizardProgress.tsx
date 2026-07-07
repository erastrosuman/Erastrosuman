/**
 * Shared progress indicator for one-question-at-a-time form wizards.
 *
 * Used by /checkout and /contact to keep the "how much is left" signal
 * consistent across the site's multi-step forms.
 */
export function WizardProgress({
  current,
  total,
  label,
}: {
  /** Zero-based index of the current step. */
  current: number;
  total: number;
  /** Optional short label for the current step, e.g. "About you". */
  label?: string;
}) {
  const pct = Math.round(((current + 1) / total) * 100);
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-widest text-text-muted mb-2">
        <span>
          Step {current + 1} of {total}
          {label ? ` · ${label}` : ""}
        </span>
        <span>{pct}%</span>
      </div>
      <div className="h-1.5 w-full bg-border-light rounded-full overflow-hidden" aria-hidden>
        <div
          className="h-full bg-saffron rounded-full transition-[width] duration-300 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
