import { Suspense } from "react";

import { CreateHabitPage } from "@/components/create/create-habit-page";

export default function Page() {
  return (
    <Suspense fallback={<p className="text-muted-foreground text-sm">Loading…</p>}>
      <CreateHabitPage />
    </Suspense>
  );
}
