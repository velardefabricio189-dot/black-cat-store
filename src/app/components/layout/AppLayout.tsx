"use client";

import { useParams } from "next/navigation";
import Sidebar from "./Sidebar";
import MobileNav from "./MobileNav";
import type { Category } from "@/src/types/index";

export default function AppLayout({ children, categories }: { children: React.ReactNode; categories: Category[] }) {
  const params = useParams();
  const slug = params?.slug as string;
  const currentCategory = categories.find((c) => c.slug === slug);
  const title = currentCategory?.name;

  return (
    <div className="flex min-h-screen">
      <Sidebar categories={categories} />
      <div className="flex-1 flex flex-col">
        <header className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b">
          <span className="font-semibold text-lg truncate max-w-[60%]">{title}</span>
          <MobileNav categories={categories} />
        </header>

        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
