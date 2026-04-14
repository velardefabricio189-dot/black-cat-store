"use client";

import { useParams } from "next/navigation";
import { Category } from "@/src/types/index";
export default function HeaderTitle({ categories }: { categories: Category[] }) {
  const params = useParams();
  const slug = params?.slug as string;
  const currentCategory = categories.find((c) => c.slug === slug);
  const title = currentCategory ? `Catálogo: ${currentCategory.name}` : "Todo el catálogo";

  return <span className="text-lg truncate max-w-[60%] text-white font-bold">{title}</span>;
}
