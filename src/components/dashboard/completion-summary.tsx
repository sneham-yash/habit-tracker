import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type CompletionSummaryProps = {
  completedCount: number;
  totalCount: number;
};

export function CompletionSummary({
  completedCount,
  totalCount,
}: CompletionSummaryProps) {
  const percentage =
    totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Today&apos;s progress</CardTitle>
        <CardDescription>
          {completedCount} of {totalCount}{" "}
          {totalCount === 1 ? "habit" : "habits"} completed
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Daily completion</span>
          <span className="font-medium">{percentage}%</span>
        </div>
        <div
          className="bg-muted h-2 w-full overflow-hidden rounded-full"
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Daily completion percentage"
        >
          <div
            className="bg-primary h-full rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
