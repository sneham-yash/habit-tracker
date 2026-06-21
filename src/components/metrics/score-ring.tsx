import { typography } from "@/lib/typography";
import { cn } from "@/lib/utils";

type ScoreRingSize = "sm" | "md" | "lg";

const SIZE_CONFIG: Record<
  ScoreRingSize,
  { container: string; viewBox: string; radius: number; strokeWidth: number; valueClass: string }
> = {
  sm: {
    container: "size-16",
    viewBox: "0 0 64 64",
    radius: 24,
    strokeWidth: 5,
    valueClass: typography.metricValueSm + " text-xl",
  },
  md: {
    container: "size-20",
    viewBox: "0 0 72 72",
    radius: 28,
    strokeWidth: 5,
    valueClass: typography.metricValueSm,
  },
  lg: {
    container: "size-24",
    viewBox: "0 0 80 80",
    radius: 30,
    strokeWidth: 6,
    valueClass: typography.metricValue,
  },
};

type ScoreRingProps = {
  score: number;
  size?: ScoreRingSize;
  className?: string;
};

export function ScoreRing({ score, size = "lg", className }: ScoreRingProps) {
  const config = SIZE_CONFIG[size];
  const center = parseInt(config.viewBox.split(" ")[2] ?? "80", 10) / 2;
  const circumference = 2 * Math.PI * config.radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className={cn("relative shrink-0", config.container, className)}>
      <svg
        className={cn(config.container, "-rotate-90")}
        viewBox={config.viewBox}
        aria-hidden
      >
        <circle
          cx={center}
          cy={center}
          r={config.radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={config.strokeWidth}
          className="text-muted"
        />
        <circle
          cx={center}
          cy={center}
          r={config.radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={config.strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="text-primary transition-all duration-500"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={config.valueClass}>{score}</span>
      </div>
    </div>
  );
}
