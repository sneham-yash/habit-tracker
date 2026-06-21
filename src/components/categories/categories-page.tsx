"use client";

import Link from "next/link";
import {
  ArrowLeftIcon,
  ChevronRightIcon,
  PencilIcon,
  PlusIcon,
  Trash2Icon,
} from "lucide-react";
import { useState } from "react";

import { CreateCategoryDialog } from "@/components/categories/create-category-dialog";
import { DeleteCategoryDialog } from "@/components/categories/delete-category-dialog";
import { EditCategoryDialog } from "@/components/categories/edit-category-dialog";
import { HabitIcon } from "@/components/icons/habit-icon";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CATEGORY_TYPE_LABELS } from "@/constants/habits";
import {
  useCategories,
  useCategoryHabitCounts,
} from "@/hooks/use-categories";
import { typography } from "@/lib/typography";
import { cn } from "@/lib/utils";
import type { Category } from "@/types/database";

type CategoriesPageProps = {
  showBackLink?: boolean;
};

export function CategoriesPage({ showBackLink = false }: CategoriesPageProps) {
  const { data: categories, isLoading, error } = useCategories();
  const { data: habitCounts } = useCategoryHabitCounts();
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );

  const buildCategories =
    categories?.filter((c) => c.category_type === "build") ?? [];
  const quitCategories =
    categories?.filter((c) => c.category_type === "quit") ?? [];
  const totalCount = buildCategories.length + quitCategories.length;

  function openEdit(category: Category) {
    setSelectedCategory(category);
    setEditOpen(true);
  }

  function openDelete(category: Category) {
    setSelectedCategory(category);
    setDeleteOpen(true);
  }

  return (
    <div className="space-y-8">
      {showBackLink ? (
        <Link
          href="/settings"
          className={cn(
            typography.bodyText,
            "text-muted-foreground inline-flex items-center gap-1 hover:text-foreground",
          )}
        >
          <ArrowLeftIcon className="size-4" />
          Settings
        </Link>
      ) : null}

      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className={typography.screenTitle}>Manage Categories</h1>
          <p className={typography.screenSubtitle}>
            Organize your build and quit habits.
          </p>
          {!isLoading && !error && totalCount > 0 ? (
            <p className={typography.metricLabel}>
              {totalCount} {totalCount === 1 ? "category" : "categories"} ·{" "}
              {buildCategories.length} build · {quitCategories.length} quit
            </p>
          ) : null}
        </div>
        <Button
          size="sm"
          variant="outline"
          className="shrink-0"
          onClick={() => setCreateOpen(true)}
        >
          <PlusIcon />
          Add category
        </Button>
      </div>

      {isLoading ? <CategoriesLoadingSkeleton /> : null}

      {error ? (
        <p className="text-destructive text-sm" role="alert">
          {error.message}
        </p>
      ) : null}

      {!isLoading && !error ? (
        <>
          <CategorySection
            categories={buildCategories}
            habitCounts={habitCounts ?? {}}
            variant="build"
            onEdit={openEdit}
            onDelete={openDelete}
          />
          <CategorySection
            categories={quitCategories}
            habitCounts={habitCounts ?? {}}
            variant="quit"
            onEdit={openEdit}
            onDelete={openDelete}
          />
        </>
      ) : null}

      <CreateCategoryDialog open={createOpen} onOpenChange={setCreateOpen} />
      <EditCategoryDialog
        category={selectedCategory}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
      <DeleteCategoryDialog
        category={selectedCategory}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </div>
  );
}

function CategoriesLoadingSkeleton() {
  return (
    <div className="space-y-8">
      {(["build", "quit"] as const).map((variant) => (
        <section key={variant} className="space-y-2">
          <div className="bg-muted/60 h-3 w-36 animate-pulse rounded" />
          <Card className="gap-0 overflow-hidden py-0 shadow-sm">
            <CardContent className="divide-border divide-y p-0">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 px-4 py-3"
                >
                  <div className="bg-muted/60 size-14 shrink-0 animate-pulse rounded-2xl" />
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="bg-muted/60 h-4 w-32 animate-pulse rounded" />
                    <div className="bg-muted/60 h-3 w-16 animate-pulse rounded" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>
      ))}
    </div>
  );
}

type CategorySectionProps = {
  categories: Category[];
  habitCounts: Record<string, number>;
  variant: "build" | "quit";
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
};

function CategorySection({
  categories,
  habitCounts,
  variant,
  onEdit,
  onDelete,
}: CategorySectionProps) {
  const label = CATEGORY_TYPE_LABELS[variant];

  return (
    <section className="space-y-2">
      <p className={typography.metricLabel}>
        {label} · {categories.length}{" "}
        {categories.length === 1 ? "category" : "categories"}
      </p>

      {categories.length === 0 ? (
        <div
          className={cn(
            "rounded-xl border border-dashed p-6 text-center",
            typography.bodyMuted,
          )}
        >
          No {label.toLowerCase()} categories yet.
        </div>
      ) : (
        <Card
          className={cn(
            "gap-0 overflow-hidden py-0 shadow-sm",
            variant === "build"
              ? "border-primary/15 bg-gradient-to-br from-primary/[0.04] to-card"
              : "border-border/80 bg-gradient-to-br from-muted/30 to-card",
          )}
        >
          <CardContent className="divide-border divide-y p-0">
            {categories.map((category) => (
              <CategoryRow
                key={category.id}
                category={category}
                variant={variant}
                habitCount={habitCounts[category.id] ?? 0}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </CardContent>
        </Card>
      )}
    </section>
  );
}

type CategoryRowProps = {
  category: Category;
  variant: "build" | "quit";
  habitCount: number;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
};

function CategoryRow({
  category,
  variant,
  habitCount,
  onEdit,
  onDelete,
}: CategoryRowProps) {
  const isCustom = !category.is_default;

  return (
    <div className="group flex items-center gap-2 transition-colors hover:bg-muted/40 active:bg-muted/60">
      <Link
        href={`/categories/${category.id}`}
        className="flex min-w-0 flex-1 items-center gap-3 px-4 py-3"
      >
        <HabitIcon
          icon={category.icon}
          habitType={variant}
          categoryName={category.name}
          size="lg"
        />
        <div className="min-w-0 flex-1">
          <p className={cn(typography.bodyText, "truncate font-medium")}>
            {category.name}
          </p>
          <p className="text-muted-foreground text-xs">
            {habitCount} {habitCount === 1 ? "habit" : "habits"}
          </p>
        </div>
        <ChevronRightIcon
          className="text-muted-foreground/60 size-4 shrink-0"
          aria-hidden
        />
      </Link>

      {isCustom ? (
        <div className="flex shrink-0 items-center gap-0.5 pr-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-muted-foreground size-8"
            onClick={() => onEdit(category)}
            aria-label={`Edit ${category.name}`}
          >
            <PencilIcon className="size-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-muted-foreground size-8"
            onClick={() => onDelete(category)}
            aria-label={`Delete ${category.name}`}
          >
            <Trash2Icon className="size-4" />
          </Button>
        </div>
      ) : null}
    </div>
  );
}
