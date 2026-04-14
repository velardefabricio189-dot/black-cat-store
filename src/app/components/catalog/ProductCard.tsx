import Image from "next/image";
import Link from "next/link";
import type { Product } from "../../../types/index";

export default function ProductCard({ product }: { product: Product }) {
  const primaryImage = product.product_images?.find((img) => img.is_primary);
  const fallbackImage = product.product_images?.[0];

  const imageUrl = primaryImage?.url || fallbackImage?.url || "https://placehold.co/400x400?text=sin imagen";

  // verifica el stock :V
  const isOutOfStock = product.stock === 0;

  return (
    <Link
      href={`/item/${product.id}`}
      className="rounded-2xl overflow-hidden border border-white/30  backdrop-blur-lg backdrop-saturate-150 shadow-[0_8px_32px_rgba(0,0,0,0.1)] hover:bg-white/20 hover:shadow-[0_8px_32px_rgba(0,0,0,0.15)] transition-all duration-300 group block"
    >
      <div className="relative aspect-square overflow-hidden bg-white/5">
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 50vw, 25vw"
          priority={true}
        />

        {/*sold out*/}
        {isOutOfStock && (
          <div className="absolute top-2 right-2 bg-red-500/90 backdrop-blur-sm border border-red-400/50 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md z-10">
            Agotado
          </div>
        )}

        {isOutOfStock && <div className="absolute inset-0 bg-black/20 z-0 backdrop-blur-[1px]"></div>}
      </div>

      <div className="p-3">
        <p className="text-xs text-white/80 drop-shadow-md mb-1 font-medium tracking-wide">
          Bs. {Number(product.price).toFixed(2)}
        </p>
        <p className="text-sm font-semibold text-white drop-shadow-lg line-clamp-2 leading-relaxed">{product.name}</p>
      </div>
    </Link>
  );
}
