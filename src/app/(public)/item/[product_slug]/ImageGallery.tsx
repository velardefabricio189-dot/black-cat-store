"use client";

import { useState } from "react";
import Image from "next/image";
import type { ProductImage } from "@/src/types";

interface Props {
  images: ProductImage[];
  productName: string;
}

export default function ImageGallery({ images, productName }: Props) {
  const fallback = "https://placehold.co/800x800?text=sin+imagen";
  const primary = images.find((img) => img.is_primary) || images[0];
  const [selected, setSelected] = useState<string>(primary?.url ?? fallback);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const displayImages = images.length > 0 ? images : [];

  return (
    <>
      <div className="flex flex-col gap-3">
        {/* Main image */}
        <div 
          className="relative aspect-4/5 rounded-2xl overflow-hidden bg-black/20 cursor-pointer group"
          onClick={() => setIsFullscreen(true)}
        >
          <Image
            src={selected}
            alt={productName}
            fill
            className="object-cover transition-opacity duration-300"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          {/* Pequeño indicador visual de que se puede hacer clic */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 text-white bg-black/50 px-3 py-1 rounded-full text-sm transition-opacity">
              Ampliar
            </span>
          </div>
        </div>

        {/* Thumbnails — only shown if there are 2+ images */}
        {displayImages.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {displayImages.map((img) => (
              <button
                key={img.id}
                onClick={() => setSelected(img.url)}
                className={`relative shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                  selected === img.url
                    ? "border-white shadow-[0_0_12px_rgba(255,255,255,0.6)]"
                    : "border-white/20 hover:border-white/60"
                }`}
              >
                <Image
                  src={img.url}
                  alt={`${productName} imagen ${img.sort_order + 1}`}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Modal de pantalla completa (Fondo Negro) - CORREGIDO PARA EVITAR DEFORMACIÓN */}
      {isFullscreen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 cursor-pointer"
          onClick={() => setIsFullscreen(false)}
        >
          {/* Botón de cerrar (X) */}
          <button 
            className="absolute top-4 right-4 text-white/70 hover:text-white p-2 z-50 transition-colors bg-black/30 rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              setIsFullscreen(false);
            }}
            aria-label="Cerrar imagen"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256">
              <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path>
            </svg>
          </button>

          {/* Imagen en tamaño completo sin deformar */}
          <div className="flex items-center justify-center max-w-full max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <Image
              src={selected}
              alt={`${productName} ampliada`}
              width={1600}
              height={2000}
              className="max-w-full max-h-[90vh] w-auto h-auto object-contain"
              sizes="100vw"
              priority 
            />
          </div>
        </div>
      )}
    </>
  );
}