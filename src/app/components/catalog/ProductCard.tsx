import Image from 'next/image'
import type { Product } from '../../../types/index'

export default function ProductCard({ product }: { product: Product }) {
  const imageUrl = product.image_url || 'https://placehold.co/400x400?text=Producto'
  
  // verifica el stock :V
  const isOutOfStock = product.stock === 0;

  return (
    <div className="bg-white rounded-2xl overflow-hidden border hover:shadow-md transition-shadow group">
      <div className="relative aspect-square bg-gray-100 overflow-hidden">
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300" // Un pequeño efecto hover opcional
          sizes="(max-width: 768px) 50vw, 25vw"
          priority={true} 
        />

        {/*sold out*/}
        {isOutOfStock && (
          <div className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md z-10">
            Agotado
          </div>
        )}
        
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/10 z-0"></div>
        )}
      </div>

      <div className="p-3">
        <p className="text-xs text-gray-400 mb-1">
          Bs. {Number(product.price).toFixed(2)}
        </p>
        <p className="text-sm font-medium text-gray-800 line-clamp-2">
          {product.name}
        </p>
      </div>
    </div>
  )
}