import { getProductsByCategory } from "../../../lib/supabase/queries";
import ProductGrid from "../../../components/catalog/ProductGrid";
import Image from "next/image";
export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const products = await getProductsByCategory(slug);

  return (
    <div>
      <Image
        src="/background.jpg"
        alt="Fondo"
        width={1500}
        height={1500}
        className="absolute inset-0 h-full w-full -z-10 opacity-100 brightness-60 object-cover"
      />
      <ProductGrid products={products} />
    </div>
  );
}
