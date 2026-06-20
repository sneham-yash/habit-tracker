import { CategoryDetailPage } from "@/components/categories/category-detail-page";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CategoryDetailPage categoryId={id} />;
}
