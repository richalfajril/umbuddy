import { Check } from "lucide-react";

// Row misi harian dengan status, checkbox visual, dan progress bar.
export function MissionRow({
  title,
  status,
  progress,
  done = false,
}: {
  title: string;
  status: string;
  progress: number;
  done?: boolean;
}) {
  return (
    <div className="space-y-2">
      {/* Baris utama menampilkan status misi dan indikator selesai. */}
      <div className="flex min-h-[44px] items-center gap-3">
        <div
          className={[
            "flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2",
            done
              ? "border-primary bg-primary text-white"
              : "border-border bg-background dark:bg-surface",
          ].join(" ")}
        >
          {done && <Check className="h-4 w-4" aria-hidden="true" />}
        </div>
        <p className="flex-1 text-sm font-black text-headline">{title}</p>
        <p
          className={[
            "text-xs font-bold",
            done ? "text-primary" : "text-muted",
          ].join(" ")}
        >
          {status}
        </p>
      </div>
      {/* Progress track tetap tampak saat nilai 0 supaya misi belum mulai jelas. */}
      <div className="ml-9 h-2 rounded-full bg-border/70 shadow-inner ring-1 ring-border/70 dark:bg-border/60 dark:ring-border/80">
        <div
          className="h-full rounded-full bg-primary"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
