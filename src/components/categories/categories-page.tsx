"use client";

import Link from "next/link";
import { ChevronRightIcon, PlusIcon } from "lucide-react";
import { useState } from "react";

import { CreateCategoryDialog } from "@/components/categories/create-category-dialog";
import { HabitIcon } from "@/components/icons/habit-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CATEGORY_TYPE_LABELS } from "@/constants/habits";
import {
  useCategories,
  useCategoryHabitCounts,
} from "@/hooks/use-categories";
import { typography } from "@/lib/typography";
import { cn } from "@/lib/utils";

export function CategoriesPage() {
  const { data: categories, isLoading, error } = useCategories();
  const { data: habitCounts } = useCategoryHabitCounts();
  const [createOpen, setCreateOpen] = useState(false);

  const buildCategories =
    categories?.filter((c) => c.category_type === "build") ?? [];
  const quitCategories =
    categories?.filter((c) => c.category_type === "quit") ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className={typography.screenTitle}>Categories</h1>
          <p className={typography.screenSubtitle}>
            Organize your build and quit habits.
          </p>
        </div>
        <Button size="icon" variant="outline" onClick={() => setCreateOpen(true)}>
          <PlusIcon />
          <span className="sr-only">Create category</span>
        </Button>
      </div>

      {isLoading && (
        <p className={typography.bodyMuted}>Loading categories…</p>
      )}

      {error && (
        <p className="text-destructive text-sm" role="alert">
          {error.message}
        </p>
      )}

      {!isLoading && !error && (
        <>
          <CategorySection
            title="Build Categories"
            categories={buildCategories}
            habitCounts={habitCounts ?? {}}
            variant="build"
          />
          <CategorySection
            title="Quit Categories"
            categories={quitCategories}
            habitCounts={habitCounts ?? {}}
            variant="quit"
          />
        </>
      )}

      <CreateCategoryDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}

type CategorySectionProps = {
  title: string;
  categories: {
    id: string;
    name: string;
    icon?: string | null;
    category_type: "build" | "quit";
    is_default: boolean;
  }[];
  habitCounts: Record<string, number>;
  variant: "build" | "quit";
};

function CategorySection({
  title,
  categories,
  habitCounts,
  variant,
}: CategorySectionProps) {
  return (
    <section className="space-y-3">
      <h2 className={typography.sectionTitle}>{title}</h2>
      {categories.length === 0 ? (
        <div className={cn("rounded-xl border border-dashed p-6 text-center", typography.bodyMuted)}>
          No {CATEGORY_TYPE_LABELS[variant].toLowerCase()} categories yet.
        </div>
      ) : (
        <div className="grid gap-2">
          {categories.map((category) => (
            <Link key={category.id} href={`/categories/${category.id}`}>
              <Card
                className={
                  variant === "build"
                    ? "border-primary/15 hover:border-primary/30"
                    : "hover:border-muted-foreground/30"
                }
              >
                <CardHeader className="flex-row items-center justify-between gap-3 py-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <HabitIcon
                      icon={category.icon}
                      habitType={variant}
                      categoryName={category.name}
                      size="md"
                    />
                    <div>
                      <CardTitle className="text-base">{category.name}</CardTitle>
                      <CardDescription>
                        {habitCounts[category.id] ?? 0}{" "}
                        {(habitCounts[category.id] ?? 0) === 1
                          ? "habit"
                          : "habits"}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={variant === "build" ? "default" : "secondary"}
                    >
                      {CATEGORY_TYPE_LABELS[variant]}
                    </Badge>
                    <ChevronRightIcon className="text-muted-foreground size-4" />
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
