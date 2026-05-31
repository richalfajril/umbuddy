import { StreakIndicator, XPBar } from "@/components/ui";
import Image from "next/image";

// Top bar ringkas untuk progres jabatan, XP, streak, dan online indicator user.
export function DashboardTopBar({
  streakDays,
  currentJabatan,
  currentGolongan,
  currentBadge,
  currentRankXp,
  nextRankXp,
  progressPercentage,
}: {
  streakDays: number;
  currentJabatan: string;
  currentGolongan: string;
  currentBadge: string;
  currentRankXp: number;
  nextRankXp: number;
  progressPercentage: number;
}) {
  return (
    <div className="flex min-h-[68px] items-center justify-between gap-1.5 px-2 sm:min-h-[82px] sm:gap-4 sm:px-4 md:px-8">
      <div className="flex min-w-0 flex-1 items-center gap-1.5 sm:gap-3 md:gap-4">
        <Image
          src={currentBadge}
          alt=""
          width={58}
          height={58}
          className="h-8 w-8 shrink-0 object-contain sm:h-12 sm:w-12 md:h-14 md:w-14"
          aria-hidden="true"
          priority
        />
        <div className="min-w-0 flex-1">
          <div className="grid gap-0">
            <p className="truncate font-display text-sm font-black leading-none text-headline sm:text-lg md:text-xl">
              {currentJabatan}
            </p>
          </div>
          <XPBar
            currentTitle={`Golongan ${currentGolongan}`}
            currentXP={currentRankXp}
            nextThresholdXP={nextRankXp}
            progressPercentage={progressPercentage}
            currentTitleClassName="font-sans text-[10px] font-semibold leading-tight text-muted sm:text-sm"
            valueClassName="font-display text-[10px] font-black text-primary sm:text-sm"
            className="mt-0 w-[min(42vw,420px)] [&_.progress-bar-track]:h-2 sm:[&_.progress-bar-track]:h-3"
          />
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1.5 sm:gap-4">
        <StreakIndicator
          streakDays={streakDays}
          size="sm"
          variant="plain"
          className="min-h-[34px] px-0 text-xs sm:min-h-[44px] sm:text-base"
        />
        <div className="flex min-h-[34px] items-center gap-1 text-[11px] font-bold text-headline sm:min-h-[40px] sm:gap-2 sm:text-xs md:text-sm">
          <span
            className="h-2 w-2 rounded-full bg-primary animate-pulse sm:h-2.5 sm:w-2.5 md:h-3 md:w-3"
            aria-hidden="true"
          />
          <span className="hidden md:inline">4.120 users</span>
          <span className="md:hidden">4.1k</span>
        </div>
      </div>
    </div>
  );
}
