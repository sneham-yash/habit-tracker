import { TodayProgress } from "@/components/dashboard/today-progress";
import { RizenScoreHero } from "@/components/metrics";

type RizenHeroCardProps = {
  rizenScore: number;
  transformation: number;
  currentStreak: number;
  stepsForward: number;
  completedCount: number;
  totalCount: number;
};

export function RizenHeroCard({
  rizenScore,
  transformation,
  currentStreak,
  stepsForward,
  completedCount,
  totalCount,
}: RizenHeroCardProps) {
  return (
    <RizenScoreHero
      rizenScore={rizenScore}
      transformation={transformation}
      currentStreak={currentStreak}
      stepsForward={stepsForward}
    >
      <TodayProgress
        completedCount={completedCount}
        totalCount={totalCount}
      />
    </RizenScoreHero>
  );
}
