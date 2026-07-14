export function DemoDataNotice({
  compact = false,
  className = "",
}: {
  compact?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border border-primary/25 bg-primary/10 text-primary ${compact ? "px-3 py-2 text-xs" : "px-4 py-3 text-sm"} ${className}`}
      role="note"
      aria-label="Demo data notice"
    >
      <span className="font-semibold">Demo data:</span> Names, metrics, jobs, partners and activity
      shown here are illustrative until independently confirmed.
    </div>
  );
}
