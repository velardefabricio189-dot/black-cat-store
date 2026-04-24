"use client";
import Link from "next/link";
import type { Category } from "../../../types/index";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

type Props = {
  categories: Category[];
};

export default function Sidebar({ categories }: Props) {
  const [ws, setWS] = useState<{ number: string; url: string } | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const fetchWahtsapp = async () => {
      const res = await fetch(`/api/settings/whatsapp`, { cache: "no-store" });
      if (!res.ok) return null;
      const data = await res.json();
      setWS(data);
    };
    fetchWahtsapp();
  }, []);

  return (
    <aside className="hidden md:flex flex-col w-56 h-screen sticky top-0 overflow-y-auto px-4 py-6 shrink-0 bg-black/70 backdrop-blur-sm">
      <div className="flex items-center justify-center gap-x-3">
        <Image src="/catlogo.png" alt="Logo" width={50} height={50} className="w-auto h-auto" />
        <span className="font-black text-white">BLACK CAT</span>
      </div>

      <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Categorías</p>

      <nav className="flex flex-col gap-1 flex-1">
        <Link
          href="/"
          className={`text-base px-3 py-2 rounded-lg transition-colors ${
            pathname === "/"
              ? "bg-white/10 text-white font-bold"
              : "text-gray-400 hover:text-white hover:bg-white/5"
          }`}
        >
          Todos
        </Link>
        {categories.map((cat) => {
          const isActive = pathname === `/categoria/${cat.slug}`;
          return (
            <Link
              key={cat.id}
              href={`/categoria/${cat.slug}`}
              className={`text-base px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? "bg-white/10 text-white font-bold"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {cat.name}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-4 border-t border-gray-800">
        <Button
          variant="outline"
          size="sm"
          className="w-full text-base cursor-pointer bg-transparent border-gray-700 text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
          onClick={() => {
            window.open(`https://wa.me/+591${ws?.number}`, "_blank");
          }}
        >
          Enviar sugerencias
        </Button>
      </div>
    </aside>
  );
}