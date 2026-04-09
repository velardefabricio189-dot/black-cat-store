import { getProductsByCategory } from '../../lib/supabase/queries'
import ProductGrid from '../../components/catalog/ProductGrid'

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const products = await getProductsByCategory(slug)
  return <ProductGrid products={products} />
}