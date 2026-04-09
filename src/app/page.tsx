import { getProducts } from '../app/lib/supabase/queries'
import ProductGrid from '../app/components/catalog/ProductGrid'

export default async function Page() {
  const products = await getProducts()
  return <ProductGrid products={products} />
}