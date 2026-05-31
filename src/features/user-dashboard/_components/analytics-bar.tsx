export function AnalyticsBar({
  label,
  percent,
  tone = "primary",
}: {
  label: string;
  percent: number;
  tone?: "primary" | "xp" | "error";
}) {
  const toneClass = {
    primary: "bg-primary",
    xp: "bg-xp",
    error: "bg-error",
  }[tone];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-black text-headline">{label}</p>
        <p className="text-sm font-black text-headline">{percent}%</p>
      </div>
      <div className="h-3 rounded-full bg-border/70 shadow-inner ring-1 ring-border/70 dark:bg-border/60 dark:ring-border/80">
        <div
          className={["h-full rounded-full", toneClass].join(" ")}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
