"use client";

import Link from "next/link";
import { ArrowLeftIcon, ChevronRightIcon, PencilIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";

import { CreateCategoryDialog } from "@/components/categories/create-category-dialog";
import { DeleteCategoryDialog } from "@/components/categories/delete-category-dialog";
import { EditCategoryDialog } from "@/components/categories/edit-category-dialog";
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
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const buildCategories =
    categories?.filter((c) => c.category_type === "build") ?? [];
  const quitCategories =
    categories?.filter((c) => c.category_type === "quit") ?? [];

  function openEdit(category: Category) {
    setSelectedCategory(category);
    setEditOpen(true);
  }

  function openDelete(category: Category) {
    setSelectedCategory(category);
    setDeleteOpen(true);
  }

  return (
    <div className="space-y-6">
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
            onEdit={openEdit}
            onDelete={openDelete}
          />
          <CategorySection
            title="Quit Categories"
            categories={quitCategories}
            habitCounts={habitCounts ?? {}}
            variant="quit"
            onEdit={openEdit}
            onDelete={openDelete}
          />
        </>
      )}

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

type CategorySectionProps = {
  title: string;
  categories: Category[];
  habitCounts: Record<string, number>;
  variant: "build" | "quit";
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
};

function CategorySection({
  title,
  categories,
  habitCounts,
  variant,
  onEdit,
  onDelete,
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
            <Card
              key={category.id}
              className={
                variant === "build"
                  ? "border-primary/15"
                  : undefined
              }
            >
              <CardHeader className="flex-row items-center justify-between gap-3 py-4">
                <Link
                  href={`/categories/${category.id}`}
                  className="flex min-w-0 flex-1 items-center gap-3"
                >
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
                </Link>
                <div className="flex items-center gap-1">
                  <Badge
                    variant={variant === "build" ? "default" : "secondary"}
                  >
                    {CATEGORY_TYPE_LABELS[variant]}
                  </Badge>
                  {!category.is_default ? (
                    <>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onEdit(category)}
                        aria-label={`Edit ${category.name}`}
                      >
                        <PencilIcon />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onDelete(category)}
                        aria-label={`Delete ${category.name}`}
                      >
                        <Trash2Icon />
                      </Button>
                    </>
                  ) : null}
                  <Link href={`/categories/${category.id}`}>
                    <ChevronRightIcon className="text-muted-foreground size-4" />
                  </Link>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
