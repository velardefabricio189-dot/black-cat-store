"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Category } from "../../../types/index";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { usePathname } from "next/navigation";

type Props = {
  categories: Category[];
};

export default function MobileNav({ categories }: Props) {
  const [open, setOpen] = useState(false);
  const [ws, setWS] = useState<{ number: string; url: string } | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const fetchWahtsapp = async () => {
      const res = await fetch(`/api/settings/whatsapp`, {
        cache: "no-store",
      });
      if (!res.ok) return null;
      const data = await res.json();
      setWS(data);
    };
    fetchWahtsapp();
  }, []);

  return (
    <>
      <button 
        onClick={() => setOpen(true)} 
        // Eliminé el background y le di padding para que parezca parte de la barra
        className="p-4 text-white hover:text-gray-300 transition-colors" 
        aria-label="Abrir menú"
      >
        <Menu size={28} />
      </button>

      {/* Fondo oscuro translúcido al abrir el menú */}
      {open && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" 
          onClick={() => setOpen(false)} 
        />
      )}

      {/* PANEL LATERAL (MODO OSCURO) */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-[#0a0a0a] text-white z-50 shadow-2xl flex flex-col border-r border-gray-800
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Botón para cerrar el menú (la X) */}
        <button 
          onClick={() => setOpen(false)} 
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X size={24} />
        </button>

        {/* Logo */}
        <div className="flex items-center justify-center gap-x-3 mt-8 mb-6">
          <Image src="/catlogo.png" alt="Logo" width={50} height={50} className="w-auto h-auto" />
          <span className="font-black">BLACK CAT</span>
        </div>

        <span className="ml-5 text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">
          Categorías
        </span>

        {/* Navegación de categorías (con scroll y categoría activa) */}
        <nav className="flex flex-col gap-1 px-3 py-2 overflow-y-auto flex-1 min-h-0">
          <Link 
            href="/" 
            onClick={() => setOpen(false)} 
            className={`text-sm px-3 py-2 rounded-lg transition-colors ${
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
                onClick={() => setOpen(false)}
                className={`text-sm px-3 py-2 rounded-lg transition-colors ${
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

       <div className="p-4 border-t border-gray-800 shrink-0 mt-auto">
          <Button
            variant="outline"
            size="sm"
            className="w-full cursor-pointer bg-transparent border-gray-700 text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
            onClick={() => {
              if (ws?.number) {
                window.open(`https://wa.me/+591${ws.number}`, "_blank");
              }
            }}
          >
            Enviar sugerencias
          </Button>
        </div>
      </div>
    </>
  );
}